export interface AnalyticsState {
    selectedGroupId: string | null;
    analytics: TaskAnalytics | null;
    leaderboard: LeaderboardData | null;
    insights: string | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface TaskAnalytics {
    metrics: {
      total_tasks: number;
      completed: number;
      completion_rate: number;
      overdue: number;
      health_score: number;
    };
    timestamp: string;
  }
  
  export interface LeaderboardData {
    user_id: string;
    score: number;
    tasks_completed: number;
    total_tasks: number;
    on_time_completion: number;
}