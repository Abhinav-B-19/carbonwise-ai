export function getLevel(score: number) {
  if (score >= 80) return "Eco Champion";
  if (score >= 60) return "Green Explorer";
  if (score >= 40) return "Eco Starter";

  return "Getting Started";
}

export function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-lime-600";
  if (score >= 40) return "text-amber-600";

  return "text-rose-600";
}
