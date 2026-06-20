import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PageLoader from "@/components/ui/PageLoader";

describe("PageLoader", () => {
  it("renders", () => {
    const { container } = render(<PageLoader />);
    expect(container.firstChild).toBeTruthy();
  });
});
