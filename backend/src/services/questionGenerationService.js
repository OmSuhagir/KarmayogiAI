import GeneratedQuestion from "../models/GeneratedQuestion.js";
import Question from "../models/Question.js";
import mongoose from "mongoose";
import Document from "../models/Document.js";
import * as geminiService from "./geminiService.js";
import * as validationService from "./questionValidationService.js";

export const listGeneratedQuestions = async () => {
  return GeneratedQuestion.find().populate("documentId generatedBy validation.reviewedBy").lean();
};

export const getGeneratedQuestionById = async (id) => {
  return GeneratedQuestion.findById(id).populate("documentId generatedBy validation.reviewedBy").lean();
};

export const reviewGeneratedQuestion = async (id, status, reviewedBy) => {
  const allowed = ["approved", "rejected"];
  if (!allowed.includes(status)) throw new Error("Invalid status");

  const gq = await GeneratedQuestion.findById(id);
  if (!gq) throw new Error("GeneratedQuestion not found");
  if (gq.validation && gq.validation.status && gq.validation.status !== "pending") {
    throw new Error("Generated question already reviewed");
  }

  if (status === "approved") {
    // Re-validate before creating Question to ensure data integrity
    try {
      await validationService.validateGeneratedQuestion({
        question: gq.question,
        options: gq.options,
        correctAnswer: gq.correctAnswer,
        difficulty: gq.difficulty,
        competencyId: gq.competencyId,
        aiConfidence: gq.aiConfidence
      });
    } catch (validationErr) {
      throw new Error(`Cannot approve: Generated question failed validation - ${validationErr.message}`);
    }

    // create a Question entry from generated question
    const q = new Question({
      question: gq.question,
      options: gq.options || [],
      correctAnswer: gq.correctAnswer || "",
      competencyId: gq.competencyId,
      subCompetencyId: gq.subCompetencyId,
      difficulty: gq.difficulty,
      source: "ai_generated",
      status: "approved"
    });

    await q.save();
  }

  gq.validation = gq.validation || {};
  gq.validation.status = status;
  gq.validation.reviewedBy = reviewedBy;
  gq.validation.reviewedAt = new Date();

  await gq.save();

  return gq.toObject();
};

export const generateFromDocument = async (documentId, { numQuestions = 5, competencyId = null, difficulty = 2, generatedBy = null } = {}) => {
  const doc = await Document.findById(documentId).lean();
  if (!doc) throw new Error("Document not found");

  // Use the document extracted text as source
  const text = doc.extractedText || "";
  if (!text) throw new Error("Document has no extracted text to generate questions from");

  const items = await geminiService.generateMCQsFromText(text, { numQuestions, competencyId, difficulty });

  // save generated items
  const created = [];
  for (const it of items) {
    const gq = new GeneratedQuestion({
      documentId,
      generatedBy,
      question: it.question,
      options: it.options,
      correctAnswer: it.correctAnswer,
      competencyId: it.competencyId,
      difficulty: it.difficulty,
      aiConfidence: it.aiConfidence,
      validation: { status: "pending" }
    });

    await gq.save();
    created.push(gq.toObject());
  }

  return created;
};
