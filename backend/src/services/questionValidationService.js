import Competency from "../models/Competency.js";

/**
 * Validate the structure and content of an AI-generated question
 * @param {Object} item - The question object to validate
 * @throws {Error} - Throws with descriptive error if validation fails
 */
export const validateGeneratedQuestion = async (item) => {
  // Validate question
  if (!item.question || typeof item.question !== "string" || item.question.trim().length === 0) {
    throw new Error("Question must be a non-empty string");
  }

  // Validate options exist and count
  if (!Array.isArray(item.options)) {
    throw new Error("Options must be an array");
  }

  if (item.options.length !== 4) {
    throw new Error(`Must have exactly 4 options, got ${item.options.length}`);
  }

  // Validate option structure and ids
  const validIds = ["A", "B", "C", "D"];
  const optionIds = new Set();

  for (const opt of item.options) {
    if (!opt.id || !validIds.includes(opt.id)) {
      throw new Error(`Option id must be one of A, B, C, D, got: ${opt.id}`);
    }

    if (optionIds.has(opt.id)) {
      throw new Error(`Duplicate option id: ${opt.id}`);
    }
    optionIds.add(opt.id);

    if (!opt.text || typeof opt.text !== "string" || opt.text.trim().length === 0) {
      throw new Error(`Option ${opt.id} text must be a non-empty string`);
    }
  }

  // Ensure all A, B, C, D are present
  if (optionIds.size !== 4 || !["A", "B", "C", "D"].every((id) => optionIds.has(id))) {
    throw new Error("All options must have ids A, B, C, and D");
  }

  // Validate correctAnswer
  if (!item.correctAnswer || !validIds.includes(item.correctAnswer)) {
    throw new Error(`Correct answer must be one of A, B, C, D, got: ${item.correctAnswer}`);
  }

  // Validate difficulty
  if (typeof item.difficulty !== "number" || item.difficulty < 1 || item.difficulty > 5) {
    throw new Error(`Difficulty must be a number between 1 and 5, got: ${item.difficulty}`);
  }

  // Validate competencyId
  if (!item.competencyId) {
    throw new Error("Competency is required");
  }

  const competency = await Competency.findById(item.competencyId);
  if (!competency) {
    throw new Error(`Competency with id ${item.competencyId} does not exist`);
  }

  // Optional: validate confidence if present
  if (item.aiConfidence !== null && item.aiConfidence !== undefined) {
    if (typeof item.aiConfidence !== "number" || item.aiConfidence < 0 || item.aiConfidence > 1) {
      // Warn but don't fail on confidence
      console.warn(`Invalid aiConfidence: ${item.aiConfidence}, expected number 0-1`);
    }
  }
};

/**
 * Validate array of generated questions
 * Returns { valid, invalid } with details about each
 */
export const validateGeneratedQuestions = async (items) => {
  const valid = [];
  const invalid = [];

  for (let i = 0; i < items.length; i++) {
    try {
      await validateGeneratedQuestion(items[i]);
      valid.push(items[i]);
    } catch (err) {
      invalid.push({
        index: i,
        item: items[i],
        error: err.message
      });
    }
  }

  return { valid, invalid };
};

export default { validateGeneratedQuestion, validateGeneratedQuestions };
