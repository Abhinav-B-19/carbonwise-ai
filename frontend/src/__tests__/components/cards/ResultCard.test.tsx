import { render, screen } from "@testing-library/react";
import ResultCard from "@/components/cards/ResultCard";

describe("ResultCard", () => {
  it("renders low emission state", () => {
    render(<ResultCard title="Transportation" value={50} />);

    expect(screen.getByText("Transportation")).toBeInTheDocument();

    expect(screen.getByText("50")).toBeInTheDocument();

    expect(screen.getByText("Low")).toBeInTheDocument();

    expect(screen.getByText("kg CO₂e")).toBeInTheDocument();
  });

  it("renders moderate emission state", () => {
    render(<ResultCard title="Home" value={200} />);

    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });

  it("renders high emission state", () => {
    render(<ResultCard title="Food" value={500} />);

    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders excellent carbon score", () => {
    render(<ResultCard title="Carbon Score" value={90} />);

    expect(screen.getByText("Excellent")).toBeInTheDocument();

    expect(screen.getByText("/100")).toBeInTheDocument();
  });

  it("renders critical carbon score", () => {
    render(<ResultCard title="Carbon Score" value={10} />);

    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("renders good carbon score", () => {
    render(<ResultCard title="Carbon Score" value={70} />);

    expect(screen.getByText("Good")).toBeInTheDocument();
  });

  it("renders moderate carbon score", () => {
    render(<ResultCard title="Carbon Score" value={50} />);

    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });

  it("renders poor carbon score", () => {
    render(<ResultCard title="Carbon Score" value={30} />);

    expect(screen.getByText("Poor")).toBeInTheDocument();
  });

  it("renders lifestyle card", () => {
    render(<ResultCard title="Lifestyle" value={100} />);

    expect(screen.getByText("Lifestyle")).toBeInTheDocument();
  });

  it("renders total emission card", () => {
    render(<ResultCard title="Total Emission" value={250} />);

    expect(screen.getByText("Total Emission")).toBeInTheDocument();
  });
  it("renders unknown title", () => {
    render(<ResultCard title="Other" value={10} />);

    expect(screen.getByText("Other")).toBeInTheDocument();
  });
});
