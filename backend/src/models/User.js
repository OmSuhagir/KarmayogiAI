import mongoose from "mongoose";

const competencyProfileSchema = new mongoose.Schema(
  {
    competencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency",
      required: true
    },

    currentLevel: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    lastAssessedAt: Date
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: [
        "employee",
        "mdo_manager",
        "department_admin",
        "system_admin",
        "admin"
      ],
      default: "employee"
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    },

    positionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position"
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    },

    competencyProfile: [competencyProfileSchema],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);