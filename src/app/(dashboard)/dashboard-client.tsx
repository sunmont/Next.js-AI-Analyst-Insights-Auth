'use client';

import { useAnalytics } from '@/hooks/use-analytics';
import { useRealTimeAnalytics } from '@/hooks/use-real-time-analytics';
import { AnalyticsResponse, AnalyticsQuery, DateRange } from '@/types/analytics';
import { MetricCard } from '@/components/metrics/metric-card';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/date-range-picker';
import { User, LogOut, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { redirect } from 'next/navigation';
import { RealTimeChart } from '@/components/charts/real-time-chart';
import { AIAnalystChat } from '@/components/ai/ai-analyst-chat';
import { AIInsights } from '@/components/ai/ai-insights';

interface DashboardClientProps {
  initialData: AnalyticsResponse;
}

const defaultQuery: AnalyticsQuery = {
  dateRange: {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  },
  metrics: ['revenue', 'users', 'sessions', 'conversion'],
};

export function DashboardClient({ initialData }: DashboardClientProps) {
  const { data: session } = useSession();
  const [query, setQuery] = useState<AnalyticsQuery>(defaultQuery);
  const [activeTab, setActiveTab] = useState<'historical' | 'realtime'>('historical');
  
  const { data, isLoading, error } = useAnalytics(query);
  const { data: realTimeData, isConnected, lastUpdate, reconnect } = useRealTimeAnalytics();

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    if (dateRange?.from && dateRange.to) {
      setQuery(prev => ({ ...prev, dateRange }));
    }
  };

  // Use server data initially, then client data
  const displayData = data || initialData;
  const timeRangeString = `${query.dateRange.from.toLocaleDateString()} - ${query.dateRange.to.toLocaleDateString()}`;

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error loading analytics</h2>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  if (!session)
  {
   // redirect('/auth/signin');
  }

  return (
     <div className="min-h-screen bg-gray-50">
      {/* Header with Auth */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Real-time business intelligence</p>
            </div>
            
            <div className="flex items-center gap-4">
              {session && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {session.user?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

        {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex justify-between items-center">
          <DateRangePicker
            value={query.dateRange}
            onChange={handleDateRangeChange}
          />
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {activeTab === 'realtime' && (
                <>
                  {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'Live' : 'Disconnected'}
                  </span>
                  {!isConnected && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={reconnect}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reconnect
                    </Button>
                  )}
                </>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'historical'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Historical Analytics
          </button>
          <button
            onClick={() => setActiveTab('realtime')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'realtime'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Real-Time Dashboard
          </button>
        </div>

        {activeTab === 'historical' ? (
          /* Historical Analytics View */
          <>
            {/* AI Insights */}
            <AIInsights 
              metrics={displayData.metrics} 
              timeRange={timeRangeString}
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayData.metrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  isLoading={isLoading}
                />
              ))}
            </div>

            {/* AI Chat & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AIAnalystChat 
                  metrics={displayData.metrics}
                  timeRange={timeRangeString}
                />
              </div>
              
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-bold">
                      ${displayData.summary.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Total Users</h3>
                    <p className="text-2xl font-bold">
                      {displayData.summary.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Avg Conversion</h3>
                    <p className="text-2xl font-bold">
                      {displayData.summary.averageConversion}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Real-Time View */
          <>
            {/* Real-Time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {realTimeData.map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  isLoading={!isConnected}
                />
              ))}
            </div>

            {/* Real-Time Chart */}
            <RealTimeChart data={realTimeData} height={400} />

            {/* Real-Time Status */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Real-Time Connection</h3>
                  <p className="text-sm text-gray-600">
                    {isConnected 
                      ? 'Connected to live data stream' 
                      : 'Attempting to connect...'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last update</p>
                  <p className="font-mono text-sm">
                    {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Environment Notice */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Development Mode
            </h3>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>• Real-time data is simulated with random values</p>
              <p>• AI features require OpenAI API key configuration</p>
              <p>• Configure environment variables for production</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}