import { render, screen } from "@testing-library/react";
import StatCard from "@/components/cards/StatCard";

describe("StatCard", () => {
  it("renders title and numeric value", () => {
    render(<StatCard title="Green Points" value={150} />);

    expect(screen.getByText("Green Points")).toBeInTheDocument();

    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("renders string value", () => {
    render(<StatCard title="Level" value="Eco Hero" />);

    expect(screen.getByText("Eco Hero")).toBeInTheDocument();
  });
});
