import { useState, useEffect, useMemo } from 'react';
import { ReportDefinition } from './useReports';

// Simple cache to prevent refetching the same data
const valueCache = new Map<string, string[]>();

export function useColumnValues(reportDefinition: ReportDefinition | null, columnName: string | null) {
  const [values, setValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create stable dependencies to prevent unnecessary refetches
  const tableName = useMemo(() => reportDefinition?.tableName || 'generic_drugs_wide_view', [reportDefinition?.tableName]);
  const reportType = useMemo(() => reportDefinition?.reportType, [reportDefinition?.reportType]);
  
  // Create cache key
  const cacheKey = useMemo(() => {
    if (!tableName || !columnName) return null;
    return `${tableName}:${columnName}`;
  }, [tableName, columnName]);

  const fetchColumnValues = async () => {
    if (!reportDefinition || !columnName || !cacheKey) {
      setValues([]);
      return;
    }

    // Check cache first
    if (valueCache.has(cacheKey)) {
      setValues(valueCache.get(cacheKey)!);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/reports/data-values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportDefinition, columnName })
      });

      if (response.ok) {
        const result = await response.json();
        const fetchedValues = result.values || [];
        setValues(fetchedValues);
        // Cache the result
        valueCache.set(cacheKey, fetchedValues);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch column values');
      }
    } catch (error) {
      console.error('Error fetching column values:', error);
      setError('Failed to fetch column values');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColumnValues();
  }, [tableName, reportType, columnName]);

  return {
    values,
    isLoading,
    error,
    refetch: fetchColumnValues
  };
} 