import express from "express";
import {
  getUser,
  getUserCompetencies,
  getUserSkillGaps,
  getUserRecommendations,
  getUserLearningProgress
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/:id/competencies", getUserCompetencies);
router.get("/:id/skill-gaps", getUserSkillGaps);
router.get("/:id/recommendations", getUserRecommendations);
router.get("/:id/learning-progress", getUserLearningProgress);

export default router;
