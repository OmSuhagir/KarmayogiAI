import api from './api';

/**
 * Service for Officer Onboarding & Past Service Record Ingestion
 */

// Fetch pre-configured mock civil service officer profiles for 1-click evaluation
export const getPresetOfficers = async () => {
  const response = await api.get('/onboarding/presets');
  return response.data;
};

// Synchronize Digital Service Book from e-HRMS 2.0 / iGOT Karmayogi by Employee ID / PRAN
export const syncEhrms = async (employeeId) => {
  const response = await api.post('/onboarding/sync-ehrms', { employeeId });
  return response.data;
};

// Parse an unstructured Service Record, Resume, or Transfer Order using Gemini AI
export const parsePastRecord = async (text) => {
  const response = await api.post('/onboarding/parse-record', { text });
  return response.data;
};

// Submit completed onboarding dossier to create/update officer profile in database
export const completeOnboarding = async (onboardingPayload) => {
  const response = await api.post('/onboarding/complete', onboardingPayload);
  return response.data;
};
