import mongoose from "mongoose";
import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import SkillGap from "../models/SkillGap.js";
import LearningResource from "../models/LearningResource.js";
import LearningProgress from "../models/LearningProgress.js";
import CompetencyHistory from "../models/CompetencyHistory.js";
import Role from "../models/Role.js";
import Department from "../models/Department.js";
import Position from "../models/Position.js";
import Competency from "../models/Competency.js";
import Question from "../models/Question.js";
import Document from "../models/Document.js";
import GeneratedQuestion from "../models/GeneratedQuestion.js";
import Recommendation from "../models/Recommendation.js";

// ==========================================
// 1. DASHBOARD OVERVIEW & ANALYTICS
// ==========================================

export const getDashboard = async () => {
  const [
    totalEmployees,
    totalDepartments,
    totalPositions,
    totalRoles,
    totalCompetencies,
    totalAssessments,
    completedAssessments,
    totalOpenSkillGaps,
    criticalSkillGaps,
    learningResources,
    pendingQuestions,
    approvedQuestions,
    allEmployees,
    allRoles
  ] = await Promise.all([
    User.countDocuments({ role: "employee" }),
    Department.countDocuments(),
    Position.countDocuments(),
    Role.countDocuments(),
    Competency.countDocuments(),
    Assessment.countDocuments({ status: "active" }),
    AssessmentAttempt.countDocuments({ status: "completed" }),
    SkillGap.countDocuments({ status: "open" }),
    SkillGap.countDocuments({ status: "open", priority: "critical" }),
    LearningResource.countDocuments({ status: "active" }),
    GeneratedQuestion.countDocuments({ "validation.status": "pending" }),
    Question.countDocuments({ status: "approved" }),
    User.find({ role: "employee" }).lean(),
    Role.find().lean()
  ]);

  // Compute average readiness across workforce
  const roleExpectedMap = new Map();
  for (const r of allRoles) {
    const compMap = new Map();
    for (const c of r.competencies || []) {
      compMap.set(String(c.competencyId), c.expectedLevel);
    }
    roleExpectedMap.set(String(r._id), compMap);
  }

  let totalEvaluated = 0;
  let totalMet = 0;
  for (const emp of allEmployees) {
    const expected = emp.roleId ? roleExpectedMap.get(String(emp.roleId)) : null;
    for (const cp of emp.competencyProfile || []) {
      totalEvaluated++;
      const req = expected ? expected.get(String(cp.competencyId)) || 3 : 3;
      if ((cp.currentLevel || 1) >= req) {
        totalMet++;
      }
    }
  }

  const averageWorkforceReadiness =
    totalEvaluated > 0 ? Math.round((totalMet / totalEvaluated) * 100) : 0;

  return {
    totalEmployees,
    totalDepartments,
    totalPositions,
    totalRoles,
    totalCompetencies,
    totalAssessments,
    completedAssessments,
    totalOpenSkillGaps,
    criticalSkillGaps,
    learningResources,
    pendingQuestions,
    approvedQuestions,
    averageWorkforceReadiness
  };
};

// ==========================================
// 2. EMPLOYEES / OFFICERS MANAGEMENT
// ==========================================

export const getEmployees = async (filters = {}) => {
  const query = { role: "employee" };
  if (filters.departmentId) query.departmentId = filters.departmentId;
  if (filters.positionId) query.positionId = filters.positionId;
  if (filters.roleId) query.roleId = filters.roleId;

  const employees = await User.find(query)
    .populate("departmentId")
    .populate("positionId")
    .populate("roleId")
    .populate("competencyProfile.competencyId")
    .lean();

  const allRoles = await Role.find().lean();
  const roleMap = new Map(allRoles.map((r) => [String(r._id), r]));

  // Enhance each employee with computed readiness & skill gap counts
  const enriched = await Promise.all(
    employees.map(async (emp) => {
      const role = emp.roleId ? roleMap.get(String(emp.roleId._id || emp.roleId)) : null;
      const expectedMap = new Map();
      if (role?.competencies) {
        for (const c of role.competencies) {
          expectedMap.set(String(c.competencyId), c.expectedLevel);
        }
      }

      const totalComps = emp.competencyProfile?.length || 0;
      let metCount = 0;
      let gapCount = 0;
      let avgLevel = 0;

      if (totalComps > 0) {
        let sum = 0;
        for (const cp of emp.competencyProfile) {
          const current = cp.currentLevel || 1;
          sum += current;
          const compId = String(cp.competencyId?._id || cp.competencyId);
          const req = expectedMap.get(compId) || 3;
          if (current >= req) metCount++;
          else gapCount++;
        }
        avgLevel = Number((sum / totalComps).toFixed(1));
      }

      const readinessPercent = totalComps > 0 ? Math.round((metCount / totalComps) * 100) : 0;

      // Check last assessment
      const lastAttempt = await AssessmentAttempt.findOne({ userId: emp._id, status: "completed" })
        .sort({ completedAt: -1 })
        .lean();

      return {
        ...emp,
        readinessPercent,
        gapCount,
        avgLevel,
        totalComps,
        lastAssessmentDate: lastAttempt?.completedAt || null,
        assessmentStatus: lastAttempt ? "Assessed" : "Pending Evaluation"
      };
    })
  );

  return enriched;
};

export const getEmployeeDetail = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const user = await User.findById(userId)
    .populate("departmentId")
    .populate("positionId")
    .populate("roleId")
    .populate("competencyProfile.competencyId")
    .lean();

  if (!user) return null;

  const [skillGaps, learningProgress, history, recommendations] = await Promise.all([
    SkillGap.find({ userId }).populate("competencyId").lean(),
    LearningProgress.find({ userId }).populate("resourceId").lean(),
    CompetencyHistory.find({ userId }).populate("competencyId").sort({ recordedAt: -1 }).lean(),
    Recommendation.find({ userId }).populate("recommendations.resourceId").lean()
  ]);

  const audit = await getEmployeeCompetencies(userId);

  return {
    user,
    competencies: audit?.competencies || [],
    skillGaps,
    learningProgress,
    history,
    recommendations
  };
};

export const getEmployeeCompetencies = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid user id");

  const user = await User.findById(userId).populate("competencyProfile.competencyId").lean();
  if (!user) return null;

  const role = await Role.findOne({ positionId: user.positionId }).lean();
  const expectedMap = new Map();
  if (role && role.competencies) {
    for (const c of role.competencies) expectedMap.set(String(c.competencyId), c.expectedLevel);
  }

  const results = [];
  for (const p of user.competencyProfile || []) {
    const compId = p.competencyId ? String(p.competencyId._id || p.competencyId) : null;
    const currentLevel = p.currentLevel;
    const expectedLevel = expectedMap.has(compId) ? expectedMap.get(compId) : 3;
    const gap = expectedLevel != null ? expectedLevel - currentLevel : 0;

    const history = await CompetencyHistory.find({ userId, competencyId: compId }).sort({ recordedAt: 1 }).lean();

    results.push({ competency: p.competencyId, currentLevel, expectedLevel, gap, history });
  }

  return { user: { id: user._id, name: user.name, email: user.email }, competencies: results };
};

// ==========================================
// 3. DEPARTMENTS
// ==========================================

export const getDepartments = async () => {
  const departments = await Department.find().lean();
  const enhanced = await Promise.all(
    departments.map(async (dept) => {
      const [officerCount, positionCount] = await Promise.all([
        User.countDocuments({ departmentId: dept._id, role: "employee" }),
        Position.countDocuments({ departmentId: dept._id })
      ]);
      return {
        ...dept,
        officerCount,
        positionCount
      };
    })
  );
  return enhanced;
};

export const createDepartment = async (data) => {
  return await Department.create(data);
};

export const updateDepartment = async (id, data) => {
  return await Department.findByIdAndUpdate(id, data, { new: true });
};

export const deleteDepartment = async (id) => {
  return await Department.findByIdAndDelete(id);
};

// ==========================================
// 4. POSITIONS
// ==========================================

export const getPositions = async () => {
  const positions = await Position.find().populate("departmentId").lean();
  return positions;
};

export const createPosition = async (data) => {
  return await Position.create(data);
};

export const updatePosition = async (id, data) => {
  return await Position.findByIdAndUpdate(id, data, { new: true });
};

export const deletePosition = async (id) => {
  return await Position.findByIdAndDelete(id);
};

// ==========================================
// 5. ROLES & COMPETENCY MAPPINGS
// ==========================================

export const getRoles = async () => {
  const roles = await Role.find()
    .populate("positionId")
    .populate("competencies.competencyId")
    .lean();
  return roles;
};

export const createRole = async (data) => {
  return await Role.create(data);
};

export const updateRole = async (id, data) => {
  return await Role.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRole = async (id) => {
  return await Role.findByIdAndDelete(id);
};

// ==========================================
// 6. COMPETENCIES REPOSITORY
// ==========================================

export const getCompetencies = async () => {
  return await Competency.find().lean();
};

export const createCompetency = async (data) => {
  return await Competency.create(data);
};

export const updateCompetency = async (id, data) => {
  return await Competency.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCompetency = async (id) => {
  return await Competency.findByIdAndDelete(id);
};

// ==========================================
// 7. LEARNING RESOURCES & OFFICIAL DOCUMENTS
// ==========================================

export const getLearningResources = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;

  const [resources, documents] = await Promise.all([
    LearningResource.find().populate("competencies.competencyId").lean(),
    Document.find().populate("competencyIds").populate("uploadedBy", "name email").lean()
  ]);

  return {
    resources,
    documents
  };
};

export const uploadLearningResource = async (data, uploadedByUserId) => {
  const {
    title,
    description,
    provider = "iGOT Karmayogi",
    source = "internal",
    competencyId,
    level = 3,
    durationMinutes = 120,
    fileType = "application/pdf",
    fileName,
    extractedText,
    status = "approved"
  } = data;

  // 1. Create Document record for AI question generation knowledge source
  const doc = await Document.create({
    uploadedBy: uploadedByUserId || "65e000000000000000000001",
    fileName: fileName || `${title.replace(/\s+/g, "_")}.pdf`,
    fileType,
    extractedText: extractedText || description || title,
    competencyIds: competencyId ? [competencyId] : [],
    status: "processed"
  });

  // 2. Create LearningResource record so employee recommendation engine immediately sees it
  const resource = await LearningResource.create({
    title,
    provider,
    source,
    externalId: `DOC-RES-${doc._id.toString().slice(-6).toUpperCase()}`,
    competencies: competencyId ? [{ competencyId }] : [],
    level: Number(level) || 3,
    durationMinutes: Number(durationMinutes) || 120,
    url: "https://igotkarmayogi.gov.in",
    status: status === "approved" ? "active" : "inactive"
  });

  return { document: doc, resource };
};

export const updateLearningResourceStatus = async (id, status) => {
  const resource = await LearningResource.findByIdAndUpdate(
    id,
    { status: status === "approved" ? "active" : "inactive" },
    { new: true }
  );
  return resource;
};

export const deleteLearningResource = async (id) => {
  return await LearningResource.findByIdAndDelete(id);
};

// ==========================================
// 8. APPROVED QUESTION BANK
// ==========================================

export const getQuestionBank = async (filters = {}) => {
  const match = { status: "approved" };
  if (filters.competencyId) match.competencyId = new mongoose.Types.ObjectId(filters.competencyId);
  if (filters.difficulty) match.difficulty = Number(filters.difficulty);

  const questions = await Question.find(match).populate("competencyId").lean();
  return questions;
};

export const createQuestion = async (data) => {
  return await Question.create(data);
};

export const updateQuestion = async (id, data) => {
  return await Question.findByIdAndUpdate(id, data, { new: true });
};

export const deleteQuestion = async (id) => {
  return await Question.findByIdAndDelete(id);
};

// ==========================================
// 9. ASSESSMENTS MANAGEMENT
// ==========================================

export const getAdminAssessments = async () => {
  return await Assessment.find()
    .populate("positionId")
    .populate("competencies.competencyId")
    .lean();
};

export const createAssessment = async (data) => {
  return await Assessment.create(data);
};

export const updateAssessment = async (id, data) => {
  return await Assessment.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAssessment = async (id) => {
  return await Assessment.findByIdAndDelete(id);
};

// ==========================================
// 10. WORKFORCE ANALYTICS
// ==========================================

export const getSkillGapAnalytics = async (filters = {}) => {
  const match = {};
  if (filters.competency) match.competencyId = new mongoose.Types.ObjectId(filters.competency);
  if (filters.priority) match.priority = filters.priority;
  if (filters.status) match.status = filters.status;

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" }
  ];

  if (filters.department) {
    pipeline.push({ $match: { "user.departmentId": new mongoose.Types.ObjectId(filters.department) } });
  }

  pipeline.push(
    { $lookup: { from: "competencies", localField: "competencyId", foreignField: "_id", as: "competency" } },
    { $unwind: { path: "$competency", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        userId: 1,
        competency: "$competency",
        requiredLevel: 1,
        currentLevel: 1,
        gap: 1,
        priority: 1,
        status: 1,
        identifiedFromAttempt: 1,
        user: { _id: "$user._id", name: "$user.name", email: "$user.email", departmentId: "$user.departmentId", positionId: "$user.positionId" }
      }
    }
  );

  return await SkillGap.aggregate(pipeline);
};

export const getAssessmentStatistics = async (assessmentId) => {
  if (!mongoose.Types.ObjectId.isValid(assessmentId)) throw new Error("Invalid assessment id");

  const attemptsMatch = { assessmentId: new mongoose.Types.ObjectId(assessmentId) };

  const stats = await AssessmentAttempt.aggregate([
    { $match: attemptsMatch },
    {
      $group: {
        _id: null,
        attempts: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        avgScore: { $avg: "$score" }
      }
    }
  ]);

  const attemptCount = stats.length > 0 ? stats[0].attempts : 0;
  const completed = stats.length > 0 ? stats[0].completed : 0;
  const avgScore = stats.length > 0 ? stats[0].avgScore : 0;
  const completionRate = attemptCount > 0 ? (completed / attemptCount) * 100 : 0;

  const compAgg = await AssessmentAttempt.aggregate([
    { $match: attemptsMatch },
    { $unwind: "$competencyScores" },
    {
      $group: {
        _id: "$competencyScores.competencyId",
        avgScore: { $avg: "$competencyScores.score" },
        avgAssessedLevel: { $avg: "$competencyScores.assessedLevel" }
      }
    },
    {
      $lookup: { from: "competencies", localField: "_id", foreignField: "_id", as: "competency" }
    },
    { $unwind: { path: "$competency", preserveNullAndEmptyArrays: true } },
    { $project: { competency: "$competency", avgScore: 1, avgAssessedLevel: 1 } }
  ]);

  return { attemptCount, completed, avgScore, completionRate, competencyAverages: compAgg };
};
