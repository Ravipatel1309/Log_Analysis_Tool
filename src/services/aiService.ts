/**
 * AI Service - Handles AI chat functionality
 * 
 * TODO: Replace mock responses with actual AI backend integration
 * Options: OpenAI API, Google Gemini, Azure OpenAI, or custom LLM
 */

import { ChatMessage, ApiResponse } from '@/types';
import { getMockAIResponse, simulateAIDelay } from '@/mockData/aiResponses';

/**
 * Send a message to the AI and get a response
 * 
 * TODO: Replace with actual AI API call
 * Example: POST /api/ai/chat
 * Body: { message: string, context: { testcaseId: string, logs: LogEntry[] } }
 */
export const sendAIMessage = async (
  message: string,
  testcaseId: string
): Promise<ApiResponse<ChatMessage>> => {
  // Simulate AI processing delay
  await simulateAIDelay(1000 + Math.random() * 1000);
  
  const response: ChatMessage = {
    id: `ai_${Date.now()}`,
    role: 'assistant',
    content: getMockAIResponse(message),
    timestamp: new Date().toISOString(),
  };
  
  return {
    data: response,
    success: true,
  };
};

/**
 * Create a user message object
 */
export const createUserMessage = (content: string): ChatMessage => {
  return {
    id: `user_${Date.now()}`,
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Future: Stream AI response for better UX
 * TODO: Implement SSE or WebSocket for streaming responses
 */
// export const streamAIResponse = async (
//   message: string,
//   onChunk: (chunk: string) => void,
//   testcaseId: string
// ): Promise<void> => {
//   // Implementation for streaming responses
// };
