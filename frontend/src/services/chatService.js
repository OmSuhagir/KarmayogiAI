import api from './api';

/**
 * Service for Karmayogi Sathi (AI Employee Companion)
 */

// Send message with multi-turn conversation history
export const sendChatMessage = async ({ userId, message, history = [] }) => {
  const response = await api.post('/chat/message', {
    userId,
    message,
    history,
  });
  // api interceptor already unwraps axios response.data
  return response;
};

// Fetch real-time employee context snapshot known by the companion
export const getCompanionContext = async (userId) => {
  const response = await api.get(`/chat/context/${userId}`);
  return response;
};

export default {
  sendChatMessage,
  getCompanionContext,
};
