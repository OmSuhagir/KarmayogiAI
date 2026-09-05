import express from "express";
import {
  getAssessments,
  getAssessmentById,
  getAssessmentQuestions,
  getActiveAttempt,
  startAssessment,
  saveAnswer,
  submitAssessment,
  getAssessmentResult
} from "../controllers/assessmentController.js";

const router = express.Router();

router.get("/", getAssessments);
router.get("/:id", getAssessmentById);
router.get("/:id/questions", getAssessmentQuestions);
router.get("/:id/current-attempt", getActiveAttempt);
router.post("/:id/start", startAssessment);
router.post("/:id/save-answer", saveAnswer);
router.post("/:id/submit", submitAssessment);
router.get("/attempt/:attemptId/result", getAssessmentResult);

export default router;
