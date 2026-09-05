import mongoose from "mongoose";

const weakSubCompetencySchema = new mongoose.Schema(
  {
    subCompetencyId: mongoose.Schema.Types.ObjectId,

    currentLevel: Number
  },
  { _id: false }
);

const skillGapSchema = new mongoose.Schema(
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

    requiredLevel: {
      type: Number,
      min: 1,
      max: 5
    },

    currentLevel: {
      type: Number,
      min: 1,
      max: 5
    },

    gap: Number,

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"]
    },

    weakSubCompetencies: [weakSubCompetencySchema],

    identifiedFromAttempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentAttempt"
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open"
    }
  },
  { timestamps: true }
);

export default mongoose.model("SkillGap", skillGapSchema);