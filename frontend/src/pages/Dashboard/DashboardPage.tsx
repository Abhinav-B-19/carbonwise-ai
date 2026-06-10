import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";

import EmissionTrendChart from "../../components/charts/EmissionTrendChart";
import ScoreTrendChart from "../../components/charts/ScoreTrendChart";

import api from "../../api/api";
import { getUserKey } from "../../services/localStorage";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  const [history, setHistory] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const userName =
    localStorage.getItem(
      "carbonwise_userName"
    ) || "Eco Warrior";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const userKey = getUserKey();

      if (!userKey) return;

      const dashboardResponse =
        await api.get(
          `/api/dashboard?userKey=${userKey}`
        );

      const historyResponse =
        await api.get(
          `/api/carbon/history?userKey=${userKey}`
        );

      setData(
        dashboardResponse.data
      );

      setHistory(
        historyResponse.data || []
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
          <div className="py-10">
            Loading Dashboard...
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
              progress and reduce your
              carbon footprint.
            </p>

            <div
              className="
              mt-8
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
              "
            >
              <div>
                <p className="text-green-100">
                  Current Score
                </p>

                <h2
                  className="
                  text-5xl
                  font-bold
                  "
                >
                  {score}/100
                </h2>
              </div>

              <div>
                <p className="text-green-100">
                  Sustainability Level
                </p>

                <h2
                  className="
                  text-3xl
                  font-bold
                  "
                >
                  {getLevel(score)}
                </h2>
              </div>

              <div>
                <p className="text-green-100">
                  Assessments
                </p>

                <h2
                  className="
                  text-5xl
                  font-bold
                  "
                >
                  {data?.totalCalculations ?? 0}
                </h2>
              </div>
            </div>
          </div>

          {/* METRIC CARDS */}

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
                {data?.averageEmission ?? 0}
              </h2>

              <p
                className="
                text-sm
                text-slate-500
                mt-1
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
                {data?.latestEmission ?? 0}
              </h2>

              <p
                className="
                text-sm
                text-slate-500
                mt-1
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

        </div>

      </PageContainer>
    </DashboardLayout>
  );
}