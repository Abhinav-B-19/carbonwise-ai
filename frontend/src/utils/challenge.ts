export function getCategoryIcon(category: string): string {
  switch (category?.toLowerCase()) {
    case "transport":
      return "🚲";

    case "food":
      return "🥗";

    case "energy":
      return "⚡";

    case "lifestyle":
      return "🌿";

    default:
      return "🌱";
  }
}
