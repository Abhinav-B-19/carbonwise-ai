import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
  } from "recharts";
  
  interface Props {
    score: number;
  }
  
  export default function CarbonScoreGauge({
    score,
  }: Props) {
    const getColor = () => {
      if (score >= 80)
        return "#16a34a";
  
      if (score >= 60)
        return "#65a30d";
  
      if (score >= 40)
        return "#eab308";
  
      if (score >= 20)
        return "#f97316";
  
      return "#dc2626";
    };
  
    return (
      <div
        className="
        bg-white
        rounded-3xl
        p-8
        shadow-sm
        "
      >
        <ResponsiveContainer
          width="100%"
          height={280}
        >
          <RadialBarChart
            innerRadius="75%"
            outerRadius="100%"
            data={[
              {
                value: score,
              },
            ]}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              fill={getColor()}
            />
          </RadialBarChart>
        </ResponsiveContainer>
  
        <div className="text-center -mt-32">
          <h2
            className="text-5xl font-bold"
            style={{
              color: getColor(),
            }}
          >
            {score}
          </h2>
  
          <p className="text-slate-500">
            Carbon Score
          </p>
        </div>
      </div>
    );
  }