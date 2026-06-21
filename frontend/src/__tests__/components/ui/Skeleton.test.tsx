import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import Skeleton from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it("renders successfully", () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.firstChild;

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-pulse", "bg-slate-200", "rounded-xl");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="h-10 w-20" />);

    const skeleton = container.firstChild;

    expect(skeleton).toHaveClass(
      "animate-pulse",
      "bg-slate-200",
      "rounded-xl",
      "h-10",
      "w-20",
    );
  });

  it("renders correctly when className is undefined", () => {
    const { container } = render(<Skeleton className={undefined} />);

    const skeleton = container.firstChild;

    expect(skeleton).toHaveClass("animate-pulse", "bg-slate-200", "rounded-xl");
  });
});
