import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
  } from "recharts";
  
  interface Props {
    data: any[];
  }
  
  export default function EmissionTrendChart({
    data,
  }: Props) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">
          Emission Trend
        </h3>
  
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="createdAt" />
              <YAxis />
              <Tooltip />
  
              <Line
                type="monotone"
                dataKey="totalEmission"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }