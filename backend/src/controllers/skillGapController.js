import mongoose from "mongoose";
import * as skillGapService from "../services/skillGapService.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getUserSkillGaps = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!validateObjectId(userId)) return res.status(400).json({ success: false, message: "Invalid user id" });

    const gaps = await skillGapService.getUserSkillGaps(userId);
    return res.json({ success: true, data: gaps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSkillGapById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const gap = await skillGapService.getSkillGapById(id);
    if (!gap) return res.status(404).json({ success: false, message: "Skill gap not found" });

    return res.json({ success: true, data: gap });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSkillGapStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!validateObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const updated = await skillGapService.updateSkillGapStatus(id, status);
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
