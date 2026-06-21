import React from "react";

interface DashboardData {
  carbonScore: number;
  totalCalculations: number;
  averageEmission: number;
  latestEmission: number;
  activeGoals: number;
}

interface DashboardStatsProps {
  data: DashboardData | null;
  score: number;
  scoreColor: string;
  activeGoals: number;
  completedChallenges: number;
}

function DashboardStats({
  data,
  score,
  scoreColor,
  activeGoals,
  completedChallenges,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <p className="text-slate-500">🌍 Average Emission</p>

        <h2 className="text-3xl font-bold mt-2">
          {(data?.averageEmission ?? 0).toFixed(2)}
        </h2>

        <p className="text-slate-500 mt-2">kg CO₂</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <p className="text-slate-500">📈 Latest Emission</p>

        <h2 className="text-3xl font-bold mt-2">
          {(data?.latestEmission ?? 0).toFixed(2)}
        </h2>

        <p className="text-slate-500 mt-2">kg CO₂</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <p className="text-slate-500">🎯 Active Goals</p>

        <h2 className="text-3xl font-bold mt-2">{activeGoals}</h2>

        <p className="text-slate-500 mt-2">In Progress</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <p className="text-slate-500">🏆 Challenges Completed</p>

        <h2 className="text-3xl font-bold mt-2">{completedChallenges}</h2>

        <p className="text-slate-500 mt-2">Completed</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <p className="text-slate-500">🌱 Carbon Score</p>

        <h2 className={`text-3xl font-bold mt-2 ${scoreColor}`}>{score}/100</h2>

        <p className={`mt-2 font-medium ${scoreColor}`}>
          Sustainability Rating
        </p>
      </div>
    </div>
  );
}

export default React.memo(DashboardStats);
