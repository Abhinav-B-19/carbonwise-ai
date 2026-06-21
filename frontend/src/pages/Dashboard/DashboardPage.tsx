import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import PageLoader from "../../components/ui/PageLoader";

import DashboardHero from "../../components/dashboard/DashboardHero";
import DashboardStats from "../../components/dashboard/DashboardStats";
import DashboardAchievements from "../../components/dashboard/DashboardAchievements";

import EmissionTrendChart from "../../components/charts/EmissionTrendChart";
import ScoreTrendChart from "../../components/charts/ScoreTrendChart";

import api from "../../api/api";
import { getUserKey } from "../../services/localStorage";

import { getLevel, getScoreColor } from "../../utils/carbonScore";

import type { GamificationResponse } from "../../types/gamification";
import type { CarbonHistoryItem } from "@/types/carbon";

interface DashboardData {
  carbonScore: number;
  totalCalculations: number;
  averageEmission: number;
  latestEmission: number;
  activeGoals: number;
}

const EMPTY_DASHBOARD: DashboardData = {
  carbonScore: 0,
  totalCalculations: 0,
  averageEmission: 0,
  latestEmission: 0,
  activeGoals: 0,
};

const EMPTY_GAMIFICATION: GamificationResponse = {
  greenPoints: 0,
  currentStreak: 0,
  level: "",
  achievements: [],
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<DashboardData>(EMPTY_DASHBOARD);

  const [history, setHistory] = useState<CarbonHistoryItem[]>([]);

  const [gamification, setGamification] =
    useState<GamificationResponse>(EMPTY_GAMIFICATION);

  const loadData = useCallback(async () => {
    try {
      const userKey = getUserKey();

      if (!userKey) {
        setLoading(false);
        return;
      }

      const [dashboardResponse, historyResponse, gamificationResponse] =
        await Promise.all([
          api.get(`/api/dashboard?userKey=${userKey}`),
          api.get(`/api/dashboard/history?userKey=${userKey}`),
          api.get(`/api/gamification?userKey=${userKey}`),
        ]);

      setDashboard(dashboardResponse?.data ?? EMPTY_DASHBOARD);

      setHistory((historyResponse?.data ?? []) as CarbonHistoryItem[]);

      setGamification(gamificationResponse?.data ?? EMPTY_GAMIFICATION);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const userName = localStorage.getItem("name") ?? "Eco Warrior";

  const score = dashboard.carbonScore ?? 0;

  const activeGoals = dashboard.activeGoals ?? 0;

  const totalCalculations = dashboard.totalCalculations ?? 0;

  const completedChallenges = gamification.achievements?.length ?? 0;

  const userLevel = getLevel(score);

  const scoreColor = getScoreColor(score);

  const scoreGradient = useMemo(
    () =>
      `conic-gradient(
          white ${score * 3.6}deg,
          rgba(255,255,255,0.15) 0deg
        )`,
    [score],
  );

  const recentAchievements = useMemo(
    () => gamification.achievements?.slice(0, 5) ?? [],
    [gamification.achievements],
  );

  if (loading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageLoader />
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="py-8 space-y-8">
          <DashboardHero
            userName={userName}
            score={score}
            greenPoints={gamification.greenPoints}
            currentStreak={gamification.currentStreak}
            level={gamification.level}
            totalCalculations={totalCalculations}
            scoreGradient={scoreGradient}
          />

          {/* QUICK ACTIONS */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-5">⚡ Quick Actions</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/calculator"
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
              </Link>

              <Link
                to="/goals"
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
              </Link>

              <Link
                to="/ai-coach"
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
              </Link>

              <Link
                to="/scenario"
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
              </Link>
            </div>
          </div>

          {/* STATS */}

          <DashboardStats
            data={dashboard}
            score={score}
            scoreColor={scoreColor}
            activeGoals={activeGoals}
            completedChallenges={completedChallenges}
          />

          {/* REWARDS SNAPSHOT */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold mb-6">🏆 Rewards Snapshot</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-500">Green Points</p>

                <h3 className="text-3xl font-bold text-green-600">
                  {gamification.greenPoints}
                </h3>
              </div>

              <div>
                <p className="text-slate-500">Streak</p>

                <h3 className="text-3xl font-bold text-orange-500">
                  {gamification.currentStreak} Days
                </h3>
              </div>

              <div>
                <p className="text-slate-500">Sustainability Level</p>

                <h3 className={`text-xl font-bold ${scoreColor}`}>
                  {userLevel}
                </h3>
              </div>
            </div>
          </div>

          {/* CHARTS */}

          <div className="grid lg:grid-cols-2 gap-8">
            <EmissionTrendChart data={history} />

            <ScoreTrendChart data={history} />
          </div>

          {/* ACHIEVEMENTS */}

          <DashboardAchievements achievements={recentAchievements} />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
