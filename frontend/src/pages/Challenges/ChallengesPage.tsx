import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import PageLoader from "../../components/ui/PageLoader";

import ChallengeCard from "../../components/cards/ChallengeCard";

import api from "../../api/api";

import { getUserKey } from "../../services/localStorage";

import { GamificationResponse } from "../../types/gamification";

export default function ChallengesPage() {
  const [daily, setDaily] = useState<any>();

  const [history, setHistory] = useState<any[]>([]);

  const [missions, setMissions] = useState<any>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [gamification, setGamification] = useState<GamificationResponse>();

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setPageLoading(true);

      const userKey = getUserKey();

      const [
        dailyResponse,
        missionsResponse,
        historyResponse,
        gamificationResponse,
      ] = await Promise.all([
        api.get(`/api/challenges/daily?userKey=${userKey}`),
        api.get("/api/challenges/missions"),
        api.get(`/api/challenges/history?userKey=${userKey}`),
        api.get(`/api/gamification?userKey=${userKey}`),
      ]);

      setDaily(dailyResponse?.data ?? {});

      setMissions(missionsResponse?.data ?? {});

      setHistory(historyResponse?.data ?? []);

      setGamification(gamificationResponse?.data ?? {});
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const completeChallenge = async () => {
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

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "transport":
        return "🚲";

      case "food":
        return "🥗";

      case "energy":
        return "⚡";

      case "lifestyle":
        return "🌿";

      default:
        return "🌱";
    }
  };

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
          {/* HERO */}

          <div
            className="
              bg-gradient-to-r
              from-emerald-600
              via-green-600
              to-teal-600
              rounded-3xl
              p-8
              mb-8
              shadow-[0_20px_60px_rgba(5,150,105,0.25)]
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-white/15
                border
                border-white/20
                backdrop-blur-sm
                mb-5
              "
            >
              <span
                style={{
                  color: "#ffffff",
                }}
                className="text-sm font-medium"
              >
                🏆 Sustainability Challenges
              </span>
            </div>

            <h1
              style={{
                color: "#ffffff",
              }}
              className="
                text-5xl
                font-bold
                leading-tight
              "
            >
              Sustainability Challenges
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.9)",
              }}
              className="
                mt-4
                text-lg
                max-w-2xl
                leading-relaxed
              "
            >
              Complete eco-friendly actions, earn rewards, and improve your
              sustainability score through engaging sustainability challenges.
            </p>
          </div>

          {/* GAMIFICATION */}

          {gamification && (
            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
              mb-8
              "
            >
              <div
                className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                "
              >
                <p className="text-slate-500">🌿 Green Points</p>

                <h2
                  className="
                  text-4xl
                  font-bold
                  text-green-600
                  mt-2
                  "
                >
                  {gamification.greenPoints}
                </h2>
              </div>

              <div
                className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                "
              >
                <p className="text-slate-500">🔥 Current Streak</p>

                <h2
                  className="
                  text-4xl
                  font-bold
                  text-orange-500
                  mt-2
                  "
                >
                  {gamification.currentStreak}
                </h2>
              </div>

              <div
                className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                "
              >
                <p className="text-slate-500">🏆 Level</p>

                <h2
                  className="
                  text-3xl
                  font-bold
                  text-blue-600
                  mt-2
                  "
                >
                  {gamification.level}
                </h2>
              </div>
            </div>
          )}

          {/* DAILY CHALLENGE */}

          {daily && (
            <ChallengeCard
              challenge={daily}
              loading={loading}
              onComplete={completeChallenge}
            />
          )}

          {/* DAILY MISSIONS */}

          <div
            className="
            mt-8
            "
          >
            <h2
              className="
              text-2xl
              font-bold
              mb-5
              "
            >
              📅 Daily Missions
            </h2>

            <div
              className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
              gap-5
              "
            >
              {missions.daily.map((mission: any) => (
                <div
                  key={mission.challengeId}
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-5
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    "
                >
                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      mb-3
                      "
                  >
                    <span>{getCategoryIcon(mission.category)}</span>

                    <span
                      className="
                        text-xs
                        px-3
                        py-1
                        rounded-full
                        bg-green-100
                        text-green-700
                        "
                    >
                      {mission.category}
                    </span>
                  </div>

                  <h3
                    className="
                      font-bold
                      text-lg
                      "
                  >
                    {mission.title}
                  </h3>

                  <p
                    className="
                      text-slate-500
                      mt-2
                      "
                  >
                    {mission.description}
                  </p>

                  <div
                    className="
                      flex
                      gap-2
                      mt-4
                      text-sm
                      "
                  >
                    <span>🏆 {mission.points}</span>

                    <span>🌍 {mission.carbonSaved}kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WEEKLY MISSIONS */}

          <div className="mt-10">
            <h2
              className="
              text-2xl
              font-bold
              mb-5
              "
            >
              🔥 Weekly Missions
            </h2>

            <div
              className="
              grid
              md:grid-cols-3
              gap-5
              "
            >
              {missions.weekly.map((mission: any) => (
                <div
                  key={mission.challengeId}
                  className="
                    bg-orange-50
                    border
                    border-orange-200
                    rounded-2xl
                    p-5
                    "
                >
                  <h3
                    className="
                      font-bold
                      "
                  >
                    {mission.title}
                  </h3>

                  <p
                    className="
                      text-slate-600
                      mt-2
                      "
                  >
                    {mission.description}
                  </p>

                  <div className="mt-3">🏆 {mission.points}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MONTHLY MISSIONS */}

          <div className="mt-10">
            <h2
              className="
              text-2xl
              font-bold
              mb-5
              "
            >
              🏆 Monthly Missions
            </h2>

            <div
              className="
              grid
              md:grid-cols-3
              gap-5
              "
            >
              {missions.monthly.map((mission: any) => (
                <div
                  key={mission.challengeId}
                  className="
                    bg-purple-50
                    border
                    border-purple-200
                    rounded-2xl
                    p-5
                    "
                >
                  <h3
                    className="
                      font-bold
                      "
                  >
                    {mission.title}
                  </h3>

                  <p
                    className="
                      text-slate-600
                      mt-2
                      "
                  >
                    {mission.description}
                  </p>

                  <div className="mt-3">🏆 {mission.points}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ACHIEVEMENTS */}

          {(gamification?.achievements?.length ?? 0) > 0 && (
            <div
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              mt-8
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

              <div className="space-y-2">
                {gamification?.achievements
                  ?.slice(0, 3)
                  .map((achievement, index) => (
                    <div
                      key={index}
                      className="
                        bg-green-50
                        text-green-700
                        px-4
                        py-3
                        rounded-xl
                        "
                    >
                      ✅ {achievement}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* HISTORY */}

          <div className="mt-10">
            <h2
              className="
              text-2xl
              font-bold
              mb-4
              "
            >
              Challenge History
            </h2>

            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="
                    bg-white
                    p-5
                    rounded-2xl
                    border
                    border-slate-200
                    flex
                    justify-between
                    items-center
                    "
                >
                  <span>✅ {item.title}</span>

                  <span
                    className="
                      text-green-600
                      font-semibold
                      "
                  >
                    +{item.points || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
