import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Position", positionSchema);