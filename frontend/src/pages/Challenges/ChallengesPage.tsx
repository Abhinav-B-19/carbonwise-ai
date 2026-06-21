import { useCallback, useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import PageLoader from "../../components/ui/PageLoader";
import ChallengeCard from "../../components/cards/ChallengeCard";

import ChallengeHero from "../../components/challenges/ChallengeHero";
import ChallengeStats from "../../components/challenges/ChallengeStats";
import MissionSection from "../../components/challenges/MissionSection";
import ChallengeAchievements from "../../components/challenges/ChallengeAchievements";
import ChallengeHistorySection from "../../components/challenges/ChallengeHistory";

import api from "../../api/api";
import { getUserKey } from "../../services/localStorage";

import { GamificationResponse } from "../../types/gamification";

import {
  ChallengeHistory,
  ChallengeMissions,
  DailyChallenge,
} from "@/types/challenge";

export default function ChallengesPage() {
  const [daily, setDaily] = useState<DailyChallenge | null>(null);

  const [history, setHistory] = useState<ChallengeHistory[]>([]);

  const [missions, setMissions] = useState<ChallengeMissions>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [gamification, setGamification] = useState<GamificationResponse>();

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const userKey = getUserKey();

      if (!userKey) {
        setLoading(false);
        setPageLoading(false);
        return;
      }

      const [
        dailyResponse,
        missionsResponse,
        historyResponse,
        gamificationResponse,
      ] = await Promise.all([
        api.get(`/api/challenges/today?userKey=${userKey}`),
        api.get(`/api/challenges/missions?userKey=${userKey}`),
        api.get(`/api/challenges/history?userKey=${userKey}`),
        api.get(`/api/gamification?userKey=${userKey}`),
      ]);

      setDaily(dailyResponse.data ?? null);

      setHistory(historyResponse.data ?? []);

      setGamification(gamificationResponse.data);

      setMissions(
        missionsResponse.data ?? {
          daily: [],
          weekly: [],
          monthly: [],
        },
      );
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const completeChallenge = async () => {
    if (!daily) {
      return;
    }

    try {
      setLoading(true);

      const userKey = getUserKey();

      await api.post(`/api/challenges/complete?userKey=${userKey}`, {
        challengeId: daily.challengeId,
      });

      toast.success("Challenge Completed!");

      await loadData();
    } catch {
      toast.error("Failed to complete challenge");
    } finally {
      setLoading(false);
    }
  };

  const recentAchievements = useMemo(
    () => gamification?.achievements?.slice(0, 3) ?? [],
    [gamification?.achievements],
  );

  const dailyMissions = useMemo(() => missions.daily, [missions.daily]);

  const weeklyMissions = useMemo(() => missions.weekly, [missions.weekly]);

  const monthlyMissions = useMemo(() => missions.monthly, [missions.monthly]);

  if (pageLoading) {
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
        <div className="py-8">
          <ChallengeHero />

          <ChallengeStats gamification={gamification} />

          {daily && (
            <ChallengeCard
              challenge={daily}
              loading={loading}
              onComplete={completeChallenge}
            />
          )}

          <MissionSection
            title="📅 Daily Missions"
            missions={dailyMissions}
            variant="green"
          />

          <MissionSection
            title="🔥 Weekly Missions"
            missions={weeklyMissions}
            variant="orange"
          />

          <MissionSection
            title="🏆 Monthly Missions"
            missions={monthlyMissions}
            variant="purple"
          />

          <ChallengeAchievements achievements={recentAchievements} />

          <ChallengeHistorySection history={history} />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
