import { useQuery, useMutation } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { AnalyticsQuery, AnalyticsResponse } from '@/types/analytics';

export function useAnalytics(query: AnalyticsQuery) {
  return useQuery({
    queryKey: ['analytics', query],
    queryFn: () => analyticsApi.getMetrics(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRealTimeAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'realtime'],
    queryFn: () => analyticsApi.getRealTimeMetrics(),
    refetchInterval: 30000, // 30 seconds
    staleTime: 0, // Always stale to force refetch
  });
}

export function useAnalyticsMutation() {
  return useMutation({
    mutationFn: analyticsApi.getMetrics,
    onSuccess: (data) => {
      // You could update cache here if needed
      console.log('Analytics data fetched:', data);
    },
    onError: (error) => {
      console.error('Analytics fetch error:', error);
    },
  });
}