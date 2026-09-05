import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    id: String,
    text: String
  },
  { _id: false }
);

const generatedQuestionSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    question: {
      type: String,
      required: true
    },

    options: [optionSchema],

    correctAnswer: String,

    competencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency"
    },

    subCompetencyId: mongoose.Schema.Types.ObjectId,

    difficulty: {
      type: Number,
      min: 1,
      max: 5
    },

    aiConfidence: {
      type: Number,
      min: 0,
      max: 1
    },

    validation: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
      },

      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      reviewedAt: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "GeneratedQuestion",
  generatedQuestionSchema
);