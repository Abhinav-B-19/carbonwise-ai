import React from "react";

interface Props {
  achievements: string[];
}

function DashboardAchievements({ achievements }: Props) {
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
      border
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

      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="
                bg-green-50
                border
                border-green-200
                rounded-xl
                p-4
                text-green-700
              "
          >
            ✅ {achievement}
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(DashboardAchievements);
