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

const Insights = () => {
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
    return <div className="text-gray-200 text-center p-2">Please select a group to view AI insights.</div>;
  }

  return (
    <div className="">
      <div className="p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Insights</h3>
        <p className="text-xl">{analytics.insights}</p>
      </div>
    </div>
  );
};

export default Insights;