import express from "express";
import { createDocument, getDocumentById, getDocumentsByUser } from "../controllers/documentController.js";

const router = express.Router();

router.post("/", createDocument);
router.get("/user/:userId", getDocumentsByUser);
router.get("/:id", getDocumentById);

export default router;
