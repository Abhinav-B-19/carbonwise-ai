import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "@/components/ui/Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies default classes", () => {
    const { container } = render(<Card>Content</Card>);
    const cardDiv = container.querySelector("div");

    expect(cardDiv).toHaveClass("bg-white");
    expect(cardDiv).toHaveClass("border");
    expect(cardDiv).toHaveClass("border-neutral-200");
    expect(cardDiv).toHaveClass("rounded-3xl");
    expect(cardDiv).toHaveClass("shadow-sm");
  });

  it("accepts className prop", () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const cardDiv = container.querySelector("div");

    expect(cardDiv).toHaveClass("custom-class");
  });

  it("merges custom classes correctly", () => {
    const { container } = render(
      <Card className="p-4 text-blue-600">Content</Card>,
    );
    const cardDiv = container.querySelector("div");

    // Default classes should be present
    expect(cardDiv).toHaveClass("bg-white");
    expect(cardDiv).toHaveClass("border");

    // Custom classes should also be present
    expect(cardDiv).toHaveClass("p-4");
    expect(cardDiv).toHaveClass("text-blue-600");
  });

  it("renders consistently with arbitrary content", () => {
    const { container: container1 } = render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
      </Card>,
    );

    const { container: container2 } = render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
      </Card>,
    );

    const card1 = container1.querySelector("div");
    const card2 = container2.querySelector("div");

    expect(card1?.className).toBe(card2?.className);
    expect(screen.getAllByText("Title")).toHaveLength(2);
    expect(screen.getAllByText("Description")).toHaveLength(2);
  });
});
