import mongoose from "mongoose";
import * as documentService from "../services/documentService.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createDocument = async (req, res) => {
  try {
    const payload = req.body; // expect uploader info, file metadata, extractedText optional
    if (!payload || !payload.uploadedBy) return res.status(400).json({ success: false, message: "Missing uploadedBy" });
    if (!validateObjectId(payload.uploadedBy)) return res.status(400).json({ success: false, message: "Invalid uploadedBy id" });

    const doc = await documentService.createDocument(payload);
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const doc = await documentService.getDocumentById(id);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found" });
    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDocumentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!validateObjectId(userId)) return res.status(400).json({ success: false, message: "Invalid user id" });

    const docs = await documentService.getDocumentsByUser(userId);
    return res.json({ success: true, data: docs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
