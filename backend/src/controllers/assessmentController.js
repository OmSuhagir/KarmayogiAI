import * as assessmentService from "../services/assessmentService.js";

export const getAssessments = async (req, res) => {
  try {
    const assessments = await assessmentService.getActiveAssessments();
    return res.json({
      success: true,
      data: assessments
    });
  } catch (err) {
    console.error("Get assessments error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await assessmentService.getAssessmentById(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found"
      });
    }

    return res.json({
      success: true,
      data: assessment
    });
  } catch (err) {
    console.error("Get assessment error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getAssessmentQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await assessmentService.getAssessmentQuestions(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found"
      });
    }

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error("Get questions error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getActiveAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const data = await assessmentService.getActiveAttempt(id, userId);
    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error("Get active attempt error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const startAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const data = await assessmentService.startAssessment(id, userId);

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error("Start assessment error:", err);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const saveAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { attemptId, userId, questionId, selectedAnswer } = req.body;

    if (!attemptId || !userId || !questionId || !selectedAnswer) {
      return res.status(400).json({
        success: false,
        message: "attemptId, userId, questionId, and selectedAnswer are required"
      });
    }

    const result = await assessmentService.saveAnswer(
      id,
      attemptId,
      userId,
      questionId,
      selectedAnswer
    );

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Save answer error:", err);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { attemptId, userId, answers } = req.body;

    if (!attemptId || !userId) {
      return res.status(400).json({
        success: false,
        message: "attemptId and userId are required"
      });
    }

    const result = await assessmentService.submitAssessment(
      id,
      attemptId,
      userId,
      answers || []
    );

    return res.json({
      success: true,
      message: "Assessment evaluated and competency profile updated successfully",
      data: result
    });
  } catch (err) {
    console.error("Submit assessment error:", err);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const getAssessmentResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { userId } = req.query;

    const data = await assessmentService.getAssessmentResult(attemptId, userId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Result not found"
      });
    }

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error("Get assessment result error:", err);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
