import { describe, it, expect } from "vitest";
import { API_BASE_URL } from "../../utils/constants";

describe("constants", () => {
  it("exports the correct API_BASE_URL", () => {
    expect(API_BASE_URL).toBe("https://carbonwise-ai-44hh.onrender.com");
  });
});
