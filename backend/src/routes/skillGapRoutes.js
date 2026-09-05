import express from "express";
import {
  getUserSkillGaps,
  getSkillGapById,
  updateSkillGapStatus
} from "../controllers/skillGapController.js";

const router = express.Router();

router.get("/user/:userId", getUserSkillGaps);
router.get("/:id", getSkillGapById);
router.patch("/:id/status", updateSkillGapStatus);

export default router;
