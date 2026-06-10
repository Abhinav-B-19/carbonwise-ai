import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";

import EmissionTrendChart from "../../components/charts/EmissionTrendChart";
import ScoreTrendChart from "../../components/charts/ScoreTrendChart";

import api from "../../api/api";

import {
  getUserKey,
} from "../../services/localStorage";

interface GamificationResponse {
  greenPoints: number;
  currentStreak: number;
  level: string;
  achievements: string[];
}

export default function DashboardPage() {
  const [data, setData] =
    useState<any>(null);

  const [history, setHistory] =
    useState<any[]>([]);

  const [gamification, setGamification] =
    useState<GamificationResponse>({
      greenPoints: 0,
      currentStreak: 0,
      level: "",
      achievements: [],
    });

  const [loading, setLoading] =
    useState(true);

  const userName =
    localStorage.getItem(
      "carbonwise_userName"
    ) || "Eco Warrior";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard =
    async () => {
      try {
        const userKey =
          getUserKey();

        if (!userKey) return;

        const [
          dashboardResponse,
          historyResponse,
          gamificationResponse,
        ] = await Promise.all([
          api.get(
            `/api/dashboard?userKey=${userKey}`
          ),

          api.get(
            `/api/carbon/history?userKey=${userKey}`
          ),

          api.get(
            `/api/gamification?userKey=${userKey}`
          ),
        ]);

        setData(
          dashboardResponse.data
        );

        setHistory(
          historyResponse.data || []
        );

        setGamification(
          gamificationResponse.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const getLevel = (
    score: number
  ) => {
    if (score >= 80)
      return "Eco Champion";

    if (score >= 60)
      return "Green Advocate";

    if (score >= 40)
      return "Carbon Aware";

    if (score >= 20)
      return "Eco Beginner";

    return "Needs Improvement";
  };

  const getScoreColor = (
    score: number
  ) => {
    if (score >= 80)
      return "text-green-600";

    if (score >= 60)
      return "text-lime-600";

    if (score >= 40)
      return "text-yellow-600";

    if (score >= 20)
      return "text-orange-600";

    return "text-red-600";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <div
            className="
            flex
            items-center
            justify-center
            h-[60vh]
            "
          >
            <div
              className="
              text-xl
              font-semibold
              "
            >
              Loading Dashboard...
            </div>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  const score =
    data?.carbonScore ?? 0;

  return (
    <DashboardLayout>
      <PageContainer>

        <div className="py-8">

          {/* HERO */}

          <div
            className="
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            text-white
            rounded-3xl
            p-8
            shadow-lg
            mb-8
            "
          >
            <h1
              className="
              text-4xl
              font-bold
              "
            >
              Welcome Back,
              {" "}
              {userName}
              {" "}
              👋
            </h1>

            <p
              className="
              mt-3
              text-lg
              text-green-50
              "
            >
              Track your sustainability
              journey and achieve your
              eco goals.
            </p>

            <div
              className="
              mt-8
              grid
              grid-cols-2
              lg:grid-cols-5
              gap-6
              "
            >
              <div>
                <p className="text-green-100">
                  Carbon Score
                </p>

                <h2
                  className="
                  text-4xl
                  font-bold
                  "
                >
                  {score}/100
                </h2>
              </div>

              <div>
                <p className="text-green-100">
                  Level
                </p>

                <h2
                  className="
                  text-2xl
                  font-bold
                  "
                >
                  {gamification.level ||
                    getLevel(score)}
                </h2>
              </div>

              <div>
                <p className="text-green-100">
                  Green Points
                </p>

                <h2
                  className="
                  text-4xl
                  font-bold
                  "
                >
                  {
                    gamification.greenPoints
                  }
                </h2>
              </div>

              <div>
                <p className="text-green-100">
                  Streak
                </p>

                <h2
                  className="
                  text-4xl
                  font-bold
                  "
                >
                  {
                    gamification.currentStreak
                  }
                </h2>
              </div>

              <div>
                <p className="text-green-100">
                  Assessments
                </p>

                <h2
                  className="
                  text-4xl
                  font-bold
                  "
                >
                  {
                    data?.totalCalculations
                  }
                </h2>
              </div>
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
              <p className="text-slate-500">
                🌍 Average Emission
              </p>

              <h2
                className="
                text-3xl
                font-bold
                mt-2
                "
              >
                {(
                  data?.averageEmission ?? 0
                ).toFixed(2)}
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
              <p className="text-slate-500">
                📈 Latest Emission
              </p>

              <h2
                className="
                text-3xl
                font-bold
                mt-2
                "
              >
                {(
                  data?.latestEmission ?? 0
                ).toFixed(2)}
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
              <p className="text-slate-500">
                🎯 Active Goals
              </p>

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
              <p className="text-slate-500">
                🌱 Carbon Score
              </p>

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
              <EmissionTrendChart
                data={history}
              />

              <ScoreTrendChart
                data={history}
              />
            </div>
          )}

          {/* ACHIEVEMENTS */}

          {gamification.achievements
            .length > 0 && (
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
                  .slice(0, 5)
                  .map(
                    (
                      achievement,
                      index
                    ) => (
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
                    )
                  )}

              </div>
            </div>
          )}

        </div>

      </PageContainer>
    </DashboardLayout>
  );
}