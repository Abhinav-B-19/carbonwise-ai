export interface Goal {
  id: number;
  goalType: string;
  targetValue: number;
  currentValue: number;
  status: string;
  createdAt?: string;
}

export interface GoalTarget {
  id: number;
  goalType: string;
  targetReductionPercentage: number;
  targetDate: string;
  status: string;
}
