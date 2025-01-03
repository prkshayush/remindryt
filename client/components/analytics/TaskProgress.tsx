'use client'

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosConfig';
import { useGroupAnalytics } from '@/context/AnalyticsContext';

interface AnalyticsMetrics {
  total_tasks: number;
  completed: number;
  completion_rate: number;
  overdue: number;
  health_score: number;
}

interface AnalyticsData {
  metrics: AnalyticsMetrics;
  insights: string;
  timestamp: string;
}

const TaskProgress = () => {
  const { state } = useGroupAnalytics();
  const { selectedGroupId } = state;
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedGroupId) {
      const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get<AnalyticsData>(`/api/dashboard/groups/${selectedGroupId}/analytics`);
          setAnalytics(response.data);
        } catch (error) {
          console.error('Error fetching analytics:', error);
          setAnalytics(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnalytics();
    }
  }, [selectedGroupId]);

  if (isLoading) {
    return <div className="animate-pulse text-center">Loading...</div>;
  }

  if (!analytics) {
    return <div className="text-gray-200 text-center p-2">Please select a group to view analytics</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-4 p-2">
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Total Tasks</h3>
        <p className="text-2xl">{analytics.metrics.total_tasks}</p>
      </div>
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Completed Tasks</h3>
        <p className="text-2xl">{analytics.metrics.completed}</p>
      </div>
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Completion Rate</h3>
        <p className="text-2xl">{analytics.metrics.completion_rate}%</p>
      </div>
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Overdue Tasks</h3>
        <p className="text-2xl">{analytics.metrics.overdue}</p>
      </div>
      <div className="bg-white/10 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Health Score</h3>
        <p className="text-2xl">{analytics.metrics.health_score}%</p>
      </div>
    </div>
  );
};

export default TaskProgress;