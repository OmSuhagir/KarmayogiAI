import express from "express";
import {
  startLearning,
  updateLearningProgress,
  getUserLearningProgress
} from "../controllers/learningProgressController.js";

const router = express.Router();

router.post("/", startLearning);
router.patch("/:id", updateLearningProgress);
router.get("/user/:userId", getUserLearningProgress);

export default router;
