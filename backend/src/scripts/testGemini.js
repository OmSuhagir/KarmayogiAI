import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const envPath = fileURLToPath(new URL("../.env", import.meta.url));
const envResult = dotenv.config({ path: envPath });

const fail = (message, error) => {
  console.error(`Gemini test failed at ${message}:`, error?.message || error || "unknown error");
  process.exitCode = 1;
};

const run = async () => {
  if (envResult.error) return fail("environment loading", envResult.error);
  if (!process.env.GEMINI_API_KEY) return fail("configuration", new Error("GEMINI_API_KEY is missing"));

  const model = process.env.GEMINI_MODEL || "gemini-3.7-flash";
  console.log(`Testing Gemini SDK with model: ${model}`);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await Promise.race([
      ai.models.generateContent({
        model,
        contents: "Return only this JSON array: [{\"question\":\"What is 2 + 2?\",\"options\":[{\"id\":\"A\",\"text\":\"4\"}],\"correctAnswer\":\"A\"}]",
        config: { responseMimeType: "application/json", temperature: 0 }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("request timed out after 60 seconds")), 60000))
    ]);

    const output = response.text || "";
    console.log("Gemini request succeeded.");
    console.log("Output preview:", output.slice(0, 500));
  } catch (error) {
    fail("Gemini request", error);
  }
};

run().catch((error) => fail("test runner", error));
