import {
    useEffect,
    useState,
  } from "react";
  
  import DashboardLayout from "../../components/layout/DashboardLayout";
  import PageContainer from "../../components/layout/PageContainer";
  import PageLoader from "../../components/ui/PageLoader";
  
  import api from "../../api/api";
  
  import {
    getUserKey,
  } from "../../services/localStorage";
  
  export default function GamificationPage() {
    const [data, setData] =
      useState<any>();
  
    useEffect(() => {
      loadGamification();
    }, []);
  
    const loadGamification =
      async () => {
        try {
          const userKey =
            getUserKey();
  
          const response =
            await api.get(
              `/api/gamification?userKey=${userKey}`
            );
  
          setData(
            response.data
          );
        } catch (error) {
          console.error(
            "Failed to load gamification",
            error
          );
        }
      };
  
    const getLevelDisplay =
      (level: string) => {
        switch (
          level?.toLowerCase()
        ) {
          case "eco champion":
            return `🏆 ${level}`;
  
          case "green advocate":
            return `🌿 ${level}`;
  
          default:
            return `🌱 ${level}`;
        }
      };
  
      if (!data) {
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
                🏆 Rewards &
                Achievements
              </h1>
  
              <p className="mt-2">
                Track your progress
                towards a greener future.
              </p>
            </div>
  
            {/* STATS */}
  
            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
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
                border
                border-slate-200
                "
              >
                <p className="text-slate-500">
                  Green Points
                </p>
  
                <h2
                  className="
                  text-4xl
                  font-bold
                  text-green-600
                  "
                >
                  {data.greenPoints}
                </h2>
              </div>
  
              <div
                className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                border
                border-slate-200
                "
              >
                <p className="text-slate-500">
                  Current Streak
                </p>
  
                <h2
                  className="
                  text-4xl
                  font-bold
                  text-orange-500
                  "
                >
                  {data.currentStreak}
                </h2>
  
                <p
                  className="
                  text-sm
                  text-slate-500
                  mt-1
                  "
                >
                  Days
                </p>
              </div>
  
              <div
                className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                border
                border-slate-200
                "
              >
                <p className="text-slate-500">
                  Level
                </p>
  
                <h2
                  className="
                  text-2xl
                  font-bold
                  text-purple-600
                  "
                >
                  {getLevelDisplay(
                    data.level
                  )}
                </h2>
              </div>
  
              <div
                className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                border
                border-slate-200
                "
              >
                <p className="text-slate-500">
                  Achievements
                </p>
  
                <h2
                  className="
                  text-4xl
                  font-bold
                  text-blue-600
                  "
                >
                  {data
                    .achievements
                    ?.length ?? 0}
                </h2>
              </div>
            </div>
  
            {/* ACHIEVEMENTS */}
  
            <div
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              border
              border-slate-200
              "
            >
              <h2
                className="
                text-2xl
                font-bold
                mb-5
                "
              >
                🏅 Achievements
              </h2>
  
              <div
                className="
                flex
                flex-wrap
                gap-3
                "
              >
                {data
                  .achievements
                  ?.length > 0 ? (
                  data.achievements.map(
                    (
                      achievement: string,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="
                        bg-green-100
                        text-green-700
                        px-4
                        py-2
                        rounded-full
                        font-medium
                        "
                      >
                        {achievement}
                      </div>
                    )
                  )
                ) : (
                  <div
                    className="
                    py-6
                    text-slate-500
                    "
                  >
                    🏆 Complete
                    challenges and
                    sustainability goals
                    to unlock your
                    first achievement.
                  </div>
                )}
              </div>
            </div>
  
          </div>
  
        </PageContainer>
      </DashboardLayout>
    );
  }