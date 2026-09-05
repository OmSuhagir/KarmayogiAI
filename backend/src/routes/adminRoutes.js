import express from "express";
import {
  getDashboard,
  getEmployees,
  getEmployeeDetail,
  getEmployeeCompetencies,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getCompetencies,
  createCompetency,
  updateCompetency,
  deleteCompetency,
  getLearningResources,
  uploadLearningResource,
  updateLearningResourceStatus,
  deleteLearningResource,
  getQuestionBank,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAdminAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getSkillGapAnalytics,
  getAssessmentStatistics
} from "../controllers/adminController.js";

const router = express.Router();

// Dashboard & Analytics
router.get("/dashboard", getDashboard);
router.get("/skill-gaps", getSkillGapAnalytics);
router.get("/assessments/:id/statistics", getAssessmentStatistics);

// Employees / Officers
router.get("/employees", getEmployees);
router.get("/employees/:id", getEmployeeDetail);
router.get("/employees/:id/competencies", getEmployeeCompetencies);

// Departments
router.get("/departments", getDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

// Positions
router.get("/positions", getPositions);
router.post("/positions", createPosition);
router.put("/positions/:id", updatePosition);
router.delete("/positions/:id", deletePosition);

// Roles
router.get("/roles", getRoles);
router.post("/roles", createRole);
router.put("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

// Competencies
router.get("/competencies", getCompetencies);
router.post("/competencies", createCompetency);
router.put("/competencies/:id", updateCompetency);
router.delete("/competencies/:id", deleteCompetency);

// Learning Resources & Official Document Uploads
router.get("/learning-resources", getLearningResources);
router.post("/learning-resources", uploadLearningResource);
router.patch("/learning-resources/:id/status", updateLearningResourceStatus);
router.delete("/learning-resources/:id", deleteLearningResource);

// Question Bank
router.get("/questions", getQuestionBank);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

// Assessments
router.get("/assessments", getAdminAssessments);
router.post("/assessments", createAssessment);
router.put("/assessments/:id", updateAssessment);
router.delete("/assessments/:id", deleteAssessment);

export default router;
