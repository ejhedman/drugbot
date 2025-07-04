import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ReportDefinition } from './useReports';

// Simple cache to prevent refetching the same data
const valueCache = new Map<string, string[]>();

export function useColumnValues(
  reportDefinition: ReportDefinition | null, 
  columnName: string | null,
  excludeColumn: string | null = null,
  fetchOnMount: boolean = false
) {
  const [values, setValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shouldFetch = useRef(fetchOnMount);

  // Create stable dependencies to prevent unnecessary refetches
  const tableName = useMemo(() => reportDefinition?.tableName || 'generic_drugs_wide_view', [reportDefinition?.tableName]);
  const reportType = useMemo(() => reportDefinition?.reportType, [reportDefinition?.reportType]);
  
  // Extract current filters for cache key
  const currentFilters = useMemo(() => {
    if (!reportDefinition?.columnList) return {};
    const filterObj: Record<string, string[]> = {};
    Object.entries(reportDefinition.columnList).forEach(([colName, column]) => {
      const col = column as any;
      if (colName !== excludeColumn && col.filter && Object.keys(col.filter).length > 0) {
        // Convert filter object to array of selected values
        const selectedValues = Object.keys(col.filter).filter(key => col.filter[key]);
        if (selectedValues.length > 0) {
          filterObj[colName] = selectedValues.sort();
        }
      }
    });
    return filterObj;
  }, [reportDefinition?.columnList, excludeColumn]);
  
  // Create cache key that includes filters
  const cacheKey = useMemo(() => {
    if (!tableName || !columnName) return null;
    const filterString = JSON.stringify(currentFilters);
    return `${tableName}:${columnName}:${filterString}`;
  }, [tableName, columnName, currentFilters]);

  const fetchColumnValues = useCallback(async () => {
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
        body: JSON.stringify({ 
          reportDefinition, 
          columnName,
          excludeColumn 
        })
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
  }, [reportDefinition, columnName, excludeColumn, cacheKey]);

  useEffect(() => {
    if (shouldFetch.current) {
      fetchColumnValues();
    }
    shouldFetch.current = fetchOnMount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName, reportType, columnName, currentFilters]);

  return {
    values,
    isLoading,
    error,
    refetch: fetchColumnValues
  };
} 