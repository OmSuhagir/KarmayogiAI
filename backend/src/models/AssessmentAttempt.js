import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    selectedAnswer: String,

    correct: Boolean,

    competencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency"
    }
  },
  { _id: false }
);

const competencyScoreSchema = new mongoose.Schema(
  {
    competencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency"
    },

    score: Number,

    previousLevel: Number,

    assessedLevel: Number
  },
  { _id: false }
);

const assessmentAttemptSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ],

    startedAt: Date,

    completedAt: Date,

    answers: [answerSchema],

    score: Number,

    competencyScores: [competencyScoreSchema],

    status: {
      type: String,
      enum: ["started", "completed", "abandoned"],
      default: "started"
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "AssessmentAttempt",
  assessmentAttemptSchema
);