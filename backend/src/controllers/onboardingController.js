import * as onboardingService from "../services/onboardingSyncService.js";

/**
 * Return preset civil service officers for rapid SIH evaluation
 */
export const getPresetOfficers = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: onboardingService.PRESET_EHRMS_OFFICERS
    });
  } catch (err) {
    console.error("Failed to load preset officers:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Synchronize past service book from e-HRMS 2.0 / iGOT Karmayogi by Employee ID / PRAN
 */
export const syncEhrms = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID or Government Service Number (PRAN) is required."
      });
    }

    const result = await onboardingService.fetchEhrmsRecord(employeeId);
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("e-HRMS sync error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to query e-HRMS 2.0 repository."
    });
  }
};

/**
 * Parse an unstructured Service Record, Resume, or Transfer Order using Gemini AI
 */
export const parsePastRecord = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Text content from Service Book or Resume is required."
      });
    }

    const result = await onboardingService.parseServiceRecordWithAi(text);
    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("AI Service Book parse error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to analyze document with AI."
    });
  }
};

/**
 * Finalize officer onboarding, persist to MongoDB, initialize competencies & skill gaps
 */
export const completeOnboarding = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.email) {
      return res.status(400).json({
        success: false,
        message: "Officer email is required to complete onboarding."
      });
    }

    const user = await onboardingService.completeOfficerOnboarding(payload);

    return res.status(201).json({
      success: true,
      message: "Officer successfully onboarded with past service records synced.",
      data: user
    });
  } catch (err) {
    console.error("Onboarding completion error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to complete officer onboarding."
    });
  }
};
