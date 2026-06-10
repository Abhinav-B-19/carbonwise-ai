import {
    useEffect,
    useState,
  } from "react";
  
  import toast from "react-hot-toast";
  
  import api from "../../api/api";
  
  import DashboardLayout from "../../components/layout/DashboardLayout";
  import PageContainer from "../../components/layout/PageContainer";
  
  import GoalCard from "../../components/cards/GoalCard";
  import CreateGoalForm from "../../components/forms/GoalForm";
  
  import {
    getUserKey,
  } from "../../services/localStorage";
  
  export default function GoalsPage() {
    const [goals, setGoals] =
      useState<any[]>([]);
  
    const [loading, setLoading] =
      useState(false);
  
    const [pageLoading, setPageLoading] =
      useState(true);
  
    const [deletingGoalId, setDeletingGoalId] =
      useState<number | null>(null);
  
    useEffect(() => {
      loadGoalsAndSync();
    }, []);
  
    const loadGoalsAndSync =
      async () => {
        try {
          setPageLoading(true);
  
          const userKey =
            getUserKey();
  
          if (!userKey) {
            return;
          }
  
          const [
            goalsResponse,
            historyResponse,
          ] = await Promise.all([
            api.get(
              `/api/goals?userKey=${userKey}`
            ),
            api.get(
              `/api/carbon/history?userKey=${userKey}`
            ),
          ]);
  
          const goals =
            goalsResponse.data || [];
  
          const history =
            historyResponse.data || [];
  
          const latest =
            history.length > 0
              ? history[0]
              : null;
  
          if (!latest) {
            setGoals(goals);
            return;
          }
  
          const updatedGoals =
            await Promise.all(
              goals.map(
                async (
                  goal: any
                ) => {
                  let currentValue = 0;
                  let status =
                    "Active";
  
                  switch (
                    goal.goalType
                  ) {
                    case "Improve Carbon Score":
  
                    case "General Sustainability":
                      currentValue =
                        latest.carbonScore;
  
                      status =
                        currentValue >=
                        goal.targetValue
                          ? "Completed"
                          : "Active";
  
                      break;
  
                    case "Reduce Total Emissions":
                      currentValue =
                        latest.totalEmission;
  
                      status =
                        currentValue <=
                        goal.targetValue
                          ? "Completed"
                          : "Active";
  
                      break;
  
                    default:
                      currentValue =
                        goal.currentValue;
  
                      status =
                        goal.status;
                  }
  
                  const needsUpdate =
                    currentValue !==
                      goal.currentValue ||
                    status !==
                      goal.status;
  
                  if (
                    needsUpdate
                  ) {
                    try {
                      await api.put(
                        `/api/goals/${goal.id}`,
                        {
                          currentValue,
                          status,
                        }
                      );
                    } catch (
                      error
                    ) {
                      console.error(
                        error
                      );
                    }
                  }
  
                  return {
                    ...goal,
                    currentValue,
                    status,
                  };
                }
              )
            );
  
          setGoals(
            updatedGoals
          );
        } catch (error) {
          console.error(error);
  
          toast.error(
            "Unable to load goals"
          );
        } finally {
          setPageLoading(false);
        }
      };
  
    const createGoal =
      async (
        goalType: string,
        targetValue: number
      ) => {
        try {
          setLoading(true);
  
          const userKey =
            getUserKey();
  
          if (!userKey) {
            toast.error(
              "User not found"
            );
            return;
          }
  
          await api.post(
            `/api/goals?userKey=${userKey}`,
            {
              goalType,
              targetValue,
            }
          );
  
          toast.success(
            "Goal created successfully"
          );
  
          await loadGoalsAndSync();
        } catch (error) {
          console.error(error);
  
          toast.error(
            "Unable to create goal"
          );
        } finally {
          setLoading(false);
        }
      };
  
    const deleteGoal = async (
      goalId: number
    ) => {
      const confirmed =
        window.confirm(
          "Delete this goal?"
        );
  
      if (!confirmed) {
        return;
      }
  
      try {
        setDeletingGoalId(
          goalId
        );
  
        await api.delete(
          `/api/goals/${goalId}`
        );
  
        toast.success(
          "Goal deleted successfully"
        );
  
        await loadGoalsAndSync();
      } catch (error) {
        console.error(error);
  
        toast.error(
          "Unable to delete goal"
        );
      } finally {
        setDeletingGoalId(
          null
        );
      }
    };
  
    const activeGoals =
      goals.filter(
        (g) =>
          g.status?.toLowerCase() ===
          "active"
      ).length;
  
    const completedGoals =
      goals.filter(
        (g) =>
          g.status?.toLowerCase() ===
          "completed"
      ).length;
  
    const completionRate =
      goals.length > 0
        ? Math.round(
            (completedGoals /
              goals.length) *
              100
          )
        : 0;
  
    if (pageLoading) {
      return (
        <DashboardLayout>
          <PageContainer>
            <div className="py-12">
              <div
                className="
                bg-white
                rounded-2xl
                p-8
                text-center
                shadow-sm
                border
                border-slate-200
                "
              >
                Loading goals...
              </div>
            </div>
          </PageContainer>
        </DashboardLayout>
      );
    }
  
    return (
      <DashboardLayout>
        <PageContainer>
          <div className="py-8 min-h-screen">
  
            <div
              className="
              grid
              grid-cols-1
              lg:grid-cols-12
              gap-8
              items-start
              "
            >
              {/* LEFT PANEL */}
  
              <div
                className="
                lg:col-span-4
                "
              >
                <div
                  className="
                  lg:sticky
                  lg:top-6
                  "
                >
                  <CreateGoalForm
                    onSubmit={
                      createGoal
                    }
                    loading={
                      loading
                    }
                  />
                </div>
              </div>
  
              {/* RIGHT PANEL */}
  
              <div
                className="
                lg:col-span-8
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
                  mb-6
                  "
                >
                  <h2
                    className="
                    text-xl
                    font-bold
                    mb-5
                    "
                  >
                    📊 Goals Summary
                  </h2>
  
                  <div
                    className="
                    grid
                    grid-cols-3
                    gap-4
                    "
                  >
                    <div>
                      <p className="text-sm text-slate-500">
                        Active
                      </p>
  
                      <p className="text-3xl font-bold text-blue-600">
                        {activeGoals}
                      </p>
                    </div>
  
                    <div>
                      <p className="text-sm text-slate-500">
                        Completed
                      </p>
  
                      <p className="text-3xl font-bold text-green-600">
                        {completedGoals}
                      </p>
                    </div>
  
                    <div>
                      <p className="text-sm text-slate-500">
                        Completion Rate
                      </p>
  
                      <p className="text-3xl font-bold text-purple-600">
                        {completionRate}%
                      </p>
                    </div>
                  </div>
                </div>
  
                {goals.length === 0 ? (
                  <div
                    className="
                    bg-white
                    rounded-2xl
                    p-12
                    text-center
                    shadow-sm
                    border
                    border-slate-200
                    "
                  >
                    <div className="text-6xl mb-4">
                      🎯
                    </div>
  
                    <h3 className="text-2xl font-bold mb-2">
                      No goals yet
                    </h3>
  
                    <p className="text-slate-500">
                      Create your first
                      sustainability goal
                      to start tracking
                      progress.
                    </p>
                  </div>
                ) : (
                  <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                    "
                  >
                    {goals.map(
                      (goal) => (
                        <GoalCard
                          key={
                            goal.id
                          }
                          goal={
                            goal
                          }
                          onDelete={
                            deleteGoal
                          }
                          isDeleting={
                            deletingGoalId ===
                            goal.id
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
  
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }