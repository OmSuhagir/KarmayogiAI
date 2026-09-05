import api from './api';

/**
 * Service for Employee Portal Backend API Integrations
 */

// Fetch basic user profile with populated relations
export const getEmployeeProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Fetch user's current competency profile
export const getEmployeeCompetencies = async (userId) => {
  const response = await api.get(`/users/${userId}/competencies`);
  return response.data;
};

// Fetch detailed competency audit with role expected levels and gap calculations
export const getEmployeeCompetencyAudit = async (userId) => {
  const response = await api.get(`/admin/employees/${userId}/competencies`);
  return response.data;
};

// Fetch user's active skill gaps
export const getEmployeeSkillGaps = async (userId, status) => {
  const params = status ? { status } : {};
  const response = await api.get(`/users/${userId}/skill-gaps`, { params });
  return response.data;
};

// Fetch user's personalized learning recommendations
export const getEmployeeRecommendations = async (userId) => {
  const response = await api.get(`/users/${userId}/recommendations`);
  return response.data;
};

// Trigger recommendation generation
export const generateEmployeeRecommendations = async (userId) => {
  const response = await api.post(`/recommendations/generate/${userId}`);
  return response.data;
};

// Fetch user's learning progress records
export const getEmployeeLearningProgress = async (userId) => {
  const response = await api.get(`/users/${userId}/learning-progress`);
  return response.data;
};

// Fetch user's longitudinal competency progression history
export const getEmployeeCompetencyHistory = async (userId, competencyId) => {
  const params = competencyId ? { competencyId } : {};
  const response = await api.get(`/competency-history/${userId}`, { params });
  return response.data;
};

// Fetch active role assessments
export const getActiveAssessments = async () => {
  const response = await api.get('/assessments');
  return response.data;
};
