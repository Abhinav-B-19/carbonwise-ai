import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import PageLoader from "../../components/ui/PageLoader";

import EmissionTrendChart from "../../components/charts/EmissionTrendChart";
import ScoreTrendChart from "../../components/charts/ScoreTrendChart";

import api from "../../api/api";

import { getUserKey } from "../../services/localStorage";

interface GamificationResponse {
  greenPoints: number;
  currentStreak: number;
  level: string;
  achievements: string[];
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  const [history, setHistory] = useState<any[]>([]);

  const [gamification, setGamification] = useState<GamificationResponse>({
    greenPoints: 0,
    currentStreak: 0,
    level: "",
    achievements: [],
  });

  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("carbonwise_userName") || "Eco Warrior";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userKey = getUserKey();

      if (!userKey) return;

      const [dashboardResponse, historyResponse, gamificationResponse] =
        await Promise.all([
          api.get(`/api/dashboard?userKey=${userKey}`),

          api.get(`/api/carbon/history?userKey=${userKey}`),

          api.get(`/api/gamification?userKey=${userKey}`),
        ]);

      setData(dashboardResponse.data);

      setHistory(historyResponse.data || []);

      setGamification(gamificationResponse.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getLevel = (score: number) => {
    if (score >= 80) return "Eco Champion";

    if (score >= 60) return "Green Advocate";

    if (score >= 40) return "Carbon Aware";

    if (score >= 20) return "Eco Beginner";

    return "Needs Improvement";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";

    if (score >= 60) return "text-lime-600";

    if (score >= 40) return "text-yellow-600";

    if (score >= 20) return "text-orange-600";

    return "text-red-600";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageLoader />
        </PageContainer>
      </DashboardLayout>
    );
  }

  const score = data?.carbonScore ?? 0;

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="py-8">
          {/* HERO */}

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
                  <div
                    className="
                    bg-white/15
                    px-4
                    py-2
                    rounded-full
                    backdrop-blur-md
                    border
                    border-white/10
                    hover:bg-white/20
                    transition-all
                    "
                  >
                    🔥 {gamification.currentStreak} Day Streak
                  </div>

                  <div
                    className="
                    bg-white/15
                    px-4
                    py-2
                    rounded-full
                    backdrop-blur-md
                    border
                    border-white/10
                    hover:bg-white/20
                    transition-all
                    "
                  >
                    ⭐ {gamification.greenPoints} Points
                  </div>

                  <div
                    className="
                    bg-white/15
                    px-4
                    py-2
                    rounded-full
                    backdrop-blur-md
                    border
                    border-white/10
                    hover:bg-white/20
                    transition-all
                    "
                  >
                    Level 🎯 {gamification.level || getLevel(score)}
                  </div>

                  <div
                    className="
                    bg-white/15
                    px-4
                    py-2
                    rounded-full
                    backdrop-blur-md
                    border
                    border-white/10
                    hover:bg-white/20
                    transition-all
                    "
                  >
                    📊 {data?.totalCalculations ?? 0} Sustainability Checkups
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div
                  className="relative h-56 w-56 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(
                      white ${score * 3.6}deg,
                      rgba(255,255,255,0.15) 0deg
                    )`,
                  }}
                >
                  <div className="h-44 w-44 rounded-full bg-emerald-600 flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold">{score}</span>

                    <span className="text-sm text-white/80">Carbon Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div
            className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border
            mb-8
            "
          >
            <h2
              className="
              text-xl
              font-bold
              mb-5
              "
            >
              ⚡ Quick Actions
            </h2>

            <div
              className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              "
            >
              <a
                href="/calculator"
                className="
                bg-green-50
                border
                border-green-200
                rounded-xl
                p-4
                text-center
                hover:bg-green-100
                transition
                "
              >
                🧮
                <div className="mt-2">Calculator</div>
              </a>

              <a
                href="/goals"
                className="
                bg-blue-50
                border
                border-blue-200
                rounded-xl
                p-4
                text-center
                hover:bg-blue-100
                transition
                "
              >
                🎯
                <div className="mt-2">Goals</div>
              </a>

              <a
                href="/ai-coach"
                className="
                bg-purple-50
                border
                border-purple-200
                rounded-xl
                p-4
                text-center
                hover:bg-purple-100
                transition
                "
              >
                🤖
                <div className="mt-2">AI Coach</div>
              </a>

              <a
                href="/scenario"
                className="
                bg-orange-50
                border
                border-orange-200
                rounded-xl
                p-4
                text-center
                hover:bg-orange-100
                transition
                "
              >
                🔮
                <div className="mt-2">Scenario</div>
              </a>
            </div>
          </div>

          {/* METRICS */}

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-5
            mb-8
            "
          >
            <div
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              border
              "
            >
              <p className="text-slate-500">🌍 Average Emission</p>

              <h2
                className="
                text-3xl
                font-bold
                mt-2
                "
              >
                {(data?.averageEmission ?? 0).toFixed(2)}
              </h2>

              <p
                className="
                text-sm
                text-slate-500
                "
              >
                kg CO₂e
              </p>
            </div>

            <div
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              border
              "
            >
              <p className="text-slate-500">📈 Latest Emission</p>

              <h2
                className="
                text-3xl
                font-bold
                mt-2
                "
              >
                {(data?.latestEmission ?? 0).toFixed(2)}
              </h2>

              <p
                className="
                text-sm
                text-slate-500
                "
              >
                kg CO₂e
              </p>
            </div>

            <div
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              border
              "
            >
              <p className="text-slate-500">🎯 Active Goals</p>

              <h2
                className="
                text-3xl
                font-bold
                mt-2
                "
              >
                {data?.activeGoals ?? 0}
              </h2>
            </div>

            <div
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              border
              "
            >
              <p className="text-slate-500">🌱 Carbon Score</p>

              <h2
                className={`
                text-3xl
                font-bold
                mt-2
                ${getScoreColor(score)}
                `}
              >
                {score}/100
              </h2>

              <p
                className={`
                mt-2
                font-medium
                ${getScoreColor(score)}
                `}
              >
                {getLevel(score)}
              </p>
            </div>
          </div>

          {/* REWARDS SNAPSHOT */}

          <div
            className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border
            mb-8
            "
          >
            <h2
              className="
              text-xl
              font-bold
              mb-5
              "
            >
              🏆 Rewards Snapshot
            </h2>

            <div
              className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-5
              "
            >
              <div>
                <p className="text-slate-500">Level</p>

                <h3
                  className="
                  text-xl
                  font-bold
                  text-purple-600
                  "
                >
                  {gamification.level}
                </h3>
              </div>

              <div>
                <p className="text-slate-500">Points</p>

                <h3
                  className="
                  text-xl
                  font-bold
                  text-green-600
                  "
                >
                  {gamification.greenPoints}
                </h3>
              </div>

              <div>
                <p className="text-slate-500">Streak</p>

                <h3
                  className="
                  text-xl
                  font-bold
                  text-orange-500
                  "
                >
                  {gamification.currentStreak} Days
                </h3>
              </div>

              <div>
                <p className="text-slate-500">Achievements</p>

                <h3
                  className="
                  text-xl
                  font-bold
                  text-blue-600
                  "
                >
                  {gamification.achievements?.length ?? 0}
                </h3>
              </div>
            </div>
          </div>

          {/* CHARTS */}

          {history.length > 0 && (
            <div
              className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-6
              mb-8
              "
            >
              <EmissionTrendChart data={history} />

              <ScoreTrendChart data={history} />
            </div>
          )}

          {/* ACHIEVEMENTS */}

          {gamification.achievements?.length > 0 && (
            <div
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              border
              "
            >
              <h2
                className="
                text-2xl
                font-bold
                mb-4
                "
              >
                🏅 Recent Achievements
              </h2>

              <div className="space-y-3">
                {gamification.achievements
                  ?.slice(0, 5)
                  .map((achievement, index) => (
                    <div
                      key={index}
                      className="
                        bg-green-50
                        border
                        border-green-200
                        rounded-xl
                        p-4
                        text-green-700
                        "
                    >
                      ✅ {achievement}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
