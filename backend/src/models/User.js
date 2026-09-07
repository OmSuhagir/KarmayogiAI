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

    employeeId: {
      type: String,
      trim: true,
      index: true
    },

    cadre: {
      type: String,
      trim: true
    },

    batchYear: {
      type: Number
    },

    onboardingSource: {
      type: String,
      enum: ["manual", "ehrms_sync", "service_book_ai", "digilocker"],
      default: "manual"
    },

    pastAppraisalsSummary: {
      type: String
    },

    serviceHistory: [
      {
        organization: { type: String, required: true },
        designation: { type: String, required: true },
        duration: { type: String, required: true },
        domain: { type: String },
        keyContributions: [{ type: String }]
      }
    ],

    certifications: [
      {
        title: { type: String, required: true },
        issuingAuthority: { type: String, required: true },
        completionDate: { type: Date },
        credentialUrl: { type: String },
        verified: { type: Boolean, default: true }
      }
    ],

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