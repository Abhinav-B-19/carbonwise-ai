import { GamificationResponse } from "@/types/gamification";

interface Props {
  gamification?: GamificationResponse;
}

export default function ChallengeStats({ gamification }: Props) {
  if (!gamification) {
    return null;
  }

  return (
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
  );
}
