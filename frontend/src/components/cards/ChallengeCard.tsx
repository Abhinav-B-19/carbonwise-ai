interface Props {
    challenge: any;
    onComplete: () => void;
    loading?: boolean;
  }
  
  export default function ChallengeCard({
    challenge,
    onComplete,
    loading,
  }: Props) {
    return (
      <div
        className="
        bg-white
        rounded-3xl
        p-8
        shadow-sm
        border
        border-slate-200
        "
      >
        <div
          className="
          flex
          justify-between
          items-start
          mb-6
          "
        >
          <div>
            <h2
              className="
              text-3xl
              font-bold
              "
            >
              🌱 Today's Challenge
            </h2>
  
            <p
              className="
              text-slate-500
              mt-2
              "
            >
              Complete eco-friendly actions
              and earn rewards.
            </p>
          </div>
  
          {challenge.completed && (
            <span
              className="
              px-4
              py-2
              rounded-full
              bg-green-100
              text-green-700
              font-semibold
              "
            >
              Completed
            </span>
          )}
        </div>
  
        <h3
          className="
          text-2xl
          font-bold
          mb-4
          "
        >
          {challenge.title}
        </h3>
  
        <p
          className="
          text-slate-600
          mb-6
          "
        >
          {challenge.description}
        </p>
  
        <div
          className="
          flex
          flex-wrap
          gap-3
          mb-8
          "
        >
          <div
            className="
            bg-green-100
            text-green-700
            px-4
            py-2
            rounded-xl
            font-semibold
            "
          >
            +{challenge.points} Points
          </div>
  
          <div
            className="
            bg-blue-100
            text-blue-700
            px-4
            py-2
            rounded-xl
            font-semibold
            "
          >
            {challenge.carbonSaved} kg CO₂e Saved
          </div>
        </div>
  
        {!challenge.completed ? (
          <button
            onClick={onComplete}
            disabled={loading}
            className="
            bg-green-600
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
            hover:bg-green-700
            disabled:opacity-50
            "
          >
            {loading
              ? "Completing..."
              : "Complete Challenge"}
          </button>
        ) : (
          <div
            className="
            bg-green-50
            border
            border-green-200
            rounded-xl
            p-4
            text-green-700
            "
          >
            ✅ Challenge Completed
  
            <div className="mt-1 text-sm">
              You earned{" "}
              {challenge.points} Green Points
            </div>
          </div>
        )}
      </div>
    );
  }