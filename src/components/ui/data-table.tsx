import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useColumnValues } from '@/hooks/useColumnValues';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import sha1 from 'crypto-js/sha1';
import encHex from 'crypto-js/enc-hex';

export interface Column {
  key: string;
  displayName: string;
  fieldName: string;
}

export interface DataTableProps {
  data: Record<string, any>[];
  columns: Column[];
  isLoading?: boolean;
  reportDefinition?: any;
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  filters?: Record<string, string[]>;
  hasMore?: boolean;
  fetchMore?: () => void;
  totalRows?: number;
}

interface FilterDropdownProps {
  column: Column;
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
  onClear: () => void;
  reportDefinition?: any;
}

function FilterDropdown({
  column,
  selectedValues,
  onFilterChange,
  onClear,
  reportDefinition
}: FilterDropdownProps) {
  const { values: availableValues, isLoading: isLoadingValues, refetch } = useColumnValues(reportDefinition, column.key, column.key, false);
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues);
  const [dropdownWidth, setDropdownWidth] = useState<number>(240);
  const [isOpen, setIsOpen] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  // Fetch values only when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSelectedValues(selectedValues);
  }, [selectedValues, isOpen]);

  // Dynamically measure the width needed for the longest value
  useEffect(() => {
    if (!availableValues.length) return;
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.style.fontSize = '14px';
    span.style.fontFamily = 'inherit';
    span.style.fontWeight = '400';
    span.style.padding = '8px';
    span.style.left = '-9999px';
    document.body.appendChild(span);
    let maxWidth = 0;
    availableValues.forEach((value) => {
      span.textContent = value;
      maxWidth = Math.max(maxWidth, span.offsetWidth);
    });
    document.body.removeChild(span);
    setDropdownWidth(Math.min(Math.max(240, maxWidth + 56), 400));
  }, [availableValues]);

  // Helper to apply filter if changed
  const applyFilterIfChanged = () => {
    const a = [...selectedValues].sort();
    const b = [...localSelectedValues].sort();
    const changed = a.length !== b.length || a.some((v, i) => v !== b[i]);
    if (changed) {
      onFilterChange(localSelectedValues);
    }
  };

  // Only apply filter when dropdown closes and selection has changed
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      applyFilterIfChanged();
    }
  };

  const handleValueToggle = (value: string) => {
    setLocalSelectedValues(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleClear = () => {
    setLocalSelectedValues([]);
  };

  const handleSelectAll = () => {
    setLocalSelectedValues(availableValues);
  };

  const handleSelectNone = () => {
    setLocalSelectedValues([]);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-gray-200"
          title="Filter column"
        >
          <Filter className={`h-3 w-3 ${selectedValues.length > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        style={{ minWidth: dropdownWidth, maxWidth: 400, padding: 0 }}
        className="!overflow-visible"
      >
        <div className="px-2 py-1.5 text-sm font-medium text-gray-700 border-b">
          <div className="flex items-center justify-between">
            <span>Filter {column.displayName}</span>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-6 px-2 ml-2"
              onClick={() => {
                applyFilterIfChanged();
                setIsOpen(false);
              }}
            >
              OK
            </Button>
          </div>
        </div>
        {isLoadingValues ? (
          <div className="px-2 py-2 text-sm text-gray-500">Loading values...</div>
        ) : availableValues.length === 0 ? (
          <div className="px-2 py-2 text-sm text-gray-500">No values available</div>
        ) : (
          <>
            <div className="px-2 py-1 flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs h-6"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectNone}
                className="text-xs h-6"
              >
                Select None
              </Button>
            </div>
            <DropdownMenuSeparator />
            <div
              ref={measureRef}
              className="max-h-60 overflow-y-auto px-1 py-1"
              style={{ minWidth: dropdownWidth - 8, maxWidth: 400 }}
            >
              {availableValues.map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
                  onClick={() => handleValueToggle(value)}
                  role="checkbox"
                  aria-checked={localSelectedValues.includes(value)}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') handleValueToggle(value); }}
                >
                  <Checkbox
                    checked={localSelectedValues.includes(value)}
                    onCheckedChange={() => handleValueToggle(value)}
                    tabIndex={-1}
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="text-sm select-none" style={{ whiteSpace: 'nowrap' }}>{value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper to compute row signature
function getRowSignature(row: Record<string, any>, columns: Column[]): string {
  const concat = columns.map(col => {
    const val = row[col.key];
    return (val === null || val === undefined || val === '') ? '-' : String(val);
  }).join('|');
  // Compute sha1 hash and return rightmost 8 hex digits
  const hash = sha1(concat).toString(encHex);
  return hash.slice(-8);
}

export function DataTable({ 
  data, 
  columns, 
  isLoading = false, 
  reportDefinition,
  onFiltersChange,
  filters = {},
  hasMore = false,
  fetchMore,
  totalRows
}: DataTableProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, string[]>>(filters);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll handler
  useEffect(() => {
    if (!fetchMore || !hasMore) return;
    const handleScroll = () => {
      const container = tableContainerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        fetchMore();
      }
    };
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchMore, hasMore]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (Object.keys(localFilters).length === 0) return data;
    
    return data.filter(row => {
      return Object.entries(localFilters).every(([columnKey, filterValues]) => {
        if (!filterValues || filterValues.length === 0) return true;
        const cellValue = row[columnKey];
        if (cellValue == null) return false;
        return filterValues.includes(String(cellValue));
      });
    });
  }, [data, localFilters]);

  // Compute all signatures for the current filteredData
  const allSignatures = useMemo(() => {
    return filteredData.map(row => getRowSignature(row, columns));
  }, [filteredData, columns]);
  // Find duplicates
  const duplicateSignatures = useMemo(() => {
    const sigCount: Record<string, number> = {};
    allSignatures.forEach(sig => { sigCount[sig] = (sigCount[sig] || 0) + 1; });
    return new Set(Object.entries(sigCount).filter(([_, count]) => count > 1).map(([sig]) => sig));
  }, [allSignatures]);

  const handleFilterChange = (columnKey: string, values: string[]) => {
    const newFilters = { ...localFilters };
    if (values.length === 0) {
      delete newFilters[columnKey];
    } else {
      newFilters[columnKey] = values;
    }
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilter = (columnKey: string) => {
    const newFilters = { ...localFilters };
    delete newFilters[columnKey];
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    onFiltersChange?.({});
  };

  const getFilterIcon = (columnKey: string) => {
    const hasFilter = localFilters[columnKey] && localFilters[columnKey].length > 0;
    return (
      <div className="flex items-center gap-1">
        <FilterDropdown
          column={columns.find(col => col.key === columnKey)!}
          selectedValues={localFilters[columnKey] || []}
          onFilterChange={(values) => handleFilterChange(columnKey, values)}
          onClear={() => clearFilter(columnKey)}
          reportDefinition={reportDefinition}
        />
        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-200"
            onClick={() => clearFilter(columnKey)}
            title="Clear filter"
          >
            <X className="h-3 w-3 text-gray-400" />
          </Button>
        )}
      </div>
    );
  };

  // Spinner component
  const Spinner = () => (
    <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin align-middle"></span>
  );

  if (isLoading && data.length === 0) {
    // Only show skeleton for initial load
    return (
      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-lg border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white rounded-lg border overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <h3 className="text-sm font-medium text-gray-900">
          {data.length} of {totalRows ?? data.length} rows
        </h3>
        <div className="flex items-center gap-2">
          {Object.keys(localFilters).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table Container with Scrollbars */}
      <div ref={tableContainerRef} className="h-[70vh] overflow-x-auto overflow-y-auto">
        <table className="w-full min-w-max text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 border-b-4 border-b-gray-400 bg-gray-200 px-2 py-2 text-left font-medium text-gray-700 min-w-[60px] sticky top-[-1px] z-10" style={{ background: 'inherit' }}>
                #
              </th>
              <th className="border border-gray-200 border-b-4 border-b-gray-400 bg-gray-200 px-2 py-2 text-left font-medium text-gray-700 min-w-[100px] sticky top-[-1px] z-10" style={{ background: 'inherit' }}>
                Sig
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border border-gray-200 border-b-4 border-b-gray-400 bg-gray-200 px-2 py-2 text-left font-medium text-gray-700 min-w-[120px] sticky top-[-1px] z-10"
                  style={{ background: 'inherit' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{column.displayName}</span>
                    {getFilterIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                  {Object.keys(localFilters).length > 0 ? 'No data matches the current filters.' : 'No data available.'}
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-1 text-gray-500 text-right font-mono">{rowIndex + 1}</td>
                  <td className={
                    `border border-gray-200 px-2 py-1 text-right font-mono ${duplicateSignatures.has(getRowSignature(row, columns)) ? 'bg-red-100 text-red-700 font-bold' : 'text-gray-500'}`
                  }>
                    {getRowSignature(row, columns)}
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="border border-gray-200 px-2 py-1 text-gray-900">
                      <div className="truncate" title={String(row[column.key] ?? '')}>
                        {row[column.key] ?? ''}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
            {/* Infinite scroll loading indicator */}
            {hasMore && isLoading && data.length > 0 && (
              <tr>
                <td colSpan={columns.length} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                  <Spinner /> Loading more rows...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 