import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    fileType: String,

    storageUrl: String,

    extractedText: String,

    competencyIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competency"
      }
    ],

    status: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "processed",
        "failed"
      ],
      default: "uploaded"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);