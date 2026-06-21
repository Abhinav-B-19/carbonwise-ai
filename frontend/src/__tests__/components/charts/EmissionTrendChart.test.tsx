import { render, screen } from "@testing-library/react";
import EmissionTrendChart from "@/components/charts/EmissionTrendChart";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: any) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

describe("EmissionTrendChart", () => {
  const data = [
    {
      createdAt: "2026-06-20",
      totalEmission: 120,
    },
  ];

  it("renders chart heading and description", () => {
    render(<EmissionTrendChart data={data} />);

    expect(screen.getByText("Emission Trend")).toBeInTheDocument();

    expect(
      screen.getByText(/track your carbon footprint/i),
    ).toBeInTheDocument();
  });

  it("renders chart", () => {
    render(<EmissionTrendChart data={data} />);

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
