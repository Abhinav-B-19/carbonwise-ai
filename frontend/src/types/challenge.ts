export interface DailyChallenge {
  challengeId: number;
  title: string;
  description?: string;
  category?: string;
  points?: number;
  carbonSaved?: number;
  completed?: boolean;
}

export interface ChallengeHistory {
  challengeId?: number;
  title: string;
  points?: number;
  completed?: boolean;
  completedAt?: string;
}

export interface ChallengeMissions {
  daily: DailyChallenge[];
  weekly: DailyChallenge[];
  monthly: DailyChallenge[];
}
