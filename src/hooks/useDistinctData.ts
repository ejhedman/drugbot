import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';

export interface DistinctDataParams {
  tableName: string;
  columnList: string[];
  filters?: Record<string, any>;
  orderBy?: string;
}

export interface DistinctData {
  data: Record<string, any>[];
  columns: Array<{
    key: string;
    displayName: string;
    fieldName: string;
  }>;
  totalRows: number;
  offset: number;
  limit: number;
}

export interface RequestQueue {
  clear(): void;
  add<T>(request: () => Promise<T>): Promise<T>;
}

class RequestQueueImpl implements RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;

  clear() {
    this.queue = [];
  }

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
      }
    }
    this.processing = false;
  }
}

export function useDistinctData(
  params: DistinctDataParams | null, 
  pageSize: number = 1000
) {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const lastParamsRef = useRef<DistinctDataParams | null>(null);
  
  // Request queue for serializing fetches
  const requestQueue = useRef<RequestQueue>(new RequestQueueImpl());
  
  // Track the last fetch parameters to prevent duplicates
  const lastFetchParamsRef = useRef<string>('');

  // Reset data when params change
  useEffect(() => {
    setData([]);
    setColumns([]);
    setTotalRows(0);
    setOffset(0);
    setHasMore(true);
    lastParamsRef.current = params;
    requestQueue.current.clear();
    lastFetchParamsRef.current = '';
  }, [params]);

  const fetchPage = useCallback(async (pageOffset: number) => {
    if (!params) return;
    
    // Create a unique identifier for this request
    const requestParams = JSON.stringify({
      ...params,
      offset: pageOffset,
      limit: pageSize
    });

    // Check if this is the same request as the last one
    if (requestParams === lastFetchParamsRef.current) {
      console.log('Skipping duplicate request');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/reports/distinct-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          offset: pageOffset,
          limit: pageSize
        })
      });
      
      if (response.ok) {
        const result: DistinctData = await response.json();
        setColumns(result.columns || []);
        setTotalRows(result.totalRows || 0);
        setOffset(result.offset + result.data.length);
        setHasMore(result.offset + result.data.length < result.totalRows);
        
        // Only append if this is a true next page, not a filter change or reset
        if (pageOffset === 0) {
          setData(result.data || []);
        } else {
          // Prevent appending if the params have changed
          if (lastParamsRef.current === params) {
            setData(prev => [...prev, ...(result.data || [])]);
          } else {
            setData(result.data || []);
          }
        }
        
        // Update last fetch params
        lastFetchParamsRef.current = requestParams;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch distinct data');
      }
    } catch (error) {
      console.error('Error fetching distinct data:', error);
      setError('Failed to fetch distinct data');
    } finally {
      setIsLoading(false);
    }
  }, [params, pageSize]);

  // Initial load or when params change
  useEffect(() => {
    if (params) {
      fetchPage(0);
    }
  }, [fetchPage, params]);

  // Create a debounced version of fetchPage for infinite scrolling
  const debouncedFetchPage = useDebounce(fetchPage, 150);

  // Fetch next page (debounced)
  const fetchMore = useCallback(() => {
    if (!isLoading && hasMore && params && lastParamsRef.current === params) {
      debouncedFetchPage(offset);
    }
  }, [isLoading, hasMore, params, debouncedFetchPage, offset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      requestQueue.current.clear();
    };
  }, []);

  return {
    data,
    columns,
    totalRows,
    isLoading,
    error,
    hasMore,
    fetchMore,
    refetch: () => fetchPage(0)
  };
} 