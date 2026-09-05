import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import skillGapRoutes from "./routes/skillGapRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import learningProgressRoutes from "./routes/learningProgressRoutes.js";
import competencyHistoryRoutes from "./routes/competencyHistoryRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import generatedQuestionRoutes from "./routes/generatedQuestionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Register all models so mongoose knows the model names for populate()
import "./models/Department.js";
import "./models/Position.js";
import "./models/Role.js";
import "./models/Competency.js";
import "./models/User.js";
import "./models/Question.js";
import "./models/Assessment.js";
import "./models/AssessmentAttempt.js";
import "./models/SkillGap.js";
import "./models/LearningResource.js";
import "./models/Recommendation.js";
import "./models/LearningProgress.js";
import "./models/Document.js";
import "./models/GeneratedQuestion.js";
import "./models/ActivityLog.js";
import "./models/CompetencyHistory.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Karmayogi AI API is running"
  });
});

// Health check
app.get(["/health", "/api/health"], (req, res) => {
  res.json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

// Route registration helper for both /api/path and /path
const routes = [
  ["/users", userRoutes],
  ["/assessments", assessmentRoutes],
  ["/skill-gaps", skillGapRoutes],
  ["/recommendations", recommendationRoutes],
  ["/learning-progress", learningProgressRoutes],
  ["/competency-history", competencyHistoryRoutes],
  ["/documents", documentRoutes],
  ["/generated-questions", generatedQuestionRoutes],
  ["/admin", adminRoutes],
  ["/chat", chatRoutes]
];

routes.forEach(([path, handler]) => {
  app.use(`/api${path}`, handler);
  app.use(path, handler);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});