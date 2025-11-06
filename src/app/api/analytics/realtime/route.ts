import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Set up Server-Sent Events
  const encoder = new TextEncoder();
  
  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial data
      const initialData = {
        type: 'initial',
        data: generateRealTimeMetrics()
      };
      
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
      );

      // Send updates every 2 seconds
      const interval = setInterval(() => {
        const update = {
          type: 'update',
          data: generateRealTimeMetrics(),
          timestamp: new Date().toISOString()
        };
        
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(update)}\n\n`)
        );
      }, 2000);

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function generateRealTimeMetrics() {
  const now = new Date();
  const metrics = ['revenue', 'users', 'sessions', 'conversion'] as const;
  
  return metrics.map(metric => ({
    id: metric,
    type: metric,
    value: Math.floor(Math.random() * 10000) + 1000,
    change: (Math.random() - 0.5) * 20, // -10% to +10%
    trend: Math.random() > 0.5 ? 'up' : 'down' as const,
    data: Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(now.getTime() - (19 - i) * 2000).toISOString(),
      value: Math.floor(Math.random() * 1000) + 500,
    })),
  }));
}