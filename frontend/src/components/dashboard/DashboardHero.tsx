import React from "react";

interface DashboardHeroProps {
  userName: string;
  score: number;
  greenPoints: number;
  currentStreak: number;
  level: string;
  totalCalculations: number;
  scoreGradient: string;
}

function DashboardHero({
  userName,
  score,
  greenPoints,
  currentStreak,
  level,
  totalCalculations,
  scoreGradient,
}: DashboardHeroProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[36px]
        bg-gradient-to-br
        from-emerald-600
        via-green-500
        to-teal-500
        p-10
        text-white
        mb-8
        shadow-[0_30px_80px_rgba(5,150,105,0.35)]
      "
    >
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />

      <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div>
          <div className="inline-flex rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-sm">
            🌱 Sustainability Dashboard
          </div>

          <h1 className="mt-5 text-5xl font-bold tracking-tight">
            Welcome Back,
            <br />
            {userName} 👋
          </h1>

          <p className="mt-4 text-white/80 max-w-xl text-lg">
            Your sustainability journey is improving every day.
          </p>

          <div className="flex gap-3 mt-6 flex-wrap">
            <div className="bg-white/15 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              🔥 {currentStreak} Day Streak
            </div>

            <div className="bg-white/15 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              ⭐ {greenPoints} Points
            </div>

            <div className="bg-white/15 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              Level 🎯 {level}
            </div>

            <div className="bg-white/15 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              📊 {totalCalculations} Sustainability Checkups
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className="
              relative
              h-56
              w-56
              rounded-full
              flex
              items-center
              justify-center
            "
            style={{
              background: scoreGradient,
            }}
          >
            <div
              className="
                h-44
                w-44
                rounded-full
                bg-emerald-600
                flex
                flex-col
                items-center
                justify-center
              "
            >
              <span className="text-6xl font-bold">{score}</span>

              <span className="text-sm text-white/80">Carbon Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DashboardHero);
