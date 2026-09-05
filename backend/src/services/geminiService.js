import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import * as validationService from "./questionValidationService.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

if (!API_KEY) console.warn("Gemini service not configured: set GEMINI_API_KEY");

const extractJson = (text) => {
  const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

const normalizeQuestions = (parsed, rawText) => {
  let questions = null;
  if (Array.isArray(parsed)) questions = parsed;
  else if (Array.isArray(parsed.questions)) questions = parsed.questions;
  else if (Array.isArray(parsed.items)) questions = parsed.items;
  else if (Array.isArray(parsed.data)) questions = parsed.data;
  if (!questions) throw new Error(`Gemini returned an unexpected MCQ format: ${rawText.slice(0, 400)}`);
  return questions;
};

export const generateMCQsFromText = async (
  text,
  { numQuestions = 5, competencyId = null, difficulty = 2 } = {}
) => {
  if (!API_KEY) throw new Error("Gemini API is not configured");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `You are an MCQ generation assistant. From the source text below, generate exactly ${numQuestions} multiple-choice questions.

Return ONLY valid JSON: an array of objects with these keys:
- question: string
- options: exactly four objects with id A, B, C, D and text string
- correctAnswer: one option id (A, B, C, or D)
- rationale: short explanation
- confidence: number from 0 to 1
- difficulty: number from 1 to 5

Do not wrap the JSON in markdown fences.

Source text:
${text}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0
    }
  });

  const rawText = response.text || "";
  const parsed = extractJson(rawText);
  if (!parsed) throw new Error(`Could not parse JSON from Gemini response: ${rawText.slice(0, 400)}`);

  const questions = normalizeQuestions(parsed, rawText);
  
  // Transform to standard format and return with validation state
  const transformed = questions.map((item) => ({
    question: item?.question,
    options: item?.options || [],
    correctAnswer: item?.correctAnswer || "",
    aiConfidence: typeof item?.confidence === "number" ? item.confidence : null,
    competencyId: competencyId || item?.competency || null,
    difficulty: item?.difficulty || difficulty,
    rationale: item?.rationale || ""
  }));

  // Validate each question and separate valid from invalid
  const { valid, invalid } = await validationService.validateGeneratedQuestions(transformed);

  if (invalid.length > 0) {
    console.warn(`Gemini generated ${invalid.length} invalid question(s):`, invalid);
  }

  // If all questions are invalid, throw error
  if (valid.length === 0) {
    const errorDetails = invalid.map((inv) => `Question ${inv.index + 1}: ${inv.error}`).join("\n");
    const error = new Error(`All Gemini-generated questions failed validation:\n${errorDetails}`);
    error.name = "QuestionValidationError";
    throw error;
  }

  // If some are invalid, return only valid ones and warn
  if (invalid.length > 0) {
    console.warn(
      `Generated ${valid.length} valid and ${invalid.length} invalid questions. ` +
      `Returning only valid questions.`
    );
  }

  return valid;
};

export default { generateMCQsFromText };
