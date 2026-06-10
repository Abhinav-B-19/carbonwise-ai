import {
    useEffect,
    useState,
  } from "react";
  
  import DashboardLayout from "../../components/layout/DashboardLayout";
  import PageContainer from "../../components/layout/PageContainer";
  
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
        const userKey =
          getUserKey();
  
        const response =
          await api.get(
            `/api/gamification?userKey=${userKey}`
          );
  
        setData(
          response.data
        );
      };
  
    if (!data) {
      return (
        <DashboardLayout>
          <PageContainer>
            Loading...
          </PageContainer>
        </DashboardLayout>
      );
    }
  
    return (
      <DashboardLayout>
        <PageContainer>
  
          <div className="py-8">
  
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
                  Level
                </p>
  
                <h2
                  className="
                  text-3xl
                  font-bold
                  text-purple-600
                  "
                >
                  {data.level}
                </h2>
              </div>
            </div>
  
            <div
              className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              "
            >
              <h2
                className="
                text-2xl
                font-bold
                mb-4
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
                {data.achievements.map(
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
                )}
              </div>
            </div>
  
          </div>
  
        </PageContainer>
      </DashboardLayout>
    );
  }