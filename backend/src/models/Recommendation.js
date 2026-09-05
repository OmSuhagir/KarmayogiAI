import mongoose from "mongoose";

const recommendationItemSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningResource",
      required: true
    },

    rank: Number,

    score: Number,

    reason: [String]
  },
  { _id: false }
);

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    gapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillGap"
    },

    recommendations: [recommendationItemSchema],

    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "Recommendation",
  recommendationSchema
);