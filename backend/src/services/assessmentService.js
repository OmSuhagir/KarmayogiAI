import mongoose from "mongoose";
import Assessment from "../models/Assessment.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import Role from "../models/Role.js";
import CompetencyHistory from "../models/CompetencyHistory.js";
import Competency from "../models/Competency.js";
import * as skillGapService from "./skillGapService.js";
import * as recommendationService from "./recommendationService.js";

// Helper: attach competency name and category to questions
const enrichQuestionsWithCompetency = async (questions) => {
  const compIds = [...new Set(questions.map((q) => String(q.competencyId)).filter(Boolean))];
  const compDocs = await Competency.find({ _id: { $in: compIds } }).select("name category").lean();
  const compMap = new Map(compDocs.map((c) => [String(c._id), c]));

  return questions.map((q) => {
    const { correctAnswer, ...rest } = q;
    const comp = compMap.get(String(q.competencyId));
    return {
      ...rest,
      competencyName: comp?.name || "Core Competency",
      category: comp?.category || "functional"
    };
  });
};

// Utility: map score percentage to competency level (1-5)
export const scoreToLevel = (score) => {
  if (score < 40) return 1;
  if (score < 60) return 2;
  if (score < 80) return 3;
  if (score < 90) return 4;
  return 5;
};

export const getActiveAssessments = async () => {
  return Assessment.find({ status: "active" })
    .populate("positionId")
    .populate("competencies.competencyId")
    .lean();
};

export const getAssessmentById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Assessment.findById(id)
    .populate("positionId")
    .populate("competencies.competencyId")
    .lean();
};

export const getAssessmentQuestions = async (assessmentId) => {
  if (!mongoose.Types.ObjectId.isValid(assessmentId)) return null;
  const assessment = await Assessment.findById(assessmentId).lean();
  if (!assessment) return null;

  const rawQuestions = [];

  for (const comp of assessment.competencies || []) {
    const compId = comp.competencyId;
    const count = comp.questionCount || 0;

    if (count <= 0) continue;

    const sampled = await Question.aggregate([
      { $match: { competencyId: compId, status: "approved" } },
      { $sample: { size: count } }
    ]);

    rawQuestions.push(...sampled);
  }

  // randomize overall order
  for (let i = rawQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rawQuestions[i], rawQuestions[j]] = [rawQuestions[j], rawQuestions[i]];
  }

  const questions = await enrichQuestionsWithCompetency(rawQuestions);

  return {
    assessmentId: assessment._id,
    title: assessment.title,
    durationMinutes: assessment.durationMinutes,
    questions
  };
};

/**
 * Retrieve any active, unsubmitted attempt for an employee on this assessment
 */
export const getActiveAttempt = async (assessmentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(assessmentId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  const assessment = await Assessment.findById(assessmentId).lean();
  if (!assessment) return null;

  const attempt = await AssessmentAttempt.findOne({
    assessmentId,
    userId,
    status: "started"
  }).lean();

  if (!attempt) return null;

  // Calculate elapsed & remaining time based on server timestamp
  const now = new Date();
  const startedAt = new Date(attempt.startedAt);
  const durationSeconds = (assessment.durationMinutes || 45) * 60;
  const elapsedSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);

  // Retrieve assigned questions
  const questions = await Question.find({ _id: { $in: attempt.questionIds } }).lean();
  const orderedQuestions = attempt.questionIds
    .map((qid) => questions.find((x) => String(x._id) === String(qid)))
    .filter(Boolean);

  const sanitizedQuestions = await enrichQuestionsWithCompetency(orderedQuestions);

  return {
    attemptId: attempt._id,
    startedAt: attempt.startedAt,
    durationMinutes: assessment.durationMinutes || 45,
    remainingSeconds,
    isExpired: remainingSeconds <= 0,
    questions: sanitizedQuestions,
    savedAnswers: (attempt.answers || []).map((a) => ({
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer
    }))
  };
};

/**
 * Start or resume an assessment attempt for an employee
 */
export const startAssessment = async (assessmentId, userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) throw new Error("Assessment not found");
  if (assessment.status !== "active") throw new Error("Assessment is not active");

  // Check if there is an existing started attempt
  const existingAttempt = await getActiveAttempt(assessmentId, userId);
  if (existingAttempt) {
    return {
      attemptId: existingAttempt.attemptId,
      startedAt: existingAttempt.startedAt,
      durationMinutes: existingAttempt.durationMinutes,
      remainingSeconds: existingAttempt.remainingSeconds,
      questions: existingAttempt.questions,
      savedAnswers: existingAttempt.savedAnswers
    };
  }

  // Select questions for this attempt
  const questions = [];

  for (const comp of assessment.competencies || []) {
    const compId = comp.competencyId;
    const count = comp.questionCount || 0;

    if (count <= 0) continue;

    const sampled = await Question.aggregate([
      { $match: { competencyId: compId, status: "approved" } },
      { $sample: { size: count } }
    ]);

    if (sampled.length < count) {
      throw new Error(
        `Insufficient approved questions for competency ${compId}. Required: ${count}, Available: ${sampled.length}`
      );
    }

    questions.push(...sampled);
  }

  // Randomize overall order
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  const questionIds = questions.map((q) => q._id);

  // Create attempt with assigned questions
  const attempt = new AssessmentAttempt({
    assessmentId,
    userId,
    questionIds,
    startedAt: new Date(),
    status: "started",
    answers: []
  });

  await attempt.save();

  const sanitizedQuestions = await enrichQuestionsWithCompetency(questions);

  return {
    attemptId: attempt._id,
    startedAt: attempt.startedAt,
    durationMinutes: assessment.durationMinutes || 45,
    remainingSeconds: (assessment.durationMinutes || 45) * 60,
    questions: sanitizedQuestions,
    savedAnswers: []
  };
};

/**
 * Save / update an answer in real time during an active attempt (tolerant of reloads)
 */
export const saveAnswer = async (assessmentId, attemptId, userId, questionId, selectedAnswer) => {
  if (!mongoose.Types.ObjectId.isValid(attemptId)) throw new Error("Invalid attempt ID");

  const attempt = await AssessmentAttempt.findById(attemptId);
  if (!attempt) throw new Error("Attempt not found");
  if (String(attempt.userId) !== String(userId)) throw new Error("Attempt does not belong to user");
  if (attempt.status !== "started") throw new Error("Cannot modify an already submitted attempt");

  // Validate question belongs to attempt
  const isAssigned = attempt.questionIds.some((qid) => String(qid) === String(questionId));
  if (!isAssigned) throw new Error("Question was not assigned to this attempt");

  // Upsert answer
  const existingIdx = attempt.answers.findIndex((a) => String(a.questionId) === String(questionId));
  if (existingIdx >= 0) {
    attempt.answers[existingIdx].selectedAnswer = selectedAnswer;
  } else {
    attempt.answers.push({
      questionId,
      selectedAnswer
    });
  }

  await attempt.save();

  return {
    success: true,
    savedCount: attempt.answers.length
  };
};

/**
 * Authoritative Evaluation and Submission
 */
export const submitAssessment = async (assessmentId, attemptId, userId, answers = []) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const attempt = await AssessmentAttempt.findById(attemptId).session(session);
    if (!attempt) throw new Error("Attempt not found");
    if (String(attempt.userId) !== String(userId)) throw new Error("Attempt does not belong to user");
    if (String(attempt.assessmentId) !== String(assessmentId)) throw new Error("Attempt does not belong to assessment");
    if (attempt.status !== "started") throw new Error("Attempt already submitted");

    const assessment = await Assessment.findById(assessmentId).session(session);
    if (!assessment) throw new Error("Assessment not found");

    // Merge answers from payload with any previously persisted answers
    const answersMap = new Map();
    for (const pa of attempt.answers || []) {
      if (pa.questionId && pa.selectedAnswer) {
        answersMap.set(String(pa.questionId), pa.selectedAnswer);
      }
    }
    for (const na of answers) {
      if (na.questionId && na.selectedAnswer) {
        answersMap.set(String(na.questionId), na.selectedAnswer);
      }
    }

    // Fetch all assigned questions for this attempt
    const questions = await Question.find({ _id: { $in: attempt.questionIds } }).session(session);

    let totalCorrect = 0;
    const competencyTotals = new Map(); // compId -> { correct, total }
    const processedAnswers = [];

    for (const q of questions) {
      const selected = answersMap.get(String(q._id)) || null;
      const correct = selected ? String(selected) === String(q.correctAnswer) : false;
      if (correct) totalCorrect++;

      const compId = String(q.competencyId);
      const entry = competencyTotals.get(compId) || { correct: 0, total: 0 };
      if (correct) entry.correct += 1;
      entry.total += 1;
      competencyTotals.set(compId, entry);

      processedAnswers.push({
        questionId: q._id,
        selectedAnswer: selected,
        correct,
        competencyId: q.competencyId
      });
    }

    const totalQuestions = questions.length;
    const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Build competencyScores and update user profile & history
    const competencyScores = [];
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    const now = new Date();

    for (const [compId, vals] of competencyTotals.entries()) {
      const score = vals.total > 0 ? Math.round((vals.correct / vals.total) * 100) : 0;
      const assessedLevel = scoreToLevel(score);

      const prevProfile = (user.competencyProfile || []).find((p) => String(p.competencyId) === String(compId));
      const previousLevel = prevProfile ? prevProfile.currentLevel : 1;

      competencyScores.push({
        competencyId: compId,
        score,
        previousLevel,
        assessedLevel
      });

      if (prevProfile) {
        prevProfile.currentLevel = assessedLevel;
        prevProfile.lastAssessedAt = now;
      } else {
        user.competencyProfile.push({
          competencyId: compId,
          currentLevel: assessedLevel,
          lastAssessedAt: now
        });
      }

      const previousHistory = await CompetencyHistory.exists({
        userId,
        competencyId: compId
      }).session(session);

      await CompetencyHistory.create(
        [
          {
            userId,
            competencyId: compId,
            level: assessedLevel,
            score,
            source: previousHistory ? "reassessment" : "assessment",
            assessmentAttemptId: attemptId,
            recordedAt: now
          }
        ],
        { session }
      );
    }

    // Update attempt
    attempt.answers = processedAnswers;
    attempt.score = overallScore;
    attempt.competencyScores = competencyScores;
    attempt.status = "completed";
    attempt.completedAt = now;
    await attempt.save({ session });

    // Save user
    await user.save({ session });

    // Reconcile skill gaps based on this assessment
    await skillGapService.reconcileSkillGaps(userId, user.roleId, competencyScores, attemptId, session);

    await session.commitTransaction();
    session.endSession();

    // Trigger learning recommendations asynchronously
    try {
      await recommendationService.generateForUser(userId);
    } catch (recErr) {
      console.warn("Recommendation generation warning:", recErr.message);
    }

    // Populate competencies details for rich result response
    const populatedCompetencies = await Promise.all(
      competencyScores.map(async (cs) => {
        const compDoc = await (await import("../models/Competency.js")).default.findById(cs.competencyId).lean();
        return {
          ...cs,
          competency: compDoc || { name: "Core Competency", category: "Functional" }
        };
      })
    );

    return {
      attemptId: attempt._id,
      overallScore,
      totalQuestions,
      totalCorrect,
      completedAt: now,
      competencies: populatedCompetencies
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/**
 * Fetch finalized result for a completed attempt
 */
export const getAssessmentResult = async (attemptId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(attemptId)) throw new Error("Invalid attempt ID");

  const attempt = await AssessmentAttempt.findById(attemptId)
    .populate("assessmentId")
    .populate("competencyScores.competencyId")
    .lean();

  if (!attempt) return null;
  if (String(attempt.userId) !== String(userId)) throw new Error("Unauthorized");
  if (attempt.status !== "completed") throw new Error("Attempt is not completed");

  return attempt;
};
