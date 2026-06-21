import { render, screen } from "@testing-library/react";
import CarbonScoreGauge from "@/components/charts/CarbonScoreGauge";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  RadialBarChart: ({ children }: any) => (
    <div data-testid="radial-chart">{children}</div>
  ),
  RadialBar: () => <div data-testid="radial-bar" />,
}));

describe("CarbonScoreGauge", () => {
  it("renders excellent score", () => {
    render(<CarbonScoreGauge score={90} />);

    expect(screen.getByText("90")).toBeInTheDocument();

    expect(screen.getByText("Carbon Score")).toBeInTheDocument();

    expect(screen.getByTestId("radial-chart")).toBeInTheDocument();
  });

  it("renders moderate score", () => {
    render(<CarbonScoreGauge score={50} />);

    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders poor score", () => {
    render(<CarbonScoreGauge score={10} />);

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders good score", () => {
    render(<CarbonScoreGauge score={70} />);

    expect(screen.getByText("70")).toBeInTheDocument();
  });

  it("renders poor score", () => {
    render(<CarbonScoreGauge score={30} />);

    expect(screen.getByText("30")).toBeInTheDocument();
  });
});
