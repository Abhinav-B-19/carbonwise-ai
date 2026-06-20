import { describe, it, expect, vi, beforeEach } from 'vitest';
import chatService from '@/services/chatService';
import api from '@/api/api';

vi.mock('@/api/api');

describe('Chat Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send message and return response', async () => {
    const mockResponse = {
      response: 'Test response',
      remainingMessages: 5,
    };

    (api.post as any) = vi.fn().mockResolvedValue({ data: mockResponse });
    const result = await chatService.sendMessage('test-key', 'Test message');
    expect(result).toEqual(mockResponse);
  });

  it('should retrieve chat history', async () => {
    const mockHistory = [{
      role: 'user',
      message: 'Hello',
      createdAt: '2024-01-01T00:00:00Z',
    }];

    (api.get as any) = vi.fn().mockResolvedValue({ data: mockHistory });
    const result = await chatService.getHistory('test-key');
    expect(result).toEqual(mockHistory);
  });

  it('should clear chat history', async () => {
    (api.delete as any) = vi.fn().mockResolvedValue({});
    await chatService.clearHistory('test-key');
    expect(api.delete).toHaveBeenCalled();
  });

  it('should get usage statistics', async () => {
    const mockUsage = { used: 5, limit: 10, remaining: 5 };
    (api.get as any) = vi.fn().mockResolvedValue({ data: mockUsage });
    const result = await chatService.getUsage('test-key');
    expect(result).toEqual(mockUsage);
  });
});
