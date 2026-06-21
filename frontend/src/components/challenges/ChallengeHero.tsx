interface Props {
  title?: string;
  description?: string;
}

export default function ChallengeHero({
  title = "Sustainability Challenges",
  description = "Complete eco-friendly actions, earn rewards, and improve your sustainability score through engaging sustainability challenges.",
}: Props) {
  return (
    <div
      className="
        bg-gradient-to-r
        from-emerald-600
        via-green-600
        to-teal-600
        rounded-3xl
        p-8
        mb-8
        shadow-[0_20px_60px_rgba(5,150,105,0.25)]
      "
    >
      <div
        className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-white/15
          border
          border-white/20
          backdrop-blur-sm
          mb-5
        "
      >
        <span
          style={{
            color: "#ffffff",
          }}
          className="text-sm font-medium"
        >
          🏆 Sustainability Challenges
        </span>
      </div>

      <h1
        style={{
          color: "#ffffff",
        }}
        className="
          text-5xl
          font-bold
          leading-tight
        "
      >
        {title}
      </h1>

      <p
        style={{
          color: "rgba(255,255,255,0.9)",
        }}
        className="
          mt-4
          text-lg
          max-w-2xl
          leading-relaxed
        "
      >
        {description}
      </p>
    </div>
  );
}
