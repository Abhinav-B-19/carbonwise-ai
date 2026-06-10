import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
  interface Props {
    data: any[];
  }
  
  export default function ScoreTrendChart({
    data,
  }: Props) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">
          Carbon Score Trend
        </h3>
  
        <div className="h-80">
          <ResponsiveContainer>
            <AreaChart data={data}>
              <XAxis dataKey="createdAt" />
              <YAxis />
              <Tooltip />
  
              <Area
                type="monotone"
                dataKey="carbonScore"
                stroke="#16a34a"
                fill="#dcfce7"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }