import { useState, useEffect, useMemo, useCallback } from 'react';
import { ReportDefinition } from './useReports';

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

export function useReportData(reportDefinition: ReportDefinition | null, pageSize: number = 1000) {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Reset data when reportDefinition changes
  useEffect(() => {
    setData([]);
    setColumns([]);
    setTotalRows(0);
    setOffset(0);
    setHasMore(true);
  }, [reportDefinition]);

  const fetchPage = useCallback(async (pageOffset: number) => {
    if (!reportDefinition) return;
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
        if (pageOffset === 0) {
          setData(result.data || []);
        } else {
          setData(prev => [...prev, ...(result.data || [])]);
        }
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
    if (reportDefinition) fetchPage(0);
  }, [fetchPage, reportDefinition]);

  // Fetch next page
  const fetchMore = useCallback(() => {
    if (!isLoading && hasMore && reportDefinition) {
      fetchPage(offset);
    }
  }, [isLoading, hasMore, reportDefinition, fetchPage, offset]);

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