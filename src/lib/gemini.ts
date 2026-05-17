import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY belum diisi di .env.local")
}

export const gemini = new GoogleGenAI({
  apiKey,
})