import express from "express";
import {
  getPresetOfficers,
  syncEhrms,
  parsePastRecord,
  completeOnboarding
} from "../controllers/onboardingController.js";

const router = express.Router();

router.get("/presets", getPresetOfficers);
router.post("/sync-ehrms", syncEhrms);
router.post("/parse-record", parsePastRecord);
router.post("/complete", completeOnboarding);

export default router;
