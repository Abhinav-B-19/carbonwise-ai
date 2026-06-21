import { render, screen } from "@testing-library/react";
import ScoreTrendChart from "@/components/charts/ScoreTrendChart";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: any) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

describe("ScoreTrendChart", () => {
  const data = [
    {
      createdAt: "2026-06-20",
      carbonScore: 82,
    },
  ];

  it("renders heading and description", () => {
    render(<ScoreTrendChart data={data} />);

    expect(screen.getByText("Carbon Score Trend")).toBeInTheDocument();

    expect(screen.getByText(/improvement over time/i)).toBeInTheDocument();
  });

  it("renders chart", () => {
    render(<ScoreTrendChart data={data} />);

    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });
});
