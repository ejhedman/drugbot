import React from 'react';
import { Report } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { JsonViewer } from '@/components/ui/json-viewer';

interface ReportBodyProps {
  selectedReport: Report | null;
  reportDefinition: any;
  isJsonViewerOpen: boolean;
  setIsJsonViewerOpen: (open: boolean) => void;
}

export function ReportBody({
  selectedReport,
  reportDefinition,
  isJsonViewerOpen,
  setIsJsonViewerOpen
}: ReportBodyProps) {
  // Derive columns from reportDefinition
  const columns = React.useMemo(() => {
    if (!reportDefinition || !reportDefinition.columnList) return [];
    return Object.entries(reportDefinition.columnList)
      .filter(([_, col]) => (col as any).isActive)
      .sort(([, a], [, b]) => ((a as any).ordinal ?? 0) - ((b as any).ordinal ?? 0))
      .map(([key, col]) => ({ key, label: (col as any).displayName || key }));
  }, [reportDefinition]);

  // Generate 50 rows of fake data
  const data = React.useMemo(() => {
    if (columns.length === 0) return [];
    return Array.from({ length: 50 }).map((_, i) => {
      const row: Record<string, any> = {};
      columns.forEach((col, idx) => {
        row[col.key] = `${col.label} ${i + 1}`;
      });
      return row;
    });
  }, [columns]);

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col bg-white rounded-xl overflow-hidden border-6 border-red-700">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-100 rounded-t-xl min-h-[64px]">
        <h3 className="text-lg font-semibold text-gray-900">Report Data</h3>
        {selectedReport && (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsJsonViewerOpen(true)}
              className="flex items-center space-x-2 rounded-xl"
              title="View Report Configuration"
            >
              <Settings className="h-4 w-4" />
              <span>View Config</span>
            </Button>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex-1 min-h-0 p-4 border-6 border-blue-800">
        {selectedReport && reportDefinition && columns.length > 0 ? (
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
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                        No data available.
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
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">Select a report to view data</p>
            <p className="text-sm mt-2">Choose a report from the list to see its configuration and data</p>
          </div>
        )}
        {/* JSON Viewer Dialog */}
        <Dialog open={isJsonViewerOpen} onOpenChange={setIsJsonViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Report Configuration JSON</DialogTitle>
              <DialogDescription>
                View and copy the JSON configuration for this report.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-auto max-h-[60vh]">
              {reportDefinition ? (
                <JsonViewer
                  data={reportDefinition}
                  title="Report Definition"
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No configuration data available for this report.</p>
                  <p className="text-sm mt-2">Try selecting a report type and configuring columns first.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 