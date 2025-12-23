
export interface Vision {
  aspirational: string;
  threeYear: string;
}

export interface Tactic {
  id: string;
  description: string;
  weeks: number[]; // 1 to 12
  completedWeeks: number[]; // which weeks were done
}

export interface Goal {
  id: string;
  title: string;
  tactics: Tactic[];
}

export interface Cycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goals: Goal[];
  currentWeek: number;
  status: 'active' | 'completed';
  twelveWeekVision: string;
  finalScore?: number;
}

export interface AppState {
  cycles: Cycle[];
  activeCycleId: string;
  viewingCycleId: string; // The cycle currently being browsed in the UI
  globalVision: Vision;
  seenEncartes: string[];
}

export enum View {
  CYCLES = 'cycles',
  VISION = 'vision',
  PLAN = 'plan',
  WEEK = 'week',
  SCORE = 'score',
  PROFILE = 'profile'
}

export interface Encarte {
  id: string;
  title: string;
  content: string;
}
