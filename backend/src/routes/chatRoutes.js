import express from "express";
import { handleChatMessage, getCompanionContext } from "../controllers/chatController.js";

const router = express.Router();

// POST /api/chat/message - Send a message to Karmayogi Sathi
router.post("/message", handleChatMessage);

// GET /api/chat/context/:userId - Retrieve employee's companion context
router.get("/context/:userId", getCompanionContext);

export default router;
