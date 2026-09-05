import mongoose from "mongoose";
import * as userService from "../services/userService.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await userService.findUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserCompetencies = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const competencies = await userService.getUserCompetencies(id);

    return res.json({ success: true, data: competencies });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserSkillGaps = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!validateObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const gaps = await userService.getUserSkillGaps(id, status);

    return res.json({ success: true, data: gaps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const recs = await userService.getUserRecommendations(id);

    return res.json({ success: true, data: recs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserLearningProgress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const progress = await userService.getUserLearningProgress(id);

    return res.json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
