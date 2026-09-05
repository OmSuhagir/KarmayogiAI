import mongoose from "mongoose";
import CompetencyHistory from "../models/CompetencyHistory.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getCompetencyHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { competencyId } = req.query;

    if (!validateObjectId(userId)) return res.status(400).json({ success: false, message: "Invalid user id" });
    if (competencyId && !validateObjectId(competencyId)) return res.status(400).json({ success: false, message: "Invalid competency id" });

    const filter = { userId };
    if (competencyId) filter.competencyId = competencyId;

    const rows = await CompetencyHistory.find(filter)
      .populate("competencyId")
      .sort({ recordedAt: 1 })
      .lean();

    const data = rows.map((r) => ({
      competency: r.competencyId,
      level: r.level,
      score: r.score,
      source: r.source,
      recordedAt: r.recordedAt
    }));

    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
