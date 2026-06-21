import api from "../api/api";

export interface ChatMessage {
  role: string;
  message: string;
  createdAt: string;
}

export interface ChatResponse {
  response: string;
  remainingMessages: number;
}

export interface UsageResponse {
  used: number;
  limit: number;
  remaining: number;
}

const chatService = {
  async sendMessage(userKey: string, message: string) {
    const response = await api.post<ChatResponse>("/api/assistant/chat", {
      userKey,
      message,
    });

    return response?.data ?? { response: "", remainingMessages: 0 };
  },

  async getHistory(userKey: string) {
    const response = await api.get<ChatMessage[]>(
      `/api/assistant/history?userKey=${userKey}`,
    );

    return response?.data ?? [];
  },

  async clearHistory(userKey: string) {
    await api.delete(`/api/assistant/history?userKey=${userKey}`);
  },

  async getUsage(userKey: string) {
    const response = await api.get<UsageResponse>(
      `/api/assistant/usage?userKey=${userKey}`,
    );

    return response?.data ?? { used: 0, limit: 0, remaining: 0 };
  },
};

export default chatService;
