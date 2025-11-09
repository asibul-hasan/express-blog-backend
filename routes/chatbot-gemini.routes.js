import express from "express";
import { chatbotResponse } from "../controllers/chatbot-gemini.controller.js";

const router = express.Router();

router.post("/chat", chatbotResponse);

export default router;
