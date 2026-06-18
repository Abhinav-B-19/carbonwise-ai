import { describe, it, expect, vi, beforeEach } from 'vitest';
import chatService, { ChatResponse, UsageResponse } from '../../services/chatService';
import api from '../../api/api';

/**
 * Mock axios api module
 */
vi.mock('../../api/api');

/**
 * Test suite for chat service
 */
describe('Chat Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send message and return response', async () => {
      const mockResponse: ChatResponse = {
        response: 'Test response',
        remainingMessages: 5,
      };

      (api.post as any) = vi.fn().mockResolvedValue({
        data: mockResponse,
      });

      const result = await chatService.sendMessage(
        'test-key',
        'Test message'
      );

      expect(result).toEqual(mockResponse);
      expect(api.post).toHaveBeenCalledWith('/api/assistant/chat', {
        userKey: 'test-key',
        message: 'Test message',
      });
    });

    it('should handle errors when sending message', async () => {
      const error = new Error('Network error');
      (api.post as any) = vi.fn().mockRejectedValue(error);

      await expect(
        chatService.sendMessage('test-key', 'Test message')
      ).rejects.toThrow('Network error');
    });
  });

  describe('getHistory', () => {
    it('should retrieve chat history', async () => {
      const mockHistory = [
        {
          role: 'user',
          message: 'Hello',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      (api.get as any) = vi.fn().mockResolvedValue({
        data: mockHistory,
      });

      const result = await chatService.getHistory('test-key');

      expect(result).toEqual(mockHistory);
      expect(api.get).toHaveBeenCalledWith(
        '/api/assistant/history?userKey=test-key'
      );
    });
  });

  describe('clearHistory', () => {
    it('should clear chat history', async () => {
      (api.delete as any) = vi.fn().mockResolvedValue({});

      await chatService.clearHistory('test-key');

      expect(api.delete).toHaveBeenCalledWith(
        '/api/assistant/history?userKey=test-key'
      );
    });
  });

  describe('getUsage', () => {
    it('should get usage statistics', async () => {
      const mockUsage: UsageResponse = {
        used: 5,
        limit: 10,
        remaining: 5,
      };

      (api.get as any) = vi.fn().mockResolvedValue({
        data: mockUsage,
      });

      const result = await chatService.getUsage('test-key');

      expect(result).toEqual(mockUsage);
      expect(api.get).toHaveBeenCalledWith(
        '/api/assistant/usage?userKey=test-key'
      );
    });
  });
});
