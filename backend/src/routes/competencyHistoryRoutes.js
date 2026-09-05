import express from "express";
import { getCompetencyHistory } from "../controllers/competencyHistoryController.js";

const router = express.Router();

// GET /api/competency-history/:userId?competencyId=...
router.get("/:userId", getCompetencyHistory);

export default router;
