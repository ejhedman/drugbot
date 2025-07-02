import React from 'react';

interface ReportDataTableProps {
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
  loading?: boolean;
  emptyMessage?: string;
}

export function ReportDataTable({ columns, data, loading = false, emptyMessage = 'No data available.' }: ReportDataTableProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 border-l border-r border-b rounded-b-lg overflow-hidden">
        <div className="h-full max-h-128 overflow-x-auto overflow-y-auto scrollbar-always-visible">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-1 bg-slate-600 text-left font-semibold text-white border-r border-gray-400">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 border-b last:border-b-0">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-1 text-gray-900 text-left border-r border-gray-200">
                        {row[col.key] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 