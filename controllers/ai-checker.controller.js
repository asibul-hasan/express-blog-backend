import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkAI = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required for AI checking." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const checkPrompt = `
      Analyze the following text to determine if it was written by an AI or a human.
      You MUST respond ONLY with a valid JSON object. Do not wrap it in markdown block quotes (e.g. \`\`\`json).
      
      The JSON object MUST have the following structure:
      {
        "aiPercentage": 50,
        "humanPercentage": 50,
        "highlights": [
          {
            "text": "The exact sentence here.",
            "classification": "human" // or "ai"
          }
        ]
      }
      
      - Provide an overall aiPercentage and humanPercentage (they should sum to 100).
      - Break the text down sentence by sentence into the 'highlights' array. 
      - Classify each segment as 'ai' (very highly likely AI written) or 'human' (likely human written).
      - Ensure the entire text is accounted for in the highlights array, exactly as it appears.
      
      Text to analyze:
      ---
      ${text}
      ---
    `;

    const result = await model.generateContent(checkPrompt);
    let responseText = result.response.text().trim();
    
    console.log("----- RAW GEMINI RESPONSE -----");
    console.log(responseText);
    console.log("-------------------------------");
    
    // Fallback cleanup in case Gemini still wraps it:
    if (responseText.startsWith('\`\`\`json')) {
      responseText = responseText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (responseText.startsWith('\`\`\`')) {
      responseText = responseText.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    const resultJson = JSON.parse(responseText);
    res.json(resultJson);

  } catch (error) {
    console.error("Error checking text for AI generation:", error);
    res.status(500).json({ error: "Error processing the AI check. Please check the backend console." });
  }
};
