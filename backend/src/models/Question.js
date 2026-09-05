import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    id: String,
    text: String
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },

    options: [optionSchema],

    correctAnswer: {
      type: String,
      required: true
    },

    competencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency",
      required: true
    },

    subCompetencyId: {
      type: mongoose.Schema.Types.ObjectId
    },

    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    source: {
      type: String,
      enum: ["question_bank", "ai_generated", "uploaded"],
      default: "question_bank"
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);