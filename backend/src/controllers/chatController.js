import companionService from "../services/companionService.js";

/**
 * Controller for Karmayogi Sathi Chat Companion API
 */

export const handleChatMessage = async (req, res) => {
  try {
    const { userId, message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }

    const result = await companionService.chatWithCompanion({
      userId,
      message,
      history
    });

    return res.status(200).json({
      success: true,
      data: result,
      ...result
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process message with AI Companion"
    });
  }
};

export const getCompanionContext = async (req, res) => {
  try {
    const { userId } = req.params;
    const context = await companionService.getUserCompanionContext(userId);

    return res.status(200).json({
      success: true,
      data: context,
      context
    });
  } catch (error) {
    console.error("Companion Context Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve employee companion context"
    });
  }
};

export default {
  handleChatMessage,
  getCompanionContext
};
