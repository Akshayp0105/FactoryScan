// Clean up previous instance of this script if the extension was reloaded 
// without the page being refreshed. This prevents duplicate scripts from running.
if (window.__FACTORY_SCAN_CLEANUP) {
  window.__FACTORY_SCAN_CLEANUP();
}

let observer;
let messageListener;

window.__FACTORY_SCAN_CLEANUP = () => {
  const oldUI = document.getElementById('factory-scan-ui');
  if (oldUI) oldUI.remove();
  
  if (observer) observer.disconnect();
  try {
    if (messageListener && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.removeListener(messageListener);
    }
  } catch (e) {
    // Context might be dead already
  }
};

// Inject our CSS styles natively into the DOM 
const style = document.createElement('style');
style.textContent = `
  .review-checker-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    margin-right: 8px;
    vertical-align: middle;
    font-family: system-ui, -apple-system, sans-serif;
    color: white;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    z-index: 999;
  }
  .review-checker-badge.genuine { background-color: #10b981; }
  .review-checker-badge.spam { background-color: #ef4444; }
  .review-checker-badge.processing { background-color: #6b7280; }
  .review-checker-badge.error { background-color: #f59e0b; }

  #factory-scan-ui {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  #factory-scan-analyze-btn {
    background: #6366f1;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  #factory-scan-analyze-btn:hover { background: #4f46e5; }
  #factory-scan-analyze-btn:disabled { background: #94a3b8; cursor: not-allowed; }

  .fs-spinner {
    width: 16px; height: 16px;
    border: 2px solid #cbd5e1;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: fs-spin 1s linear infinite;
    display: none;
  }
  @keyframes fs-spin { to { transform: rotate(360deg); } }
  .fs-analyzing .fs-spinner { display: inline-block; }
  #factory-scan-status {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;
document.head.appendChild(style);

let stats = { total: 0, genuine: 0, spam: 0 };
let isAnalyzing = false;

// Safety wrappers to prevent "Extension context invalidated" errors
async function safeSendMessage(message) {
  try {
    if (!chrome.runtime?.id) return null;
    return await chrome.runtime.sendMessage(message);
  } catch (e) {
    console.debug("Extension context invalidated");
    return null;
  }
}

async function safeStorageGet(keys) {
  try {
    if (!chrome.runtime?.id) return {};
    return await chrome.storage.local.get(keys);
  } catch (e) {
    console.debug("Extension context invalidated");
    return {};
  }
}

// Configurable selectors to support different types, focused on generic and Amazon specifically
const selectors = [
  // Amazon default & international variations
  { reviewList: 'div[data-hook="review"]', textBody: 'span[data-hook="review-body"]' },
  { reviewList: 'div[id^="customer_review-"]', textBody: '.review-text-content' },
  { reviewList: '.review', textBody: '.review-text, span[data-hook="review-body"]' },
  { reviewList: '.a-section.review', textBody: '.a-expander-content' },
  
  // Generic fallbacks
  { reviewList: '.review-container', textBody: '.review-text, .review-content' },
  { reviewList: 'article[class*="review"]', textBody: 'p, .content' },
  { reviewList: 'div[class*="ReviewCard"]', textBody: 'p, span' },
  { reviewList: '.yotpo-review', textBody: '.content-review' },
  { reviewList: '[data-testid="review-card"]', textBody: 'p, span' }
];

function extractReviews() {
  let reviews = [];
  
  for (let sel of selectors) {
    const nodes = document.querySelectorAll(sel.reviewList);
    if (nodes.length > 0) {
      nodes.forEach(node => {
        if (node.dataset.reviewAnalyzed === "true" || node.dataset.reviewProcessing === "true") {
          // If it was stuck in processing for whatever reason on an old run, clear it (failsafe)
          if (node.dataset.reviewProcessing === "true" && !isAnalyzing) {
             node.dataset.reviewProcessing = "false";
             const stuckBadge = node.querySelector('.review-checker-badge.processing');
             if (stuckBadge) stuckBadge.remove();
          } else {
             return;
          }
        }
        
        const textNode = node.querySelector(sel.textBody);
        if (textNode) {
          const text = textNode.textContent.trim();
          if (text.length > 5) { // Lowered sanity threshold for very short reviews ("Great!")
            node.dataset.reviewProcessing = "true";
            reviews.push({ element: node, text: text, textNode: textNode });
            
            // Show processing badge
            const badge = document.createElement('span');
            badge.className = 'review-checker-badge processing';
            badge.innerHTML = 'ANALYZING...';
            // Prepend inside the text node so it looks clean before the text
            textNode.prepend(badge); 
          }
        }
      });
      // Break early if we found matches to avoid mixing structures
      if (reviews.length > 0) break;
    }
  }
  
  return reviews;
}

function updateBadge(element, label, confidence, error = false) {
  // Find the existing processing badge we prepended earlier
  const existingBadge = element.querySelector('.review-checker-badge');
  
  if (error) {
    if (existingBadge) {
      existingBadge.className = 'review-checker-badge error';
      existingBadge.innerHTML = 'ERROR';
    }
    return;
  }
  
  const score = Math.round(confidence * 100);
  if (existingBadge) {
    existingBadge.className = `review-checker-badge ${label.toLowerCase()}`;
    existingBadge.innerHTML = `${label.toUpperCase()} ${score}%`;
  }
  
  // Update stats
  if (label.toLowerCase() === 'genuine') {
    stats.genuine++;
  } else {
    stats.spam++;
  }
  stats.total++;
  
  // Re-broadcast stats to popup if it's open
  safeSendMessage({ action: "UPDATE_STATS", ...stats });
}

function injectUI() {
  if (document.getElementById('factory-scan-ui')) return;
  
  let anchor = null;
  for (let sel of selectors) {
    const nodes = document.querySelectorAll(sel.reviewList);
    if (nodes.length > 0) {
      anchor = nodes[0];
      break;
    }
  }
  
  if (!anchor || !anchor.parentNode) return;
  
  const ui = document.createElement('div');
  ui.id = 'factory-scan-ui';
  ui.innerHTML = `
    <button id="factory-scan-analyze-btn">FactoryScan: Analyze Reviews</button>
    <div id="factory-scan-status">
      <div class="fs-spinner"></div>
      <span class="fs-text">Ready to scan</span>
    </div>
  `;
  
  anchor.parentNode.insertBefore(ui, anchor);
  
  document.getElementById('factory-scan-analyze-btn').addEventListener('click', (e) => {
    e.preventDefault();
    startAnalysis();
  });
}

function setUIStatus(state, msg) {
  const ui = document.getElementById('factory-scan-ui');
  if (!ui) return;
  
  const btn = document.getElementById('factory-scan-analyze-btn');
  const text = ui.querySelector('.fs-text');
  
  if (state === 'analyzing') {
    ui.classList.add('fs-analyzing');
    btn.disabled = true;
    btn.textContent = 'Analyzing...';
    text.textContent = msg || 'Processing reviews...';
  } else {
    ui.classList.remove('fs-analyzing');
    btn.disabled = false;
    btn.textContent = 'FactoryScan: Analyze Reviews';
    text.textContent = msg || 'Ready';
  }
}

async function startAnalysis() {
  injectUI();

  if (isAnalyzing) return { status: 'already_running' };
  isAnalyzing = true;
  
  const reviews = extractReviews();
  if (reviews.length === 0) {
    isAnalyzing = false;
    safeSendMessage({ action: "ANALYSIS_COMPLETE" });
    setUIStatus('ready', 'No new reviews found to scan.');
    return { status: 'ok', found: 0 };
  }
  
  setUIStatus('analyzing', `Analyzing ${reviews.length} reviews via AI...`);

  // Extract pure text array
  const reviewTexts = reviews.map(r => r.text);
  
  // Forward batch to background worker to prevent CORS and secure prompt payload
  const response = await safeSendMessage({ action: "CLASSIFY_REVIEWS", reviews: reviewTexts });
  
  isAnalyzing = false;
  safeSendMessage({ action: "ANALYSIS_COMPLETE" });
  setUIStatus('ready', `Successfully analyzed ${reviews.length} reviews.`);

  if (response && response.results) {
    response.results.forEach((res, i) => {
      const item = reviews[i];
      item.element.dataset.reviewProcessing = "false";
      item.element.dataset.reviewAnalyzed = "true";
      
      if (res.error) {
        updateBadge(item.textNode, "", 0, true);
      } else {
        updateBadge(item.textNode, res.label, res.confidence);
      }
    });
  }
}

// Keep an eye on the DOM for dynamically loaded reviews
let timeout = null;
observer = new MutationObserver(async () => {
  injectUI();
  
  const result = await safeStorageGet(['autoRun']);
  if (result && result.autoRun && !isAnalyzing) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      startAnalysis();
    }, 1500); // Debounce time
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for manual actions or status queries
messageListener = (message, sender, sendResponse) => {
  if (message.action === "ANALYZE_REVIEWS") {
    startAnalysis().then(response => {
      sendResponse(response || { status: 'ok', found: 1 });
    });
    return true; // Keep channel open
  } else if (message.action === "GET_STATS") {
    sendResponse(stats);
  }
};

chrome.runtime.onMessage.addListener(messageListener);

// Initial auto-run if enabled
safeStorageGet(['autoRun']).then((result) => {
  if (result && result.autoRun) {
    setTimeout(startAnalysis, 1000);
  }
});
