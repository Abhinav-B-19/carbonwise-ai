export interface DashboardResponse {
    latestEmission: number;
    latestScore: number;
    goalProgress: number;
    completedChallenges: number;
  }
  
  export interface CarbonHistoryItem {
    createdAt: string;
    totalEmission: number;
    carbonScore: number;
  }