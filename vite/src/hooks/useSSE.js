// hooks/useSSE.js
import { useEffect, useState, useRef } from 'react';

export function useSSE(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    let reconnectTimeout;
    
    const connect = () => {
      console.log(`[SSE] Connecting to ${url}`);
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => {
        console.log('[SSE] Connection opened');
        setIsConnected(true);
        setError(null);
      };

      es.onmessage = (event) => {
        console.log('[SSE] Message received:', event.data);
        try {
          const parsed = JSON.parse(event.data);
          setData(parsed);
        } catch (err) {
          console.error('[SSE] Parse error:', err);
        }
      };

      es.onerror = (err) => {
        console.error('[SSE] Error:', err);
        setIsConnected(false);
        setError('Connection lost');
        es.close();
        
        // Auto reconnect after 3 seconds
        reconnectTimeout = setTimeout(() => {
          console.log('[SSE] Attempting reconnect...');
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log('[SSE] Connection closed');
      }
    };
  }, [url]);

  return { data, error, isConnected };
}