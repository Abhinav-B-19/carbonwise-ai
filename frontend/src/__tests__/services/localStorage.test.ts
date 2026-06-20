import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveUserKey,
  getUserKey,
  getUserName,
  clearUserKey,
} from '@/services/localStorage';

describe('localStorage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve user key', () => {
    const testKey = 'test-key-123';
    saveUserKey(testKey);
    expect(getUserKey()).toBe(testKey);
  });

  it('should return null if user key not found', () => {
    expect(getUserKey()).toBeNull();
  });

  it('should retrieve user name', () => {
    const testName = 'John Doe';
    localStorage.setItem('carbonwise_userName', testName);
    expect(getUserName()).toBe(testName);
  });

  it('should clear user data', () => {
    localStorage.setItem('carbonwise_userKey', 'key-123');
    localStorage.setItem('carbonwise_userName', 'John Doe');
    clearUserKey();
    expect(getUserKey()).toBeNull();
    expect(getUserName()).toBeNull();
  });
});
