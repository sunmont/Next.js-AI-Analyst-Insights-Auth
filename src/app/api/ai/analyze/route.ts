import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: NextRequest) {
  try {
    const { metrics, query, timeRange } = await request.json();

    // Create context from metrics
    const metricsContext = metrics.map((metric: any) => 
      `${metric.type}: ${metric.value} (${metric.change > 0 ? '+' : ''}${metric.change}%)`
    ).join(', ');

    const prompt = `
      You are a data analyst. Analyze the following business metrics and answer the user's question.
      
      Current Metrics: ${metricsContext}
      Time Range: ${timeRange}
      User Question: "${query}"
      
      Provide a concise, data-driven analysis. Include:
      1. Key insights from the metrics
      2. Notable trends or patterns
      3. Actionable recommendations
      4. Any concerns or areas needing attention
      
      Keep it professional but conversational. Use specific numbers when relevant.
    `;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
      temperature: 0.7,
    //  maxTokens: 500,
    });

    return NextResponse.json({ analysis: text });
    
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}