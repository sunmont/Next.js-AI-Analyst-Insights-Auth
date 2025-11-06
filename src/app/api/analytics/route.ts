import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsQuerySchema } from '@/types/analytics';
import { generateMockAnalytics } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate incoming request with Zod
    const validatedData = AnalyticsQuerySchema.parse(body);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you'd fetch from your database/analytics service
    const analyticsData = generateMockAnalytics(validatedData);
    
    return NextResponse.json(analyticsData);
    
  } catch (error) {
    console.error('Analytics API error:', error);
    
    return NextResponse.json(
      { error: 'Invalid analytics query', details: error },
      { status: 400 }
    );
  }
}

export async function GET() {
  // Default real-time endpoint
  const defaultQuery = {
    dateRange: {
      from: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      to: new Date(),
    },
    metrics: ['revenue', 'users', 'sessions'] as const,
  };

  const realTimeData = generateMockAnalytics(defaultQuery);
  
  return NextResponse.json(realTimeData);
}