import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: String
  },
  { _id: true }
);

const roleSchema = new mongoose.Schema(
  {
    positionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: String,

    activities: [activitySchema],

    competencies: [
      {
        competencyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Competency",
          required: true
        },

        expectedLevel: {
          type: Number,
          min: 1,
          max: 5,
          required: true
        }
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);