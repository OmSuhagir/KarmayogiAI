import LearningProgress from "../models/LearningProgress.js";
import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const startLearning = async (userId, resourceId) => {
  // verify user exists
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Check if a learning progress record already exists for this user + resource
  const existing = await LearningProgress.findOne({ userId, resourceId });
  if (existing) {
    // Return existing record instead of creating duplicate
    return existing.toObject();
  }

  // Create new record only if none exists
  const lp = new LearningProgress({
    userId,
    resourceId,
    startedAt: new Date(),
    progress: 0,
    status: "in_progress"
  });

  await lp.save();

  // log activity but don't fail the request if logging fails
  try {
    await ActivityLog.create({ userId, action: "LEARNING_STARTED", entityType: "LearningProgress", entityId: lp._id });
  } catch (e) {
    console.warn("Activity log failed:", e.message);
  }

  return lp.toObject();
};

export const updateProgress = async (id, userId, progress) => {
  if (typeof progress !== "number" || progress < 0 || progress > 100) throw new Error("Progress must be between 0 and 100");

  const lp = await LearningProgress.findById(id);
  if (!lp) throw new Error("Learning progress record not found");
  if (String(lp.userId) !== String(userId)) throw new Error("User not authorized to modify this record");

  lp.progress = progress;
  if (progress === 100) {
    lp.status = "completed";
    lp.completedAt = new Date();
  }

  await lp.save();

  // Activity logging
  try {
    if (progress >= 100) {
      await ActivityLog.create({ userId, action: "LEARNING_COMPLETED", entityType: "LearningProgress", entityId: lp._id });
    }
  } catch (e) {
    console.warn("Activity log failed:", e.message);
  }

  return lp.toObject();
};

export const getUserProgress = async (userId) => {
  return LearningProgress.find({ userId }).populate("resourceId").lean();
};
