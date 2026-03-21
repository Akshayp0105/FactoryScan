const HEURISTIC_KEYWORDS = ['100%', 'best ever', 'life changing', 'guaranteed', 'buy now', 'miracle', 'amazing', 'perfect'];
const EMOJI_REGEX = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

function heuristicFallback(text) {
  let score = 0;
  
  // Generic phrases
  HEURISTIC_KEYWORDS.forEach(kw => {
    if (text.toLowerCase().includes(kw)) score += 0.2;
  });
  
  // Excessive emojis
  const emojiMatches = text.match(EMOJI_REGEX) || [];
  if (emojiMatches.length > 2) score += 0.2;
  if (emojiMatches.length > 5) score += 0.4;
  
  // Repetition
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 10 && uniqueWords.size / words.length < 0.5) score += 0.4;
  
  const confidence = Math.min(score, 0.99);
  
  return {
    label: confidence > 0.5 ? "spam" : "genuine",
    confidence: confidence > 0.5 ? confidence : (1 - confidence)
  };
}

// Fetch key from .env file or local storage
async function getApiKey() {
  return new Promise(async (resolve) => {
    // Check .env first
    try {
      const res = await fetch(chrome.runtime.getURL('.env'));
      let text = await res.text();
      text = text.trim();
      
      const match = text.match(/GEMINI_API_KEY\s*=\s*(.*)/);
      if (match) {
        return resolve(match[1].trim().replace(/^['"]|['"]$/g, ''));
      }
      
      // If it's just the raw key dumped in the file
      if (text && text.startsWith('AIza')) {
        return resolve(text);
      }
    } catch (e) {
      // ignore
    }

    // Fallback to storage
    chrome.storage.local.get(['geminiApiKey'], (result) => {
      resolve(result.geminiApiKey);
    });
  });
}

// Memory cache to avoid repeating exact identical reviews
const cache = new Map();

async function classifyReviewsWithAPI(reviews, apiKey) {
  const batchedPrompt = `Classify the following product reviews as either genuine or spam/AI-generated.
Consider specificity, authenticity, emotional exaggeration, repetition, and realism.

Respond ONLY in JSON format containing an array of objects for each review in order:
[ { "label": "genuine" or "spam", "confidence": number between 0 and 1 } ]

Reviews to classify:
${reviews.map((r, i) => `Review ${i + 1}: ${r}`).join('\n\n')}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: batchedPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      })
    });
    
    if (!response.ok) throw new Error("API Limit or Auth Error");
    
    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    return JSON.parse(content);
  } catch (error) {
    console.warn("Batch API failed, falling back.", error);
    throw error;
  }
}

// Exact fallback using the specific prompt exactly as required by the instruction
async function classifyReviewExact(review, apiKey) {
  const exactPrompt = `Classify the following product review as either genuine or spam/AI-generated.
Consider specificity, authenticity, emotional exaggeration, repetition, and realism.

Review: ${review}

Respond ONLY in JSON:
{
"label": "genuine" or "spam",
"confidence": number between 0 and 1
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: exactPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json"
        }
      })
    });
    
    if (!response.ok) throw new Error("API Error");
    
    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    return JSON.parse(content);
  } catch (err) {
    console.warn("Exact AI fallback failed", err);
    return heuristicFallback(review);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "CLASSIFY_REVIEWS") {
    // Process them then respond
    handleClassification(message.reviews).then(results => sendResponse({ results }));
    return true; // Keep message channel open for async response
  }
});

async function handleClassification(reviews) {
  const apiKey = await getApiKey();
  const results = new Array(reviews.length).fill(null);
  const toProcess = [];
  const indices = [];

  // Check cache first
  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    if (cache.has(r)) {
      results[i] = Object.assign({}, cache.get(r));
    } else {
      toProcess.push(r);
      indices.push(i);
    }
  }

  if (toProcess.length > 0) {
    if (!apiKey) {
      toProcess.forEach((r, idx) => {
        const res = heuristicFallback(r);
        results[indices[idx]] = res;
        cache.set(r, res);
      });
    } else {
      // Chunk processing to avoid huge payloads. Chunk limit: 5 config.
      const BATCH_SIZE = 5;
      for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
        const chunk = toProcess.slice(i, i + BATCH_SIZE);
        const chunkIndices = indices.slice(i, i + BATCH_SIZE);
        
        let batchResults;
        
        if (chunk.length > 1) {
             try {
               batchResults = await classifyReviewsWithAPI(chunk, apiKey);
               if (!Array.isArray(batchResults) || batchResults.length !== chunk.length) {
                 throw new Error("Batch response mismatch");
               }
             } catch (err) {
               batchResults = await Promise.all(chunk.map(c => classifyReviewExact(c, apiKey)));
             }
        } else {
             batchResults = [(await classifyReviewExact(chunk[0], apiKey))];
        }

        batchResults.forEach((res, idx) => {
          results[chunkIndices[idx]] = res;
          cache.set(chunk[idx], res);
        });
      }
    }
  }
  
  return results;
}
