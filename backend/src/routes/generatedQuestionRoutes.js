import express from "express";
import { listGeneratedQuestions, getGeneratedQuestion, reviewGeneratedQuestion, generateQuestions } from "../controllers/generatedQuestionController.js";

const router = express.Router();

router.get("/", listGeneratedQuestions);
router.get("/:id", getGeneratedQuestion);
router.patch("/:id/review", reviewGeneratedQuestion);
router.post("/generate", generateQuestions);

export default router;
