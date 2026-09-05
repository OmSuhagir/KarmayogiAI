import mongoose from "mongoose";

const competencyHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    competencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency",
      required: true
    },

    level: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    score: Number,

    source: {
      type: String,
      enum: [
        "initial_assessment",
        "assessment",
        "reassessment",
        "manual_update"
      ],
      required: true
    },

    assessmentAttemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentAttempt"
    },

    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "CompetencyHistory",
  competencyHistorySchema
);