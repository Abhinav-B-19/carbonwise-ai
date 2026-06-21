import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { CarbonHistoryItem } from "@/types/carbon";

interface Props {
  data: CarbonHistoryItem[];
}

export default function ScoreTrendChart({ data }: Props) {
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
          Carbon Score Trend
        </h3>

        <p className="text-sm text-neutral-500">Improvement over time</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.4} />

                <stop offset="100%" stopColor="#059669" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />

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

            <Area
              type="monotone"
              dataKey="carbonScore"
              stroke="#059669"
              strokeWidth={3}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
