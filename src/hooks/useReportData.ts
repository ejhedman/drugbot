import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ReportDefinition } from './useReports';
import { useDebounce } from './useDebounce';

export interface ReportData {
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

// Request queue for serializing data fetches
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private lastRequestParams: string | null = null;

  async add<T>(requestFn: () => Promise<T>, requestParams: string): Promise<T> {
    // If this is the same request as the last one, return the existing promise
    if (requestParams === this.lastRequestParams && this.queue.length > 0) {
      return new Promise<T>((resolve, reject) => {
        // Find the existing request in the queue and chain to it
        const existingRequest = this.queue.find(item => {
          // This is a simplified check - in practice, we'd need to store the request params with each queued item
          return true; // For now, we'll just return the first pending request
        });
        if (existingRequest) {
          existingRequest().then(resolve).catch(reject);
        } else {
          reject(new Error('Duplicate request not found in queue'));
        }
      });
    }

    return new Promise<T>((resolve, reject) => {
      const wrappedRequest = async () => {
        try {
          this.lastRequestParams = requestParams;
          const result = await requestFn();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      };

      this.queue.push(wrappedRequest);
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Request failed:', error);
        }
      }
    }

    this.isProcessing = false;
  }

  clear() {
    this.queue = [];
    this.isProcessing = false;
    this.lastRequestParams = null;
  }
}

export function useReportData(reportDefinition: ReportDefinition | null, pageSize: number = 1000) {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const lastReportDefRef = useRef<ReportDefinition | null>(null);
  
  // Request queue for serializing fetches
  const requestQueue = useRef<RequestQueue>(new RequestQueue());
  
  // Track the last fetch parameters to prevent duplicates
  const lastFetchParamsRef = useRef<string>('');

  // Reset data when reportDefinition changes
  useEffect(() => {
    setData([]);
    setColumns([]);
    setTotalRows(0);
    setOffset(0);
    setHasMore(true);
    lastReportDefRef.current = reportDefinition;
    requestQueue.current.clear();
    lastFetchParamsRef.current = '';
  }, [reportDefinition]);

  const fetchPage = useCallback(async (pageOffset: number) => {
    if (!reportDefinition) return;
    
    // Create a unique identifier for this request
    const requestParams = JSON.stringify({
      reportDefinition: reportDefinition,
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
      
      const response = await fetch('/api/reports/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportDefinition, offset: pageOffset, limit: pageSize })
      });
      
      if (response.ok) {
        const result = await response.json();
        setColumns(result.columns || []);
        setTotalRows(result.totalRows || 0);
        setOffset(result.offset + result.data.length);
        setHasMore(result.offset + result.data.length < result.totalRows);
        
        // Only append if this is a true next page, not a filter change or reset
        if (pageOffset === 0) {
          setData(result.data || []);
        } else {
          // Prevent appending if the reportDefinition has changed
          if (lastReportDefRef.current === reportDefinition) {
            setData(prev => [...prev, ...(result.data || [])]);
          } else {
            setData(result.data || []);
          }
        }
        
        // Update last fetch params
        lastFetchParamsRef.current = requestParams;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch report data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to fetch report data');
    } finally {
      setIsLoading(false);
    }
  }, [reportDefinition, pageSize]);

  // Initial load or when reportDefinition changes
  useEffect(() => {
    if (reportDefinition) {
      fetchPage(0);
    }
  }, [fetchPage, reportDefinition]);

  // Create a debounced version of fetchPage for infinite scrolling
  const debouncedFetchPage = useDebounce(fetchPage, 150);

  // Fetch next page (debounced)
  const fetchMore = useCallback(() => {
    if (!isLoading && hasMore && reportDefinition && lastReportDefRef.current === reportDefinition) {
      debouncedFetchPage(offset);
    }
  }, [isLoading, hasMore, reportDefinition, debouncedFetchPage, offset]);

  // Cleanup on unmount
  useEffect(() => {
    const queue = requestQueue.current;
    return () => {
      queue.clear();
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