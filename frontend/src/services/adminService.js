import api from './api';

/**
 * Service for Administrator Portal Backend API Integrations
 */

// 1. Dashboard Overview
export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// 2. Employees / Officers
export const getEmployeesList = async (filters = {}) => {
  const response = await api.get('/admin/employees', { params: filters });
  return response.data;
};

export const getEmployeeDetail = async (id) => {
  const response = await api.get(`/admin/employees/${id}`);
  return response.data;
};

// 3. Departments
export const getDepartments = async () => {
  const response = await api.get('/admin/departments');
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await api.post('/admin/departments', data);
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await api.put(`/admin/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/admin/departments/${id}`);
  return response.data;
};

// 4. Positions
export const getPositions = async () => {
  const response = await api.get('/admin/positions');
  return response.data;
};

export const createPosition = async (data) => {
  const response = await api.post('/admin/positions', data);
  return response.data;
};

export const updatePosition = async (id, data) => {
  const response = await api.put(`/admin/positions/${id}`, data);
  return response.data;
};

export const deletePosition = async (id) => {
  const response = await api.delete(`/admin/positions/${id}`);
  return response.data;
};

// 5. Roles
export const getRoles = async () => {
  const response = await api.get('/admin/roles');
  return response.data;
};

export const createRole = async (data) => {
  const response = await api.post('/admin/roles', data);
  return response.data;
};

export const updateRole = async (id, data) => {
  const response = await api.put(`/admin/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await api.delete(`/admin/roles/${id}`);
  return response.data;
};

// 6. Competencies
export const getCompetencies = async () => {
  const response = await api.get('/admin/competencies');
  return response.data;
};

export const createCompetency = async (data) => {
  const response = await api.post('/admin/competencies', data);
  return response.data;
};

export const updateCompetency = async (id, data) => {
  const response = await api.put(`/admin/competencies/${id}`, data);
  return response.data;
};

export const deleteCompetency = async (id) => {
  const response = await api.delete(`/admin/competencies/${id}`);
  return response.data;
};

// 7. Learning Resources & Official Document Uploads
export const getLearningResources = async (filters = {}) => {
  const response = await api.get('/admin/learning-resources', { params: filters });
  return response.data;
};

export const uploadLearningResource = async (formData) => {
  const response = await api.post('/admin/learning-resources', formData);
  return response.data;
};

export const updateLearningResourceStatus = async (id, status) => {
  const response = await api.patch(`/admin/learning-resources/${id}/status`, { status });
  return response.data;
};

export const deleteLearningResource = async (id) => {
  const response = await api.delete(`/admin/learning-resources/${id}`);
  return response.data;
};

// 8. Question Bank
export const getQuestionBank = async (filters = {}) => {
  const response = await api.get('/admin/questions', { params: filters });
  return response.data;
};

export const createQuestion = async (data) => {
  const response = await api.post('/admin/questions', data);
  return response.data;
};

export const updateQuestion = async (id, data) => {
  const response = await api.put(`/admin/questions/${id}`, data);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await api.delete(`/admin/questions/${id}`);
  return response.data;
};

// 9. AI Question Generation & Review
export const getGeneratedQuestions = async () => {
  const response = await api.get('/generated-questions');
  return response.data;
};

export const generateAIQuestions = async (payload) => {
  // payload: { documentId, competencyId, difficulty, numQuestions }
  const response = await api.post('/generated-questions/generate', payload, {
    timeout: 90000,
  });
  return response.data || response;
};

export const reviewGeneratedQuestion = async (id, status, reviewedBy) => {
  const response = await api.patch(`/generated-questions/${id}/review`, {
    status,
    reviewedBy,
  });
  return response.data;
};

// 10. Assessments
export const getAdminAssessments = async () => {
  const response = await api.get('/admin/assessments');
  return response.data;
};

export const createAssessment = async (data) => {
  const response = await api.post('/admin/assessments', data);
  return response.data;
};

export const updateAssessment = async (id, data) => {
  const response = await api.put(`/admin/assessments/${id}`, data);
  return response.data;
};

export const deleteAssessment = async (id) => {
  const response = await api.delete(`/admin/assessments/${id}`);
  return response.data;
};

// 11. Workforce Analytics
export const getSkillGapAnalytics = async (filters = {}) => {
  const response = await api.get('/admin/skill-gaps', { params: filters });
  return response.data;
};

export const getAssessmentStatistics = async (id) => {
  const response = await api.get(`/admin/assessments/${id}/statistics`);
  return response.data;
};
