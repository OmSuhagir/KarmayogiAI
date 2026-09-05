import mongoose from "mongoose";
import * as recommendationService from "../services/recommendationService.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const generateRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!validateObjectId(userId)) return res.status(400).json({ success: false, message: "Invalid user id" });

    const result = await recommendationService.generateForUser(userId);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!validateObjectId(userId)) return res.status(400).json({ success: false, message: "Invalid user id" });

    const recs = await recommendationService.getRecommendationsForUser(userId);
    return res.json({ success: true, data: recs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const selectRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, resourceId } = req.body;
    if (!validateObjectId(id) || !validateObjectId(userId) || !validateObjectId(resourceId)) {
      return res.status(400).json({ success: false, message: "Invalid id(s)" });
    }

    const progress = await recommendationService.selectRecommendation(id, userId, resourceId);
    return res.status(201).json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
