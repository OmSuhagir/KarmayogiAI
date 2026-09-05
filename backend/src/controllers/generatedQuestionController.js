import mongoose from "mongoose";
import * as qService from "../services/questionGenerationService.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listGeneratedQuestions = async (req, res) => {
  try {
    const rows = await qService.listGeneratedQuestions();
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getGeneratedQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const row = await qService.getGeneratedQuestionById(id);
    if (!row) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: row });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const reviewGeneratedQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewedBy } = req.body;
    if (!validateObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    if (!status || !["approved", "rejected"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const result = await qService.reviewGeneratedQuestion(id, status, reviewedBy);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    const { documentId, numQuestions, competencyId, difficulty } = req.body;
    if (!validateObjectId(documentId)) return res.status(400).json({ success: false, message: "Invalid documentId" });

    const generatedBy = req.user ? req.user._id : null;

    const rows = await qService.generateFromDocument(documentId, { numQuestions, competencyId, difficulty, generatedBy });
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    if (err.name === "QuestionValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "Question generation failed" });
  }
};
