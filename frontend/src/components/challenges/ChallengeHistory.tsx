import { ChallengeHistory } from "@/types/challenge";

interface Props {
  history: ChallengeHistory[];
}

export default function ChallengeHistorySection({ history }: Props) {
  if (history.length === 0) {
    return null;
  }

  return (
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
        {history.map((item) => (
          <div
            key={`${item.challengeId}-${item.completedAt}`}
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
            <div>
              <p className="font-medium">✅ {item.title}</p>

              {item.completedAt && (
                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  {new Date(item.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <span
              className="
                text-green-600
                font-semibold
              "
            >
              {item.completed ? "Completed" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
