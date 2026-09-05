import Document from "../models/Document.js";

export const createDocument = async (payload) => {
  // payload may contain: uploadedBy, fileName, fileType, storageUrl, extractedText, competencyIds
  const doc = new Document({
    uploadedBy: payload.uploadedBy,
    fileName: payload.fileName || "",
    fileType: payload.fileType || "",
    storageUrl: payload.storageUrl || "",
    extractedText: payload.extractedText || "",
    competencyIds: payload.competencyIds || []
  });

  await doc.save();
  return doc.toObject();
};

export const getDocumentById = async (id) => {
  return Document.findById(id).lean();
};

export const getDocumentsByUser = async (userId) => {
  return Document.find({ uploadedBy: userId }).lean();
};
