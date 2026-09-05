import * as adminService from "../services/adminService.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. Dashboard
export const getDashboard = async (req, res) => {
  try {
    const data = await adminService.getDashboard();
    return res.json({ success: true, data });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Employees / Officers
export const getEmployees = async (req, res) => {
  try {
    const filters = req.query;
    const data = await adminService.getEmployees(filters);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("Get employees error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmployeeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) return res.status(400).json({ success: false, message: "Invalid user ID" });
    const data = await adminService.getEmployeeDetail(id);
    if (!data) return res.status(404).json({ success: false, message: "Employee not found" });
    return res.json({ success: true, data });
  } catch (err) {
    console.error("Get employee detail error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmployeeCompetencies = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await adminService.getEmployeeCompetencies(id);
    if (!data) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 3. Departments
export const getDepartments = async (req, res) => {
  try {
    const data = await adminService.getDepartments();
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const data = await adminService.createDepartment(req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const data = await adminService.updateDepartment(req.params.id, req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    await adminService.deleteDepartment(req.params.id);
    return res.json({ success: true, message: "Department deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 4. Positions
export const getPositions = async (req, res) => {
  try {
    const data = await adminService.getPositions();
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createPosition = async (req, res) => {
  try {
    const data = await adminService.createPosition(req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updatePosition = async (req, res) => {
  try {
    const data = await adminService.updatePosition(req.params.id, req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deletePosition = async (req, res) => {
  try {
    await adminService.deletePosition(req.params.id);
    return res.json({ success: true, message: "Position deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 5. Roles
export const getRoles = async (req, res) => {
  try {
    const data = await adminService.getRoles();
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createRole = async (req, res) => {
  try {
    const data = await adminService.createRole(req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const data = await adminService.updateRole(req.params.id, req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    await adminService.deleteRole(req.params.id);
    return res.json({ success: true, message: "Role deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 6. Competencies
export const getCompetencies = async (req, res) => {
  try {
    const data = await adminService.getCompetencies();
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createCompetency = async (req, res) => {
  try {
    const data = await adminService.createCompetency(req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateCompetency = async (req, res) => {
  try {
    const data = await adminService.updateCompetency(req.params.id, req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteCompetency = async (req, res) => {
  try {
    await adminService.deleteCompetency(req.params.id);
    return res.json({ success: true, message: "Competency deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 7. Learning Resources & Official Document Uploads
export const getLearningResources = async (req, res) => {
  try {
    const data = await adminService.getLearningResources(req.query);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadLearningResource = async (req, res) => {
  try {
    const data = await adminService.uploadLearningResource(req.body, req.body.uploadedBy);
    return res.json({ success: true, message: "Learning resource uploaded and mapped successfully", data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateLearningResourceStatus = async (req, res) => {
  try {
    const data = await adminService.updateLearningResourceStatus(req.params.id, req.body.status);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteLearningResource = async (req, res) => {
  try {
    await adminService.deleteLearningResource(req.params.id);
    return res.json({ success: true, message: "Learning resource deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 8. Question Bank
export const getQuestionBank = async (req, res) => {
  try {
    const data = await adminService.getQuestionBank(req.query);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const data = await adminService.createQuestion(req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const data = await adminService.updateQuestion(req.params.id, req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await adminService.deleteQuestion(req.params.id);
    return res.json({ success: true, message: "Question deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 9. Assessments Management
export const getAdminAssessments = async (req, res) => {
  try {
    const data = await adminService.getAdminAssessments();
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createAssessment = async (req, res) => {
  try {
    const data = await adminService.createAssessment(req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateAssessment = async (req, res) => {
  try {
    const data = await adminService.updateAssessment(req.params.id, req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteAssessment = async (req, res) => {
  try {
    await adminService.deleteAssessment(req.params.id);
    return res.json({ success: true, message: "Assessment deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// 10. Analytics
export const getSkillGapAnalytics = async (req, res) => {
  try {
    const filters = req.query;
    const data = await adminService.getSkillGapAnalytics(filters);
    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getAssessmentStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await adminService.getAssessmentStatistics(id);
    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
