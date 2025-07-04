import React, { useState, useMemo, useEffect } from 'react';
import { Report } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Settings, Download, Code } from 'lucide-react';
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

// Helper to convert array of objects to CSV
function arrayToCSV(data: any[], columns: any[]): string {
  if (!data.length) return '';
  const header = columns.map((col: any) => '"' + (col.displayName || col.key) + '"').join(',');
  const rows = data.map(row =>
    columns.map((col: any) => {
      const val = row[col.key];
      if (val == null) return '';
      return '"' + String(val).replace(/"/g, '""') + '"';
    }).join(',')
  );
  return [header, ...rows].join('\n');
}

async function fetchAllReportData(reportDefinition: any, pageSize = 1000, onProgress?: (loaded: number, total: number) => void) {
  let allRows: any[] = [];
  let offset = 0;
  let totalRows = 0;
  let columns: any[] = [];
  while (true) {
    const response = await fetch('/api/reports/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportDefinition, offset, limit: pageSize })
    });
    if (!response.ok) throw new Error('Failed to fetch report data');
    const result = await response.json();
    if (!columns.length) columns = result.columns;
    if (!totalRows) totalRows = result.totalRows;
    allRows = allRows.concat(result.data || []);
    if (onProgress) onProgress(allRows.length, totalRows);
    if (allRows.length >= totalRows || !result.data || result.data.length < pageSize) break;
    offset += pageSize;
  }
  return { allRows, columns };
}

export function ReportBody({
  selectedReport,
  reportDefinition,
  isJsonViewerOpen,
  setIsJsonViewerOpen
}: ReportBodyProps) {
  // Local state for report definition with filter updates
  const [localReportDefinition, setLocalReportDefinition] = useState(reportDefinition);

  // Update local report definition when prop changes
  useEffect(() => {
    setLocalReportDefinition(reportDefinition);
  }, [reportDefinition]);

  // Extract filters from local report definition
  const filters = useMemo(() => {
    if (!localReportDefinition?.columnList) return {};
    const filterObj: Record<string, string[]> = {};
    Object.entries(localReportDefinition.columnList).forEach(([columnName, column]) => {
      const col = column as any;
      if (col.filter && Object.keys(col.filter).length > 0) {
        // Convert filter object to array of selected values
        filterObj[columnName] = Object.keys(col.filter).filter(key => col.filter[key]);
      }
    });
    return filterObj;
  }, [localReportDefinition]);

  // Use the report data hook (paged) with local report definition
  const { data, columns, totalRows, isLoading, error, hasMore, fetchMore } = useReportData(localReportDefinition, 200);

  // Download dialog state
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadTotal, setDownloadTotal] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCSV = async () => {
    if (!localReportDefinition) return;
    setDownloadDialogOpen(true);
    setDownloadProgress(0);
    setDownloadTotal(0);
    setDownloadComplete(false);
    setDownloading(true);
    try {
      const { allRows, columns: allColumns } = await fetchAllReportData(
        localReportDefinition,
        1000,
        (loaded, total) => {
          setDownloadProgress(loaded);
          setDownloadTotal(total);
        }
      );
      const csv = arrayToCSV(allRows, allColumns);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadComplete(true);
    } catch (err) {
      alert('Failed to download CSV: ' + (err instanceof Error ? err.message : err));
      setDownloadDialogOpen(false);
    } finally {
      setDownloading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: Record<string, string[]>) => {
    if (!localReportDefinition) return;
    
    // Update the report definition with new filters
    const updatedColumnList = { ...localReportDefinition.columnList };
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
    
    // Update local report definition to trigger data refetch
    const updatedReportDefinition = {
      ...localReportDefinition,
      columnList: updatedColumnList
    };
    setLocalReportDefinition(updatedReportDefinition);
    
    console.log('Filters updated:', newFilters);
    console.log('Updated report definition:', updatedReportDefinition);
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
              variant="ghost"
              onClick={handleDownloadCSV}
              className="flex items-center rounded-xl"
              title="Download CSV"
              disabled={downloading}
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsJsonViewerOpen(true)}
              className="flex items-center rounded-xl"
              title="View Report Configuration"
            >
              <Code className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
      {/* Download Progress Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Download CSV</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {!downloadComplete ? (
              <>
                <div className="mb-2 text-gray-700 text-sm">
                  Downloading {downloadTotal > 0 ? `${downloadTotal}` : ''} rows
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-200"
                    style={{ width: downloadTotal > 0 ? `${Math.round((downloadProgress / downloadTotal) * 100)}%` : '0%' }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {downloadTotal > 0
                    ? `${downloadProgress} of ${downloadTotal} rows loaded (${Math.round((downloadProgress / downloadTotal) * 100)}%)`
                    : 'Starting download...'}
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 text-green-700 text-sm">Extract is complete.</div>
                <Button onClick={() => setDownloadDialogOpen(false)} className="mt-2">Close</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Content */}
      <div className="flex-1 min-h-0 p-4">
        {selectedReport && localReportDefinition ? (
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
                reportDefinition={localReportDefinition}
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
              {localReportDefinition ? (
                <JsonViewer
                  data={localReportDefinition}
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