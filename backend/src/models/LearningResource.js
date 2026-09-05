import mongoose from "mongoose";

const resourceCompetencySchema = new mongoose.Schema(
  {
    competencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency"
    },

    subCompetencyId: mongoose.Schema.Types.ObjectId
  },
  { _id: false }
);

const learningResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    provider: String,

    source: {
      type: String,
      enum: [
        "igot",
        "mock_igot",
        "internal",
        "external"
      ],
      default: "mock_igot"
    },

    externalId: String,

    competencies: [resourceCompetencySchema],

    level: {
      type: Number,
      min: 1,
      max: 5
    },

    durationMinutes: Number,

    prerequisites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningResource"
      }
    ],

    url: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "LearningResource",
  learningResourceSchema
);