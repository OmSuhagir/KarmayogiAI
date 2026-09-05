import api from './api';

/**
 * Service for Employee Assessment Engine API interactions
 */

// 1. Fetch active assessments
export const getAssessments = async () => {
  const response = await api.get('/assessments');
  return response.data;
};

// 2. Fetch assessment details
export const getAssessmentById = async (id) => {
  const response = await api.get(`/assessments/${id}`);
  return response.data;
};

// 3. Fetch active / uncompleted attempt if officer reloads or resumes
export const getActiveAttempt = async (id, userId) => {
  const response = await api.get(`/assessments/${id}/current-attempt`, {
    params: { userId },
  });
  return response.data;
};

// 4. Start or resume an assessment attempt
export const startAssessment = async (id, userId) => {
  const response = await api.post(`/assessments/${id}/start`, { userId });
  return response.data;
};

// 5. Save an answer in real time to MongoDB (persistence across reloads)
export const saveAnswer = async (assessmentId, attemptId, userId, questionId, selectedAnswer) => {
  const response = await api.post(`/assessments/${assessmentId}/save-answer`, {
    attemptId,
    userId,
    questionId,
    selectedAnswer,
  });
  return response.data;
};

// 6. Submit assessment for authoritative backend grading and gap reconciliation
export const submitAssessment = async (id, attemptId, userId, answers = []) => {
  const response = await api.post(`/assessments/${id}/submit`, {
    attemptId,
    userId,
    answers,
  });
  return response.data;
};

// 7. Fetch finalized result for a completed attempt
export const getAssessmentResult = async (attemptId, userId) => {
  const response = await api.get(`/assessments/attempt/${attemptId}/result`, {
    params: { userId },
  });
  return response.data;
};
