import { describe, it, expect } from "vitest";

import { getCategoryIcon } from "../../../utils/challenge";

describe("getCategoryIcon", () => {
  it("returns transport icon", () => {
    expect(getCategoryIcon("transport")).toBe("🚲");
  });

  it("returns food icon", () => {
    expect(getCategoryIcon("food")).toBe("🥗");
  });

  it("returns energy icon", () => {
    expect(getCategoryIcon("energy")).toBe("⚡");
  });

  it("returns lifestyle icon", () => {
    expect(getCategoryIcon("lifestyle")).toBe("🌿");
  });

  it("returns default icon", () => {
    expect(getCategoryIcon("other")).toBe("🌱");

    expect(getCategoryIcon("")).toBe("🌱");

    expect(getCategoryIcon(undefined as any)).toBe("🌱");
  });
});
