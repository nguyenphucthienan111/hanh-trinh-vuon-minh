import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY is missing from environment variables");
      throw new Error("API Key not found");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const createChatSession = (): Chat => {
  const ai = getClient();
  // Using gemini-3-flash-preview for speed and efficiency in chat interactions
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: AI_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 2048, // Increased limit to ensure full responses
    },
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({
        message: message
    });
    
    return response.text || "Xin lỗi, Người Dẫn Đường đang suy ngẫm và chưa thể trả lời ngay lúc này.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Đã có lỗi xảy ra khi kết nối với tri thức. Vui lòng thử lại sau.";
  }
};