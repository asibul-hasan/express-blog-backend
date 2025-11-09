import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

// Use free serverless models
const MODELS = [
  "microsoft/Phi-3.5-mini-instruct",
  "mistralai/Mistral-7B-Instruct-v0.3",
  "HuggingFaceH4/zephyr-7b-beta",
];

export const chatbotResponse = async (req, res) => {
  try {
    const { message, conversationHistory, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Clean conversation history
    const cleanHistory = conversationHistory
      .split("\n")
      .filter((line) => line.trim())
      .slice(-8) // Keep last 8 exchanges
      .join("\n");

    // Try models with the official SDK
    let successfulResponse = null;
    let lastError = null;

    for (const model of MODELS) {
      try {
        console.log(`Trying model: ${model}`);

        const response = await hf.chatCompletion({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `${cleanHistory}\nUser: ${message}` },
          ],
          max_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
        });

        const botResponse = response.choices[0]?.message?.content;

        if (botResponse && botResponse.length > 10) {
          successfulResponse = cleanResponse(botResponse);
          console.log(`Success with model: ${model}`);
          break;
        }
      } catch (error) {
        console.error(`Model ${model} failed:`, error.message);
        lastError = error;
        // Continue to next model
      }
    }

    // If all models failed, return fallback
    if (!successfulResponse) {
      console.error("All models failed. Last error:", lastError?.message);

      return res.status(200).json({
        success: true,
        response: generateFallbackResponse(message),
        fallback: true,
      });
    }

    res.status(200).json({
      success: true,
      response: successfulResponse,
    });
  } catch (error) {
    console.error("Critical error in chatbotResponse:", error);

    res.status(200).json({
      success: true,
      response: generateFallbackResponse(req.body.message),
      fallback: true,
    });
  }
};

// Clean up the model response
function cleanResponse(text) {
  if (!text) return "";

  let cleaned = text.replace(/^(Assistant:|Bot:|AI:)/i, "").trim();

  // Limit response length
  if (cleaned.length > 500) {
    cleaned = cleaned.substring(0, 500).trim();
    const lastPeriod = cleaned.lastIndexOf(".");
    const lastQuestion = cleaned.lastIndexOf("?");
    const lastExclamation = cleaned.lastIndexOf("!");
    const lastSentence = Math.max(lastPeriod, lastQuestion, lastExclamation);

    if (lastSentence > 300) {
      cleaned = cleaned.substring(0, lastSentence + 1);
    }
  }

  return (
    cleaned || "I'm here to help with InfoAidTech! What would you like to know?"
  );
}

// Generate contextual fallback response
function generateFallbackResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (
    message.includes("job") ||
    message.includes("career") ||
    message.includes("opportunity")
  ) {
    return "🚀 Check out our latest tech job opportunities on the InfoAidTech careers page! We have positions in web development, mobile dev, DevOps, and more.";
  }

  if (
    message.includes("tutorial") ||
    message.includes("learn") ||
    message.includes("how to") ||
    message.includes("teach")
  ) {
    return "📚 Visit our blog for comprehensive tech tutorials! We cover JavaScript, Python, React, Node.js, and many other technologies with step-by-step guides.";
  }

  if (
    message.includes("blog") ||
    message.includes("article") ||
    message.includes("post") ||
    message.includes("read")
  ) {
    return "✍️ Our blog features the latest articles on web development, mobile apps, DevOps, and AI/ML. Browse our recent posts to stay updated!";
  }

  if (
    message.includes("hi") ||
    message.includes("hello") ||
    message.includes("hey")
  ) {
    return "👋 Hi! I'm Haptic, your InfoAidTech guide! I help with:\n🔧 Tech Tutorials\n💼 Career Opportunities\n📚 Learning Resources\n\nWhat tech topic interests you?";
  }

  if (message.includes("help") || message.includes("what can you")) {
    return "I can help you with:\n\n✅ Programming tutorials (Web Dev, Mobile, AI/ML)\n✅ Tech career guidance and job listings\n✅ Learning resources and best practices\n✅ Navigating InfoAidTech's services\n\nWhat would you like to explore?";
  }

  // Default fallback
  return "I'm here to help with InfoAidTech's tech services! 😊 Ask me about:\n• Programming tutorials\n• Tech job opportunities\n• Latest blog posts\n• Learning resources";
}

// Health check endpoint
export const chatbotHealthCheck = async (req, res) => {
  try {
    const response = await hf.chatCompletion({
      model: MODELS[0],
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 10,
    });

    res.status(200).json({
      success: true,
      status: "operational",
      models: MODELS,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      status: "fallback-mode",
      message: "Using fallback responses",
    });
  }
};
