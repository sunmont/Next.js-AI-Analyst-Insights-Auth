import { 
  AnalyticsQuery, 
  AnalyticsResponse, 
  AnalyticsQuerySchema,
  AnalyticsResponseSchema 
} from '@/types/analytics';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Generic API fetcher with error handling
async function fetcher<T>(
  endpoint: string,
  options?: RequestInit & {
    data?: unknown;
  }
): Promise<T> {
  const url = `${BASE_URL}/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  if (options?.data) {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}


// Analytics API methods
export const analyticsApi = {
  getMetrics: async (query: AnalyticsQuery): Promise<AnalyticsResponse> => {
    // Validate input with Zod
    const validatedQuery = AnalyticsQuerySchema.parse(query);
    
    const response = await fetcher<AnalyticsResponse>('/analytics', {
      method: 'POST',
      data: validatedQuery,
    });

    // Validate response with Zod
    return AnalyticsResponseSchema.parse(response);
  },

  getRealTimeMetrics: async (): Promise<AnalyticsResponse> => {
    const response = await fetcher<AnalyticsResponse>('/analytics/realtime');
    return AnalyticsResponseSchema.parse(response);
  },
};

// Mock data generator for development
export const generateMockAnalytics = (query: AnalyticsQuery): AnalyticsResponse => {
  const metrics = query.metrics.map(metric => ({
    id: metric,
    type: metric,
    value: Math.random() * 10000,
    change: (Math.random() - 0.5) * 50, // -25% to +25%
    trend: Math.random() > 0.5 ? 'up' : 'down' as const,
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.random() * 1000,
    })),
  }));

  return {
    metrics,
    summary: {
      totalRevenue: 125000,
      totalUsers: 8452,
      averageConversion: 3.2,
    },
    timeframe: {
      current: query.dateRange,
      previous: {
        from: new Date(query.dateRange.from.getTime() - 30 * 24 * 60 * 60 * 1000),
        to: new Date(query.dateRange.to.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  };
};