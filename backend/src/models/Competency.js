import mongoose from "mongoose";

const subCompetencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: String
  },
  { _id: true }
);

const proficiencySchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    description: String
  },
  { _id: false }
);

const competencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    category: {
      type: String,
      enum: ["behavioral", "functional", "domain"],
      required: true
    },

    description: String,

    subCompetencies: [subCompetencySchema],

    proficiencyLevels: [proficiencySchema],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Competency", competencySchema);