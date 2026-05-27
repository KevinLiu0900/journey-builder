import { useEffect, useState, useCallback } from 'react';
import ky from 'ky';

interface UseFetchOptions {
  retries?: number;
  timeout?: number;
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Custom hook for fetching data with ky client (includes retry logic and backoff)
 * @param url - The URL to fetch from
 * @param options - Configuration options for ky
 * @returns State object with data, loading, error, and retry function
 */
export function useFetch<T>(url: string, options: UseFetchOptions = {}): UseFetchState<T> {
  const { retries = 3, timeout = 10000 } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Create ky instance with retry and timeout options
        const api = ky.create({
          timeout,
          retry: {
            limit: retries,
            methods: ['get', 'put', 'head', 'delete'],
            statusCodes: [408, 413, 429, 500, 502, 503, 504],
          },
        });

        const result = await api.get(url).json<T>();
        const processedData = (result as T & { data?: T })?.data || result;

        if (!cancelled) {
          setData(processedData);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(new Error(errorMessage));
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url, retries, timeout, retryTrigger]);

  const retry = useCallback(() => {
    setRetryTrigger(prev => prev + 1);
  }, []);

  return { data, loading, error, retry };
}
