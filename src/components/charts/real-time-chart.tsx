'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricData } from '@/types/analytics';
import { useState, useEffect } from 'react';

interface RealTimeChartProps {
  data: MetricData[];
  height?: number;
}

export function RealTimeChart({ data, height = 300 }: RealTimeChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      // Transform data for Recharts
      const metric = data[0]; // Show first metric
      const transformedData = metric.data.map(point => ({
        timestamp: new Date(point.timestamp).toLocaleTimeString(),
        value: point.value,
        fullTime: point.timestamp,
      }));

      setChartData(transformedData);
    }
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-gray-600">{label}</p>
          <p className="text-blue-600 font-semibold">
            Value: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Waiting for real-time data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Real-Time Metrics</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            chartData.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`} />
          <span className="text-sm text-gray-600">
            {chartData.length > 0 ? 'Live' : 'Connecting...'}
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="timestamp"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Updates every 2 seconds • {chartData.length} data points
      </div>
    </div>
  );
}