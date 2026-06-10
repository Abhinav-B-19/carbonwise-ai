interface Goal {
    id: number;
    goalType: string;
    targetValue: number;
    currentValue: number;
    status: string;
    createdAt: string;
  }
  
  interface Props {
    goal: Goal;
    onDelete: (goalId: number) => void;
    isDeleting?: boolean;
  }
  
  export default function GoalCard({
    goal,
    onDelete,
    isDeleting = false,
  }: Props) {
    const type =
      goal.goalType?.toLowerCase();
  
    const progress = (() => {
      if (goal.targetValue <= 0) {
        return 0;
      }
  
      const isReductionGoal =
        type.includes("reduce");
  
      if (isReductionGoal) {
        return goal.currentValue <=
          goal.targetValue
          ? 100
          : Math.max(
              0,
              Math.round(
                (goal.targetValue /
                  goal.currentValue) *
                  100
              )
            );
      }
  
      return goal.currentValue >=
        goal.targetValue
        ? 100
        : Math.min(
            100,
            Math.round(
              (goal.currentValue /
                goal.targetValue) *
                100
            )
          );
    })();
  
    const getStatusColor = () => {
      switch (
        goal.status?.toLowerCase()
      ) {
        case "completed":
          return "bg-green-100 text-green-700";
  
        case "active":
          return "bg-blue-100 text-blue-700";
  
        default:
          return "bg-slate-100 text-slate-700";
      }
    };
  
    return (
      <div
        className="
        bg-white
        rounded-2xl
        p-6
        shadow-sm
        border
        border-slate-200
        hover:shadow-md
        transition-all
        "
      >
        <div
          className="
          flex
          justify-between
          items-start
          mb-5
          "
        >
          <h3
            className="
            text-lg
            font-bold
            "
          >
            🎯 {goal.goalType}
          </h3>
  
          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
              ${getStatusColor()}
            `}
          >
            {goal.status}
          </span>
        </div>
  
        <div className="space-y-4">
          <div>
            <p className="text-slate-500 text-sm">
              Target Goal
            </p>
  
            <p
              className="
              text-3xl
              font-bold
              text-green-600
              "
            >
              {goal.targetValue}
            </p>
          </div>
  
          <div>
            <p className="text-slate-500 text-sm">
              Current Value
            </p>
  
            <p
              className="
              text-xl
              font-semibold
              "
            >
              {goal.currentValue}
            </p>
          </div>
  
          <div>
            <div
              className="
              flex
              justify-between
              mb-2
              text-sm
              "
            >
              <span>
                Progress
              </span>
  
              <span>
                {progress}%
              </span>
            </div>
  
            <div
              className="
              h-3
              bg-slate-200
              rounded-full
              overflow-hidden
              "
            >
              <div
                className="
                h-full
                bg-green-500
                transition-all
                duration-500
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
  
          <div>
            <p className="text-slate-500 text-sm">
              Created
            </p>
  
            <p>
              {new Date(
                goal.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
  
          <button
            type="button"
            disabled={isDeleting}
            onClick={() =>
              onDelete(goal.id)
            }
            className="
            w-full
            mt-4
            bg-red-50
            text-red-600
            border
            border-red-200
            py-2
            rounded-xl
            font-medium
            hover:bg-red-100
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            {isDeleting
              ? "Deleting..."
              : "🗑 Delete Goal"}
          </button>
        </div>
      </div>
    );
  }