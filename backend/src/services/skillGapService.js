import SkillGap from "../models/SkillGap.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import mongoose from "mongoose";

const PRIORITY = (gap) => {
  if (gap >= 3) return "critical";
  if (gap === 2) return "high";
  if (gap === 1) return "medium";
  return "low";
};

export const getUserSkillGaps = async (userId) => {
  return SkillGap.find({ userId }).populate("competencyId").lean();
};

export const getSkillGapById = async (id) => {
  return SkillGap.findById(id).populate("competencyId").lean();
};

export const updateSkillGapStatus = async (id, status) => {
  const allowed = ["open", "in_progress", "resolved"];
  if (!allowed.includes(status)) throw new Error("Invalid status");

  const gap = await SkillGap.findById(id);
  if (!gap) throw new Error("SkillGap not found");

  gap.status = status;
  await gap.save();
  return gap.toObject();
};

// Reconcile skill gaps for a user based on competencyScores from an assessment attempt
// competencyScores: [{ competencyId, score, assessedLevel }]
export const reconcileSkillGaps = async (userId, roleId, competencyScores, attemptId, session = null) => {
  // fetch role by roleId
  const role = await Role.findById(roleId).lean();

  // map expected levels
  const expectedMap = new Map();
  if (role && role.competencies) {
    for (const c of role.competencies) {
      expectedMap.set(String(c.competencyId), c.expectedLevel);
    }
  }

  for (const cs of competencyScores) {
    const compId = String(cs.competencyId);
    const assessedLevel = cs.assessedLevel;
    const expectedLevel = expectedMap.has(compId) ? expectedMap.get(compId) : null;
    if (!expectedLevel) continue; // no expectation

    const gap = expectedLevel - assessedLevel;
    const priority = PRIORITY(gap);

    const filter = { userId, competencyId: compId, status: { $in: ["open", "in_progress"] } };

    // find existing open gap
    const existing = await SkillGap.findOne(filter).session(session);

    if (gap <= 0) {
      // resolve existing open gap if any
      if (existing) {
        existing.status = "resolved";
        existing.currentLevel = assessedLevel;
        existing.gap = gap;
        await existing.save({ session });
      }
      continue;
    }

    // positive gap: create or update
    if (existing) {
      existing.requiredLevel = expectedLevel;
      existing.currentLevel = assessedLevel;
      existing.gap = gap;
      existing.priority = priority;
      existing.identifiedFromAttempt = attemptId;
      await existing.save({ session });
    } else {
      const newGap = new SkillGap({
        userId,
        competencyId: compId,
        requiredLevel: expectedLevel,
        currentLevel: assessedLevel,
        gap,
        priority,
        identifiedFromAttempt: attemptId,
        status: "open"
      });

      await newGap.save({ session });
    }
  }
};
