import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatbotResponse = async (req, res) => {
  try {
    const { message, conversationHistory, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    // Parse conversation history
    const history = parseConversationHistory(conversationHistory);

    // Validate history - must be empty or start with user
    const validHistory =
      history.length === 0 || history[0].role === "user" ? history : [];

    // Start chat with history
    const chat = model.startChat({
      history: validHistory,
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const botResponse = response.text();

    res.status(200).json({
      success: true,
      response: cleanResponse(botResponse),
    });
  } catch (error) {
    console.error("Error in chatbotResponse:", error);

    // Return intelligent fallback
    res.status(200).json({
      success: true,
      response: generateFallbackResponse(req.body.message),
      fallback: true,
    });
  }
};

// Parse conversation history for Gemini format
function parseConversationHistory(conversationHistory) {
  if (!conversationHistory) return [];

  const history = [];
  const lines = conversationHistory.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    if (line.startsWith("User:")) {
      history.push({
        role: "user",
        parts: [{ text: line.replace("User:", "").trim() }],
      });
    } else if (line.startsWith("Assistant:")) {
      history.push({
        role: "model",
        parts: [{ text: line.replace("Assistant:", "").trim() }],
      });
    }
  }

  // Ensure the history starts with a user message if it's not empty
  if (history.length > 0 && history[0].role !== "user") {
    // Remove the first message if it's not from user
    history.shift();
  }

  // Ensure alternating user/model messages
  const validatedHistory = [];
  let expectUser = true;

  for (const msg of history) {
    if (expectUser && msg.role === "user") {
      validatedHistory.push(msg);
      expectUser = false;
    } else if (!expectUser && msg.role === "model") {
      validatedHistory.push(msg);
      expectUser = true;
    }
  }

  return validatedHistory;
}

// Clean up the response
function cleanResponse(text) {
  if (!text) return "";

  let cleaned = text
    .replace(/^(Assistant:|Bot:|AI:)/i, "")
    .replace(/\*\*/g, "") // Remove markdown bold
    .trim();

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

  return cleaned;
}

// Generate contextual fallback response
function generateFallbackResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (
    message.includes("job") ||
    message.includes("career") ||
    message.includes("opportunity")
  ) {
    return "🚀 Explore exciting tech career opportunities on InfoAidTech! We feature roles in:\n• Web Development (React, Node.js)\n• Mobile Development (iOS, Android)\n• DevOps & Cloud\n• AI/ML Engineering\n\nVisit our careers page to apply!";
  }

  if (
    message.includes("tutorial") ||
    message.includes("learn") ||
    message.includes("how to") ||
    message.includes("teach")
  ) {
    return "📚 Our comprehensive tutorials cover:\n• JavaScript & TypeScript\n• React & Next.js\n• Python & Django\n• Node.js & Express\n• Mobile App Development\n\nCheck out our blog for step-by-step guides!";
  }

  if (
    message.includes("blog") ||
    message.includes("article") ||
    message.includes("post") ||
    message.includes("read")
  ) {
    return "✍️ InfoAidTech Blog features:\n• Latest tech trends & insights\n• Programming tutorials\n• Career development tips\n• Industry best practices\n\nBrowse our latest articles now!";
  }

  if (
    message.includes("hi") ||
    message.includes("hello") ||
    message.includes("hey") ||
    message.includes("greet")
  ) {
    return "👋 Hi! I'm Haptic, your InfoAidTech guide!\n\nI can help you with:\n🔧 Tech Tutorials & Guides\n💼 Career Opportunities\n📚 Learning Resources\n🔍 Site Navigation\n\nWhat tech topic interests you today?";
  }

  if (
    message.includes("help") ||
    message.includes("what can you") ||
    message.includes("what do you")
  ) {
    return "I specialize in InfoAidTech's services! I can assist with:\n\n✅ Programming tutorials (Web, Mobile, AI/ML)\n✅ Tech job listings and career advice\n✅ Learning resources and best practices\n✅ Navigating our blog and services\n\nWhat would you like to know more about?";
  }

  if (
    message.includes("contact") ||
    message.includes("reach") ||
    message.includes("email")
  ) {
    return "📧 Connect with InfoAidTech:\n• Follow us on LinkedIn, Twitter, GitHub\n• Visit our website for contact details\n• Check our blog for the latest updates\n\nHow else can I help you today?";
  }

  // Default intelligent fallback
  return "I'm here to help with InfoAidTech's technology services! 😊\n\nPopular topics:\n• Programming tutorials\n• Tech career opportunities\n• Latest blog articles\n• Learning resources\n\nWhat interests you?";
}

// Health check endpoint
export const chatbotHealthCheck = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say OK");
    const response = await result.response;

    res.status(200).json({
      success: true,
      status: "operational",
      model: "gemini-1.5-flash",
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      status: "fallback-mode",
      message: "Using fallback responses",
    });
  }
};
