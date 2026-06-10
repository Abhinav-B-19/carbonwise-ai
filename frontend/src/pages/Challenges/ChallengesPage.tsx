import {
    useEffect,
    useState,
  } from "react";
  
  import toast from "react-hot-toast";
  
  import DashboardLayout from "../../components/layout/DashboardLayout";
  import PageContainer from "../../components/layout/PageContainer";
  import PageLoader from "../../components/ui/PageLoader";
  
  import ChallengeCard from "../../components/cards/ChallengeCard";
  
  import api from "../../api/api";
  
  import {
    getUserKey,
  } from "../../services/localStorage";
  
  import {
    GamificationResponse,
  } from "../../types/gamification";
  
  export default function ChallengesPage() {
    const [daily, setDaily] =
      useState<any>();
  
    const [history, setHistory] =
      useState<any[]>([]);
  
    const [gamification, setGamification] =
      useState<GamificationResponse>();
  
    const [loading, setLoading] =
      useState(false);
    
    const [pageLoading, setPageLoading] =
      useState(true);
  
    useEffect(() => {
      loadData();
    }, []);
  
    const loadData = async () => {
      try {
        setPageLoading(true);
        const userKey =
          getUserKey();
  
        const [
          dailyResponse,
          historyResponse,
          gamificationResponse,
        ] = await Promise.all([
          api.get(
            `/api/challenges/daily?userKey=${userKey}`
          ),
          api.get(
            `/api/challenges/history?userKey=${userKey}`
          ),
          api.get(
            `/api/gamification?userKey=${userKey}`
          ),
        ]);
  
        setDaily(
          dailyResponse.data
        );
  
        setHistory(
          historyResponse.data || []
        );
  
        setGamification(
          gamificationResponse.data
        );
      } catch (error) {
        console.error(error);
      }finally {
        setPageLoading(false);
      }
    };
  
    const completeChallenge =
      async () => {
        try {
          setLoading(true);
  
          const userKey =
            getUserKey();
  
          await api.post(
            `/api/challenges/complete?userKey=${userKey}`,
            {
              challengeId:
                daily.challengeId,
            }
          );
  
          toast.success(
            "Challenge Completed!"
          );
  
          await loadData();
        } catch {
          toast.error(
            "Failed to complete challenge"
          );
        } finally {
          setLoading(false);
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
              from-green-500
              to-emerald-600
              text-white
              rounded-3xl
              p-8
              mb-8
              "
            >
              <h1
                className="
                text-4xl
                font-bold
                "
              >
                🏆 Sustainability Challenges
              </h1>
  
              <p
                className="
                mt-3
                text-lg
                "
              >
                Complete eco-friendly actions,
                earn rewards and improve
                your sustainability score.
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
                  <p className="text-slate-500">
                    🌿 Green Points
                  </p>
  
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
                  <p className="text-slate-500">
                    🔥 Current Streak
                  </p>
  
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
                  <p className="text-slate-500">
                    🏆 Level
                  </p>
  
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
                onComplete={
                  completeChallenge
                }
              />
            )}
  
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
                    .map(
                      (
                        achievement,
                        index
                      ) => (
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
                      )
                    )}
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
  
                {history.map(
                  (
                    item,
                    index
                  ) => (
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
                      <span>
                        ✅ {item.title}
                      </span>
  
                      <span
                        className="
                        text-green-600
                        font-semibold
                        "
                      >
                        +{item.points || 0}
                      </span>
                    </div>
                  )
                )}
  
              </div>
  
            </div>
  
          </div>
  
        </PageContainer>
      </DashboardLayout>
    );
  }