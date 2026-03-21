import { GoogleGenAI } from '@google/genai';
import fetch from 'node-fetch';

/**
 * Calls Hive AI to perform image forensics
 * @param {Buffer} imageBuffer - The image file buffer
 * @param {string} mimeType - The mime type of the image
 * @returns {Promise<Object>} The API response formatted for the route
 */
export async function detectAiGeneratedImage(imageBuffer, mimeType = "image/jpeg") {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    // Using Hive AI v3 Playground Endpoint
    const response = await fetch('https://api.thehive.ai/api/v3/hive/ai-generated-and-deepfake-content-detection', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${process.env.HIVE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: [
          {
            media_base64: `data:${mimeType};base64,${base64Image}`
          }
        ]
      })
    });

    if (!response.ok) {
        console.error("Hive API error:", response.status, response.statusText);
        // Fallback to Gemini if Hive fails
        console.log("Falling back to Gemini for AI detection...");
        return await fallbackToGemini(imageBuffer, mimeType);
    }

    const hiveResult = await response.json();
    console.log("Hive API response:", hiveResult);
    if (hiveResult.output && hiveResult.output.length > 0) {
      const classes = hiveResult.output[0].classes;
      const aiGeneratedClass = classes.find(c => c.class === 'ai_generated');
      const deepfakeClass = classes.find(c => c.class === 'deepfake');
      
      const aiScore = (aiGeneratedClass && aiGeneratedClass.value !== undefined) ? aiGeneratedClass.value : 0;
      const deepfakeScore = (deepfakeClass && deepfakeClass.value !== undefined) ? deepfakeClass.value : 0;

      // Ensure backward compatibility with the expected output object used in refund.js
      return {
          metadata_detected: false, // Hive deals with purely visual pixels usually, but we supply defaults
          metadata_confidence: "none",
          artifact_score: deepfakeScore,
          classifier_score: aiScore,
          final_label: aiScore >= 0.9 ? "AI-generated" : (aiScore > 0.5 ? "Likely AI-generated" : "Likely real"),
          confidence: Math.max(aiScore, deepfakeScore),
          explanation: `Hive AI detected probability: AI=${(aiScore * 100).toFixed(1)}%, Deepfake=${(deepfakeScore * 100).toFixed(1)}%`
      };
    } else {
        return await fallbackToGemini(imageBuffer, mimeType);
    }
    
  } catch (error) {
    console.error('Error calling Hive API for AI detection:', error);
    return await fallbackToGemini(imageBuffer, mimeType);
  }
}

/**
 * Fallback AI detection using Gemini if Hive fails
 */
async function fallbackToGemini(imageBuffer, mimeType) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const prompt = `You are an AI image forensics system.

Analyze the given image for signs of AI generation using a multi-layer approach:

1. Metadata Analysis:
- Check for C2PA or provenance metadata
- Look for fields like:
  - "c2pa.created"
  - "digitalSourceType: trainedAlgorithmicMedia"
  - "softwareAgent"
  - cryptographic signatures (issuer, hash)
- If present, mark as HIGH confidence AI-generated

2. Image Artifact Analysis:
- Check for:
  - unnatural textures
  - inconsistent lighting/shadows
  - distorted hands, text, or faces
  - repeating patterns
- Assign likelihood score

3. Compression & Format Clues:
- Detect if metadata is stripped (e.g., JPEG conversion)
- Look for re-encoding artifacts

4. Statistical/Model-based Detection:
- Use classifier probability if available

5. Final Decision:
- Combine all signals into:
  - AI-generated (high confidence)
  - Likely AI-generated
  - Uncertain
  - Likely real

Return output as JSON ONLY:
{
  "metadata_detected": true/false,
  "metadata_confidence": "high/low/none",
  "artifact_score": 0-1,
  "classifier_score": 0-1,
  "final_label": "AI-generated / Likely AI-generated / Uncertain / Likely real",
  "confidence": 0-1,
  "explanation": "short reasoning"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: mimeType
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (err) {
      console.error('Gemini fallback failed:', err);
      return {
          "metadata_detected": false,
          "metadata_confidence": "none",
          "artifact_score": 0.8,
          "classifier_score": 0.8,
          "final_label": "Likely AI-generated",
          "confidence": 0.8,
          "explanation": "API fallback"
      };
  }
}
