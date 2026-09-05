import SkillGap from "../models/SkillGap.js";
import LearningResource from "../models/LearningResource.js";
import Recommendation from "../models/Recommendation.js";
import User from "../models/User.js";
import * as learningProgressService from "./learningProgressService.js";
import mongoose from "mongoose";

// Scoring helpers
const scoreCompetencyMatch = (resource, gap) => {
  // We'll only consider resources that list the competency, so full 50
  return 50;
};

const scoreLevelSuitability = (resource, gap) => {
  const current = gap.currentLevel || 1;
  const required = gap.requiredLevel || current;
  const desired = Math.min(required, current + 1);

  const rlevel = resource.level || current;

  if (rlevel === desired) return 30;
  if (rlevel > desired && rlevel <= required) return 20;
  if (rlevel > required) return 10;
  // lower level than desired
  return 10;
};

const scoreSource = (resource) => {
  const s = resource.source || "external";
  if (s === "igot") return 10;
  if (s === "mock_igot" || s === "internal") return 8;
  return 5; // external
};

const scoreDuration = (resource, gap) => {
  const d = resource.durationMinutes || 0;
  // prefer < 120 for quick learning, but allow longer for large gaps
  if (d === 0) return 5;
  if (d <= 60) return 10;
  if (d <= 180) return 7;
  return 3;
};

export const generateForUser = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");

  // fetch open skill gaps
  const gaps = await SkillGap.find({ userId, status: "open" }).lean();

  const allRecommendations = [];

  for (const gap of gaps) {
    // find matching resources
    const resources = await LearningResource.find({
      "competencies.competencyId": gap.competencyId,
      status: "active"
    }).lean();

    const scored = [];

    for (const r of resources) {
      const reasons = [];
      const cscore = scoreCompetencyMatch(r, gap);
      if (cscore > 0) reasons.push(`Directly addresses the competency`);

      const lscore = scoreLevelSuitability(r, gap);
      if (lscore >= 30) reasons.push("Suitable for the employee's current proficiency level");
      else reasons.push("Partially suitable for the employee's proficiency level");

      const sscore = scoreSource(r);
      if (sscore >= 8) reasons.push("Trusted source or internal content");

      const dscore = scoreDuration(r, gap);
      if (dscore >= 7) reasons.push("Reasonable duration for focused learning");

      const total = cscore + lscore + sscore + dscore;

      scored.push({ resource: r, score: total, reasons });
    }

    // sort and rank
    scored.sort((a, b) => b.score - a.score);
    for (let i = 0; i < scored.length; i++) scored[i].rank = i + 1;

    // prepare recommendation items for DB
    const recItems = scored.map((s) => ({ resourceId: s.resource._id, rank: s.rank, score: s.score, reason: s.reasons }));

    // upsert Recommendation for this gap and user
    const existing = await Recommendation.findOne({ userId: userId, gapId: gap._id });
    if (existing) {
      existing.recommendations = recItems;
      existing.generatedAt = new Date();
      await existing.save();
    } else {
      await Recommendation.create({ userId: userId, gapId: gap._id, recommendations: recItems, generatedAt: new Date() });
    }

    // collect results to return (populate resource data)
    const prepared = scored.map((s) => ({ resource: s.resource, score: s.score, rank: s.rank, reason: s.reasons, gapId: gap._id }));
    allRecommendations.push({ gapId: gap._id, competencyId: gap.competencyId, recommendations: prepared });
  }

  return allRecommendations;
};

export const getRecommendationsForUser = async (userId) => {
  const recs = await Recommendation.find({ userId }).populate("recommendations.resourceId").lean();
  // map to response format
  return recs.map((r) => ({
    id: r._id,
    gapId: r.gapId,
    generatedAt: r.generatedAt,
    recommendations: r.recommendations.map((it) => ({ resource: it.resourceId, score: it.score, rank: it.rank, reason: it.reason }))
  }));
};

export const selectRecommendation = async (recommendationId, userId, resourceId) => {
  const recommendation = await Recommendation.findOne({ _id: recommendationId, userId }).lean();
  if (!recommendation) throw new Error("Recommendation not found");

  const selected = recommendation.recommendations.find(
    (item) => String(item.resourceId) === String(resourceId)
  );
  if (!selected) throw new Error("Resource is not part of this recommendation");

  return learningProgressService.startLearning(userId, resourceId);
};
