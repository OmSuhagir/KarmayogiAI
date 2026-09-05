import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    action: {
      type: String,
      required: true
    },

    entityType: String,

    entityId: mongoose.Schema.Types.ObjectId,

    metadata: {
      type: mongoose.Schema.Types.Mixed
    },

    ipAddress: String
  },
  { timestamps: true }
);

export default mongoose.model(
  "ActivityLog",
  activityLogSchema
);