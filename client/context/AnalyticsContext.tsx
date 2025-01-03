'use client'

import { createContext, useContext, useState, ReactNode } from 'react';
import axiosInstance from '@/lib/axiosConfig';
import { AnalyticsState } from '@/types/analytics';

const GroupAnalyticsContext = createContext<{
  state: AnalyticsState;
  setSelectedGroup: (groupId: string) => void;
} | undefined>(undefined);

export function GroupAnalyticsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalyticsState>({
    selectedGroupId: null,
    analytics: null,
    leaderboard: null,
    insights: null,
    isLoading: false,
    error: null
  });

  const setSelectedGroup = async (groupId: string) => {
    try {
      setState(prev => ({ ...prev, selectedGroupId: groupId, isLoading: true }));

      const [analyticsData] = await Promise.all([
        axiosInstance.get(`/api/dashboard/groups/${groupId}/analytics`),
      ]);

      setState(prev => ({
        ...prev,
        analytics: analyticsData.data,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : 'An error occurred' }));
    }
  };

  return (
    <GroupAnalyticsContext.Provider value={{ state, setSelectedGroup }}>
      {children}
    </GroupAnalyticsContext.Provider>
  );
}

export function useGroupAnalytics() {
  const context = useContext(GroupAnalyticsContext);
  if (context === undefined) {
    throw new Error('useGroupAnalytics must be used within a GroupAnalyticsProvider');
  }
  return context;
}