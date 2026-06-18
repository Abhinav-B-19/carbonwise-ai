import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUserKey } from '../../hooks/useUserKey';

describe('useUserKey Hook', () => {
  it('should return getUserKey and saveUserKey functions', () => {
    const { result } = renderHook(() => useUserKey());
    expect(result.current).toHaveProperty('getUserKey');
    expect(result.current).toHaveProperty('saveUserKey');
  });
});