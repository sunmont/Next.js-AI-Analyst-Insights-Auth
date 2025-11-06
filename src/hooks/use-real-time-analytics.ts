'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MetricData } from '@/types/analytics';

interface RealTimeEvent {
  type: 'initial' | 'update';
  data: MetricData[];
  timestamp?: string;
}

export function useRealTimeAnalytics() {
  const [data, setData] = useState<MetricData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      return;
    }

    const eventSource = new EventSource('/api/analytics/realtime');
    
    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('Real-time connection established');
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedEvent: RealTimeEvent = JSON.parse(event.data);
        
        if (parsedEvent.type === 'initial' || parsedEvent.type === 'update') {
          setData(parsedEvent.data);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error parsing real-time event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Real-time connection error:', error);
      setIsConnected(false);
      eventSource.close();
      eventSourceRef.current = null;

      // Attempt reconnect after 3 seconds
      setTimeout(() => {
        connect();
      }, 3000);
    };

    eventSourceRef.current = eventSource;
  }, []);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    data,
    isConnected,
    lastUpdate,
    reconnect: connect,
    disconnect,
  };
}