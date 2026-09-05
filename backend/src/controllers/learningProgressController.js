import mongoose from "mongoose";
import * as lpService from "../services/learningProgressService.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const startLearning = async (req, res) => {
  try {
    const { userId, resourceId } = req.body;
    if (!validateObjectId(userId) || !validateObjectId(resourceId)) return res.status(400).json({ success: false, message: "Invalid id(s)" });

    const lp = await lpService.startLearning(userId, resourceId);
    return res.status(201).json({ success: true, data: lp });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateLearningProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, progress } = req.body;
    if (!validateObjectId(id) || !validateObjectId(userId)) return res.status(400).json({ success: false, message: "Invalid id(s)" });

    const updated = await lpService.updateProgress(id, userId, progress);
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getUserLearningProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!validateObjectId(userId)) return res.status(400).json({ success: false, message: "Invalid user id" });

    const rows = await lpService.getUserProgress(userId);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
