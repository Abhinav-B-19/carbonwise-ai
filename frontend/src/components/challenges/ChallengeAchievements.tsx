interface Props {
  achievements: string[];
}

export default function ChallengeAchievements({ achievements }: Props) {
  if (achievements.length === 0) {
    return null;
  }

  return (
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
        {achievements.map((achievement, index) => (
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
  );
}
