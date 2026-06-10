export interface DailyChallenge {
    challengeId: number;
    title: string;
    description: string;
    points: number;
    carbonSaved: number;
    completed: boolean;
  }
  
  export interface ChallengeHistory {
    challengeId: number;
    title: string;
    completed: boolean;
    completedAt?: string;
  }