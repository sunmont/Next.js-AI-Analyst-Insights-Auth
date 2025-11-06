'use client';

import { useState, useEffect } from 'react';
import { MetricData } from '@/types/analytics';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';

interface AIInsightsProps {
  metrics: MetricData[];
  timeRange: string;
}

export function AIInsights({ metrics, timeRange }: AIInsightsProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: "Generate 3-4 key insights from these metrics. Focus on the most important trends and patterns.",
          metrics,
          timeRange,
        }),
      });

      const data = await response.json();
      
      // Parse the response into individual insights
      const insightLines = data.analysis
        .split('\n')
        .filter((line: string) => line.trim().length > 0 && /^[•\-\d]/.test(line.trim()))
        .map((line: string) => line.replace(/^[•\-\d\.]\s*/, '').trim());

      setInsights(insightLines.length > 0 ? insightLines : [data.analysis]);
    } catch (error) {
      console.error('AI insights error:', error);
      setInsights(['Unable to generate insights at this time. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (metrics.length > 0) {
      generateInsights();
    }
  }, [metrics, timeRange]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI-Generated Insights</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateInsights}
          disabled={isLoading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Regenerate
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <div className="h-4 bg-blue-200 rounded animate-pulse flex-1"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-blue-600 text-center">
          Powered by AI • Insights update with your data
        </p>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}