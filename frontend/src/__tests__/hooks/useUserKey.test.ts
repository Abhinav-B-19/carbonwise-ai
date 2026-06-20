import { describe, it, expect, beforeEach, vi } from "vitest";
import { useUserKey } from "../../hooks/useUserKey";

describe("useUserKey", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns null when no userKey exists", () => {
    const { getUserKey } = useUserKey();
    const result = getUserKey();
    expect(result).toBeNull();
  });

  it("saveUserKey stores value", () => {
    const { saveUserKey, getUserKey } = useUserKey();
    const testKey = "test-user-key-123";

    saveUserKey(testKey);

    expect(localStorage.getItem("carbonwise_userKey")).toBe(testKey);
  });

  it("getUserKey returns stored value", () => {
    const { saveUserKey, getUserKey } = useUserKey();
    const testKey = "stored-key-456";

    saveUserKey(testKey);
    const result = getUserKey();

    expect(result).toBe(testKey);
  });

  it("saveUserKey overwrites previous value", () => {
    const { saveUserKey, getUserKey } = useUserKey();
    const firstKey = "first-key";
    const secondKey = "second-key";

    saveUserKey(firstKey);
    expect(getUserKey()).toBe(firstKey);

    saveUserKey(secondKey);
    expect(getUserKey()).toBe(secondKey);
  });

  it("localStorage interactions behave correctly", () => {
    const { saveUserKey, getUserKey } = useUserKey();
    const testKey = "localStorage-test-key";

    // Initially null
    expect(getUserKey()).toBeNull();

    // After saving, value is stored
    saveUserKey(testKey);
    expect(localStorage.getItem("carbonwise_userKey")).toBe(testKey);
    expect(getUserKey()).toBe(testKey);

    // Clear localStorage
    localStorage.clear();
    expect(getUserKey()).toBeNull();

    // Store again
    saveUserKey(testKey);
    expect(getUserKey()).toBe(testKey);
  });
});
