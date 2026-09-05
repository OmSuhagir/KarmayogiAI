import mongoose from "mongoose";

const learningProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningResource",
      required: true
    },

    startedAt: Date,

    completedAt: Date,

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    preAssessmentLevel: Number,

    postAssessmentLevel: Number,

    status: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "completed"
      ],
      default: "not_started"
    }
  },
  { timestamps: true }
);

// Ensure only one active learning progress per user + resource
learningProgressSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export default mongoose.model(
  "LearningProgress",
  learningProgressSchema
);