import mongoose from "mongoose";

const assessmentCompetencySchema = new mongoose.Schema(
  {
    competencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency",
      required: true
    },

    requiredLevel: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    questionCount: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    positionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: true
    },

    competencies: [assessmentCompetencySchema],

    durationMinutes: Number,

    status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "draft"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);