import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: any[];
}

export default function EmissionTrendChart({
  data,
}: Props) {
  return (
    <div
      className="
      bg-white
      border
      border-neutral-200
      rounded-3xl
      p-6
      shadow-sm
      "
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight">
          Emission Trend
        </h3>

        <p className="text-sm text-neutral-500">
          Track your carbon footprint over time
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E5E5"
            />

            <XAxis
              dataKey="createdAt"
              tick={{
                fill: "#737373",
                fontSize: 12,
              }}
            />

            <YAxis
              tick={{
                fill: "#737373",
                fontSize: 12,
              }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="totalEmission"
              stroke="#059669"
              strokeWidth={3}
              dot={{
                fill: "#059669",
                strokeWidth: 0,
                r: 4,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}