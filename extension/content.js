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
  // Amazon
  { reviewList: 'div[data-hook="review"]', textBody: 'span[data-hook="review-body"]' },
  // Generic fallbacks
  { reviewList: '.review-container', textBody: '.review-text, .review-content' },
  { reviewList: 'article[class*="review"]', textBody: 'p' },
  { reviewList: 'div.review', textBody: 'p' },
  // Alternative generic
  { reviewList: '[data-testid="review-card"]', textBody: 'p' }
];

function extractReviews() {
  let reviews = [];
  
  for (let sel of selectors) {
    const nodes = document.querySelectorAll(sel.reviewList);
    if (nodes.length > 0) {
      nodes.forEach(node => {
        // Only process reviews we haven't touched yet
        if (node.dataset.reviewAnalyzed === "true" || node.dataset.reviewProcessing === "true") return;
        
        const textNode = node.querySelector(sel.textBody);
        if (textNode) {
          const text = textNode.textContent.trim();
          if (text.length > 15) { // Minimum sanity threshold
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

async function startAnalysis() {
  if (isAnalyzing) return { status: 'already_running' };
  isAnalyzing = true;
  
  const reviews = extractReviews();
  if (reviews.length === 0) {
    isAnalyzing = false;
    safeSendMessage({ action: "ANALYSIS_COMPLETE" });
    return { status: 'ok', found: 0 };
  }
  
  // Extract pure text array
  const reviewTexts = reviews.map(r => r.text);
  
  // Forward batch to background worker to prevent CORS and secure prompt payload
  const response = await safeSendMessage({ action: "CLASSIFY_REVIEWS", reviews: reviewTexts });
  
  isAnalyzing = false;
  safeSendMessage({ action: "ANALYSIS_COMPLETE" });

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
const observer = new MutationObserver(async () => {
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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ANALYZE_REVIEWS") {
    startAnalysis().then(response => {
      sendResponse(response || { status: 'ok', found: 1 });
    });
    return true; // Keep channel open
  } else if (message.action === "GET_STATS") {
    sendResponse(stats);
  }
});

// Initial auto-run if enabled
safeStorageGet(['autoRun']).then((result) => {
  if (result && result.autoRun) {
    setTimeout(startAnalysis, 1000);
  }
});
