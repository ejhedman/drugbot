import { useState, useEffect } from 'react';
import { ReportDefinition } from './useReports';

export interface ReportData {
  data: Record<string, any>[];
  columns: Array<{
    key: string;
    displayName: string;
    fieldName: string;
  }>;
  totalRows: number;
}

export function useReportData(reportDefinition: ReportDefinition | null) {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = async () => {
    if (!reportDefinition) {
      setData(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/reports/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportDefinition })
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
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
  };

  useEffect(() => {
    fetchReportData();
  }, [reportDefinition]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchReportData
  };
} 