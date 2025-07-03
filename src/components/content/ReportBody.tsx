import React, { useState, useMemo } from 'react';
import { Report } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { JsonViewer } from '@/components/ui/json-viewer';
import { DataTable } from '@/components/ui/data-table';
import { useReportData } from '@/hooks/useReportData';

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
  // Extract filters from report definition
  const filters = useMemo(() => {
    if (!reportDefinition?.columnList) return {};
    const filterObj: Record<string, string[]> = {};
    Object.entries(reportDefinition.columnList).forEach(([columnName, column]) => {
      const col = column as any;
      if (col.filter && Object.keys(col.filter).length > 0) {
        // Convert filter object to array of selected values
        filterObj[columnName] = Object.keys(col.filter).filter(key => col.filter[key]);
      }
    });
    return filterObj;
  }, [reportDefinition]);

  // Use the report data hook (paged)
  const { data, columns, totalRows, isLoading, error, hasMore, fetchMore } = useReportData(reportDefinition, 200);

  // Handle filter changes
  const handleFiltersChange = (newFilters: Record<string, string[]>) => {
    if (!reportDefinition) return;
    
    // Update the report definition with new filters
    const updatedColumnList = { ...reportDefinition.columnList };
    Object.entries(updatedColumnList).forEach(([columnName, column]) => {
      const col = column as any;
      if (newFilters[columnName]) {
        // Convert array of selected values to filter object
        const filterObj: Record<string, boolean> = {};
        newFilters[columnName].forEach(value => {
          filterObj[value] = true;
        });
        col.filter = filterObj;
      } else {
        col.filter = {};
      }
    });
    // Note: In a real implementation, you would want to save this back to the database
    // For now, we'll just update the local state
    console.log('Filters updated:', newFilters);
    console.log('Updated report definition:', { ...reportDefinition, columnList: updatedColumnList });
  };

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
      <div className="flex-1 min-h-0 p-4">
        {selectedReport && reportDefinition ? (
          <div className="flex-1 min-h-0">
            {error ? (
              <div className="text-center text-red-500 py-8">
                <p className="text-lg">Error loading report data</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            ) : data ? (
              <DataTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                reportDefinition={reportDefinition}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                hasMore={hasMore}
                fetchMore={fetchMore}
                totalRows={totalRows}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">No data available</p>
                <p className="text-sm mt-2">This report has no active columns or data</p>
              </div>
            )}
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