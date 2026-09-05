import express from "express";
import { generateRecommendations, getUserRecommendations, selectRecommendation } from "../controllers/recommendationController.js";

const router = express.Router();

router.post("/generate/:userId", generateRecommendations);
router.get("/user/:userId", getUserRecommendations);
router.post("/:id/select", selectRecommendation);

export default router;
