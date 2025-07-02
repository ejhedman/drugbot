import React from 'react';
import { Report } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { JsonViewer } from '@/components/ui/json-viewer';
import { ReportDataTable } from './ReportDataTable';

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
    <div className="flex-1 min-h-0 h-full flex flex-col bg-white rounded-xl overflow-hidden">
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
      <div className="flex-1 min-h-0 p-4 overflow-hidden">
        {selectedReport && reportDefinition && columns.length > 0 ? (
          <ReportDataTable columns={columns} data={data} />
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