import React, { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface Column {
  key: string;
  displayName: string;
  fieldName: string;
}

export interface DataTableProps {
  data: Record<string, any>[];
  columns: Column[];
  isLoading?: boolean;
}

export function DataTable({ data, columns, isLoading = false }: DataTableProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filterDialogOpen, setFilterDialogOpen] = useState<string | null>(null);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return data;
    
    return data.filter(row => {
      return Object.entries(filters).every(([columnKey, filterValue]) => {
        if (!filterValue.trim()) return true;
        const cellValue = row[columnKey];
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [data, filters]);

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  const clearFilter = (columnKey: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const getFilterIcon = (columnKey: string) => {
    const hasFilter = filters[columnKey] && filters[columnKey].trim() !== '';
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-gray-200"
          onClick={() => setFilterDialogOpen(columnKey)}
          title="Filter column"
        >
          <Filter className={`h-3 w-3 ${hasFilter ? 'text-blue-600' : 'text-gray-400'}`} />
        </Button>
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

  if (isLoading) {
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
          {filteredData.length} of {data.length} rows
        </h3>
        <div className="flex items-center gap-2">
          {Object.keys(filters).length > 0 && (
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
      <div className="flex-1 min-h-0 max-h-[60vh] overflow-x-auto overflow-y-auto">
        <table className="w-full min-w-max text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border border-gray-200 bg-gray-50 px-2 py-2 text-left font-medium text-gray-700 min-w-[120px] sticky top-0 z-10"
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
                <td colSpan={columns.length} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                  {Object.keys(filters).length > 0 ? 'No data matches the current filters.' : 'No data available.'}
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
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
          </tbody>
        </table>
      </div>

      {/* Filter Dialogs */}
      {columns.map((column) => (
        <Dialog
          key={column.key}
          open={filterDialogOpen === column.key}
          onOpenChange={(open) => setFilterDialogOpen(open ? column.key : null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Filter {column.displayName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Filter value
                </label>
                <Input
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  placeholder={`Filter ${column.displayName}...`}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => clearFilter(column.key)}
                >
                  Clear
                </Button>
                <Button
                  onClick={() => setFilterDialogOpen(null)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
} 