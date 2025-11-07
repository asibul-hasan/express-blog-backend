import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN;
const hf = new HfInference(HF_TOKEN);

export const chatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await hf.textGeneration({
      model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
      inputs: message,
    });

    res.status(200).json({ response: response.generated_text });
  } catch (error) {
    console.error("Error in chatbotResponse:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};