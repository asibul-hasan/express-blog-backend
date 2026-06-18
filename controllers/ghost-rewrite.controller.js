import { GoogleGenerativeAI } from "@google/generative-ai";

export const ghostRewrite = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // Step 1: The "Humanization" Pass
    const humanizePrompt = `
      [STRICT HUMANIZATION PROTOCOL]
      Text Length: Up to 15,000 words.
      Task: Rewrite the following text to bypass all AI detectors (GPTZero, Turnitin, Originality).
      Rules:
      1. Burstiness: Force irregular sentence structures (Short-Long-Medium).
      2. Perplexity: Use sophisticated, non-predictable vocabulary.
      3. Tone: Maintain a natural, academic-yet-human flow.
      4. Constraint: Do NOT change any technical facts, names, or data.
      Output ONLY the rewritten text without conversational filler.
    `;

    const result = await model.generateContent([humanizePrompt, text]);
    const humanizedText = result.response.text();

    // Step 2: The "Accuracy & Stealth" Audit with Streaming
    const auditPrompt = `
      Compare the following rewritten text to its original concepts implicitly.
      1. Ensure 100% factual accuracy of the provided rewritten text.
      2. If any sentence sounds "too perfect" or "robotic," roughen it up.
      3. Ensure no meaning was lost.
      4. Do not output any conversational filler like "Here is the result", output ONLY the final text.
    `;

    // Set headers for SSE streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Stream the audited response
    const streamResult = await model.generateContentStream([auditPrompt, humanizedText]);

    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      // Format as Server-Sent Event (SSE)
      if (chunkText) {
         res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Error processing high-volume ghost rewrite text:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error processing high-volume text." });
    } else {
      res.end();
    }
  }
};
