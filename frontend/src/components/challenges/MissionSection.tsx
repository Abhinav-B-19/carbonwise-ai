import { DailyChallenge } from "@/types/challenge";
import { getCategoryIcon } from "@/utils/challenge";

interface Props {
  title: string;
  missions: DailyChallenge[];
  variant: "green" | "orange" | "purple";
}

export default function MissionSection({ title, missions, variant }: Props) {
  const variants = {
    green: {
      card: "bg-white border border-slate-200 shadow-sm hover:shadow-md",
      badge: "bg-green-100 text-green-700",
    },
    orange: {
      card: "bg-orange-50 border border-orange-200",
      badge: "bg-orange-100 text-orange-700",
    },
    purple: {
      card: "bg-purple-50 border border-purple-200",
      badge: "bg-purple-100 text-purple-700",
    },
  };

  const styles = variants[variant];

  if (missions.length === 0) {
    return (
      <div className="mt-10">
        <h2
          className="
            text-2xl
            font-bold
            mb-5
          "
        >
          {title}
        </h2>

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-8
            text-center
            text-slate-500
          "
        >
          No missions available.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2
        className="
          text-2xl
          font-bold
          mb-5
        "
      >
        {title}
      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >
        {missions.map((mission) => (
          <div key={mission.challengeId}>
            <span>{getCategoryIcon(mission.category ?? "")}</span>

            <span>{mission.category ?? "Mission"}</span>

            <h3>{mission.title}</h3>

            <p>{mission.description ?? ""}</p>

            <span>🏆 {mission.points ?? 0}</span>

            <span>🌍 {mission.carbonSaved ?? 0}kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}
