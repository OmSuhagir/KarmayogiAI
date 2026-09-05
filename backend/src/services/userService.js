import User from "../models/User.js";
import SkillGap from "../models/SkillGap.js";
import Recommendation from "../models/Recommendation.js";
import LearningProgress from "../models/LearningProgress.js";

export const findUserById = async (id) => {
  // exclude password and populate relations
  return User.findById(id)
    .select("-password")
    .populate("departmentId")
    .populate("positionId")
    .populate("roleId")
    .populate("competencyProfile.competencyId")
    .lean();
};

export const getUserCompetencies = async (userId) => {
  const user = await User.findById(userId).select("competencyProfile");
  if (!user) return null;

  // populate competency ids within the competencyProfile
  await User.populate(user, { path: "competencyProfile.competencyId" });

  return user.competencyProfile.map((p) => ({
    competency: p.competencyId,
    currentLevel: p.currentLevel,
    lastAssessedAt: p.lastAssessedAt
  }));
};

export const getUserSkillGaps = async (userId, status) => {
  const filter = { userId };
  if (status) filter.status = status;

  return SkillGap.find(filter).populate("competencyId").lean();
};

export const getUserRecommendations = async (userId) => {
  // populate recommendations.resourceId
  return Recommendation.find({ userId })
    .populate("recommendations.resourceId")
    .lean();
};

export const getUserLearningProgress = async (userId) => {
  return LearningProgress.find({ userId }).populate("resourceId").lean();
};
