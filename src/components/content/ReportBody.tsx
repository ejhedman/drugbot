import React, { useState, useMemo, useEffect } from 'react';
import { Report } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Settings, Download, Code, Edit, Check, X, Copy, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { JsonViewer } from '@/components/ui/json-viewer';
import { DataTable } from '@/components/ui/data-table';
import { useDistinctData } from '@/hooks/useDistinctData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface ReportBodyProps {
  selectedReport: Report | null;
  reportDefinition: any;
  isJsonViewerOpen: boolean;
  setIsJsonViewerOpen: (open: boolean) => void;
  isOwner: (report: Report) => boolean;
  onReportUpdate?: (updatedReport: Report) => void;
  onDuplicateReport?: (originalReport: Report) => void;
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

// Helper to convert array of objects to XLSX
function arrayToXLSX(data: any[], columns: any[]): ArrayBuffer {
  if (!data.length) {
    // Create empty workbook with headers
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([columns.map((col: any) => col.displayName || col.key)]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
    return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  }

  // Transform data to include only the columns we want
  const transformedData = data.map(row => {
    const transformedRow: any = {};
    columns.forEach((col: any) => {
      transformedRow[col.displayName || col.key] = row[col.key] || '';
    });
    return transformedRow;
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(transformedData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
}

// Helper to convert array of objects to JSON
function arrayToJSON(data: any[], columns: any[]): string {
  if (!data.length) return JSON.stringify([], null, 2);
  
  // Transform data to include only the columns we want
  const transformedData = data.map(row => {
    const transformedRow: any = {};
    columns.forEach((col: any) => {
      transformedRow[col.displayName || col.key] = row[col.key] || null;
    });
    return transformedRow;
  });
  
  return JSON.stringify(transformedData, null, 2);
}

// Helper to convert array of objects to PDF (robust browser fix)
async function arrayToPDF(data: any[], columns: any[], reportName: string = 'Report'): Promise<ArrayBuffer> {
  const { default: jsPDF } = await import('jspdf');
  // Ensure jspdf-autotable is attached to jsPDF prototype in the browser
  if (typeof window !== 'undefined') {
    if (!(jsPDF as any).API.autoTable) {
      (window as any).jsPDF = jsPDF;
      await import('jspdf-autotable');
    }
  }

  // Use landscape mode for better column fitting
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text(reportName, 14, 22);

  // Remove any existing '#' or row number column from columns
  const filteredColumns = columns.filter((col: any) =>
    (col.displayName || col.key) !== '#'
  );
  // Now prepend the row number
  const headers = ['#', ...filteredColumns.map((col: any) => col.displayName || col.key)];
  const tableData = data.map((row, idx) => [
    (idx + 1).toString(),
    ...filteredColumns.map((col: any) => {
      const val = row[col.key];
      return val != null ? String(val) : '';
    })
  ]);

  // @ts-expect-error: autoTable is a plugin method not in jsPDF types
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 30,
    styles: { fontSize: 7 }, // smaller font for more columns
    headStyles: { fillColor: [66, 139, 202] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 30 },
    tableWidth: 'auto', // fit table to page width
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: 1, // repeat first column on each horizontal page
  });

  return doc.output('arraybuffer');
}

// Helper to trigger file download
function downloadFile(content: string | ArrayBuffer, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper to map report definition to distinct data params
function getDistinctParams(reportDefinition: any) {
  if (!reportDefinition || !reportDefinition.columnList) return null;
  const activeColumns = Object.entries(reportDefinition.columnList)
    .filter(([_, col]) => (col as any).isActive)
    .sort(([, a], [, b]) => ((a as any).ordinal ?? 0) - ((b as any).ordinal ?? 0))
    .map(([key]) => key);
  if (activeColumns.length === 0) return null;
  // Build filters in the format expected by the API
  const filters: Record<string, any> = {};
  Object.entries(reportDefinition.columnList).forEach(([columnName, column]) => {
    const col = column as any;
    if (col.filter && Object.keys(col.filter).length > 0) {
      const selectedValues = Object.keys(col.filter).filter(key => col.filter[key]);
      if (selectedValues.length > 0) {
        filters[columnName] = selectedValues.length === 1 ? selectedValues[0] : selectedValues;
      }
    }
  });
  return {
    tableName: reportDefinition.tableName || 'generic_drugs_wide_view',
    columnList: activeColumns,
    filters,
    orderBy: activeColumns[0] // Default order by first active column
  };
}

// Updated: fetch all distinct data with filters and columns
async function fetchAllReportData(reportDefinition: any, pageSize = 1000, onProgress?: (loaded: number, total: number) => void) {
  let allRows: any[] = [];
  let offset = 0;
  let totalRows = 0;
  let columns: any[] = [];
  const distinctParams = getDistinctParams(reportDefinition);
  if (!distinctParams) return { allRows: [], columns: [] };
  while (true) {
    const response = await fetch('/api/reports/distinct-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...distinctParams, offset, limit: pageSize })
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
  setIsJsonViewerOpen,
  isOwner,
  onReportUpdate,
  onDuplicateReport
}: ReportBodyProps) {
  // Local state for report definition with filter updates
  const [localReportDefinition, setLocalReportDefinition] = useState(reportDefinition);
  
  // Edit mode state
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [originalReportDefinition, setOriginalReportDefinition] = useState(reportDefinition);
  
  // Separate state for editing filters (only used in edit mode)
  const [editingFilters, setEditingFilters] = useState<Record<string, string[]>>({});
  
  // Force refresh counter to ensure data refetch when canceling
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Update local report definition when prop changes
  useEffect(() => {
    setLocalReportDefinition(reportDefinition);
    setOriginalReportDefinition(reportDefinition);
    setEditingFilters({}); // Reset editing filters when report changes
    setRefreshCounter(0); // Reset refresh counter
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

  // Use editing filters when in edit mode, otherwise use saved filters
  // When canceling, we want to immediately use the saved filters, not the editing filters
  const currentFilters = useMemo(() => {
    if (isInEditMode) {
      return editingFilters;
    } else {
      return filters;
    }
  }, [isInEditMode, editingFilters, filters]);

  // Map report definition to distinct data params
  const distinctParams = useMemo(() => {
    if (!localReportDefinition || !localReportDefinition.columnList) return null;
    const activeColumns = Object.entries(localReportDefinition.columnList)
      .filter(([_, col]) => (col as any).isActive)
      .sort(([, a], [, b]) => ((a as any).ordinal ?? 0) - ((b as any).ordinal ?? 0))
      .map(([key]) => key);
    if (activeColumns.length === 0) return null;
    
    // Use current filters (either editing or saved)
    const filters: Record<string, any> = {};
    if (isInEditMode) {
      // Use editing filters
      Object.entries(currentFilters).forEach(([columnName, values]) => {
        if (values && values.length > 0) {
          filters[columnName] = values.length === 1 ? values[0] : values;
        }
      });
    } else {
      // Use saved filters from report definition
      Object.entries(localReportDefinition.columnList).forEach(([columnName, column]) => {
        const col = column as any;
        if (col.filter && Object.keys(col.filter).length > 0) {
          const selectedValues = Object.keys(col.filter).filter(key => col.filter[key]);
          if (selectedValues.length > 0) {
            filters[columnName] = selectedValues.length === 1 ? selectedValues[0] : selectedValues;
          }
        }
      });
    }
    
    return {
      tableName: localReportDefinition.tableName || 'generic_drugs_wide_view',
      columnList: activeColumns,
      filters,
      orderBy: activeColumns[0], // Default order by first active column
      refreshCounter // Include refresh counter to force refetch when canceling
    };
  }, [localReportDefinition, isInEditMode, currentFilters, refreshCounter]);

  const { data, columns, totalRows, isLoading, error, hasMore, fetchMore, refetch } = useDistinctData(distinctParams, 200);

  // Download dialog state
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadTotal, setDownloadTotal] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'xlsx' | 'json' | 'pdf'>('csv');

  const handleDownload = async (format: 'csv' | 'xlsx' | 'json' | 'pdf') => {
    if (!localReportDefinition) return;
    setDownloadFormat(format);
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
      
      const reportName = selectedReport?.name || 'Report';
      let content: string | ArrayBuffer;
      let filename: string;
      let mimeType: string;
      
      switch (format) {
        case 'csv':
          content = arrayToCSV(allRows, allColumns);
          filename = `${reportName}.csv`;
          mimeType = 'text/csv';
          break;
        case 'xlsx':
          content = arrayToXLSX(allRows, allColumns);
          filename = `${reportName}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'json':
          content = arrayToJSON(allRows, allColumns);
          filename = `${reportName}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
          content = await arrayToPDF(allRows, allColumns, reportName);
          filename = `${reportName}.pdf`;
          mimeType = 'application/pdf';
          break;
        default:
          throw new Error('Unsupported format');
      }
      
      downloadFile(content, filename, mimeType);
      setDownloadComplete(true);
    } catch (err) {
      alert(`Failed to download ${format.toUpperCase()}: ` + (err instanceof Error ? err.message : err));
      setDownloadDialogOpen(false);
    } finally {
      setDownloading(false);
    }
  };

  // Handle filter changes - only update editing filters when in edit mode
  const handleFiltersChange = (newFilters: Record<string, string[]>) => {
    if (isInEditMode) {
      // Only update editing filters, don't modify the report definition yet
      setEditingFilters(newFilters);
      console.log('Editing filters updated:', newFilters);
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isInEditMode) {
      // Cancel edit mode - restore original definition and clear editing filters
      // Force immediate update to ensure data refetch with original filters
      setLocalReportDefinition(originalReportDefinition);
      setEditingFilters({});
      setIsInEditMode(false);
      // Increment refresh counter to force distinctParams to change
      setRefreshCounter(prev => prev + 1);
    } else {
      // Enter edit mode - initialize editing filters with current saved filters
      setEditingFilters(filters);
      setIsInEditMode(true);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!selectedReport || !localReportDefinition) return;
    
    try {
      // Create updated report definition with the editing filters
      const updatedColumnList = { ...localReportDefinition.columnList };
      Object.entries(updatedColumnList).forEach(([columnName, column]) => {
        const col = column as any;
        if (editingFilters[columnName]) {
          // Convert array of selected values to filter object
          const filterObj: Record<string, boolean> = {};
          editingFilters[columnName].forEach(value => {
            filterObj[value] = true;
          });
          col.filter = filterObj;
        } else {
          col.filter = {};
        }
      });
      
      const updatedReportDefinition = {
        ...localReportDefinition,
        columnList: updatedColumnList
      };
      
      // Save the updated report definition to the backend
      const response = await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: selectedReport.uid,
          name: selectedReport.name,
          display_name: selectedReport.display_name,
          is_public: selectedReport.is_public,
          report_definition: updatedReportDefinition
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save report changes');
      }
      
      const { report } = await response.json();
      
      // Update the local and original definitions and exit edit mode
      setLocalReportDefinition(updatedReportDefinition);
      setOriginalReportDefinition(updatedReportDefinition);
      setEditingFilters({});
      setIsInEditMode(false);
      
      // Notify parent component of the update
      if (onReportUpdate) {
        onReportUpdate(report);
      }
      
      console.log('Report saved successfully:', report);
    } catch (error) {
      console.error('Error saving report changes:', error);
      alert('Failed to save report changes. Please try again.');
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col bg-white rounded-xl overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-100 rounded-t-xl min-h-[64px]">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Report Data</h3>
          {selectedReport && (
            <div className="flex items-center gap-1">
              {isOwner(selectedReport) ? (
                // Owner can edit and duplicate
                isInEditMode ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveChanges}
                      className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl"
                      title="Save changes"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditToggle}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                      title="Cancel changes"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditToggle}
                      className="h-6 w-6 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-xl"
                      title="Edit filters"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDuplicateReport?.(selectedReport)}
                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
                      title="Duplicate report"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </>
                )
              ) : (
                // Non-owner can only duplicate
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDuplicateReport?.(selectedReport)}
                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
                  title="Duplicate report"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
        {selectedReport && (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center rounded-xl"
                  title="Download Report Data"
                  disabled={downloading}
                >
                  <Download className="h-5 w-5" />
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownload('csv')}>
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('xlsx')}>
                  Download Excel (XLSX)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('json')}>
                  Download JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                  Download PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="ghost"
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
            <DialogTitle>Download {downloadFormat.toUpperCase()}</DialogTitle>
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
                key={`${selectedReport?.uid}-${isInEditMode ? 'edit' : 'view'}`}
                data={data}
                columns={columns}
                isLoading={isLoading}
                reportDefinition={localReportDefinition}
                filters={currentFilters}
                onFiltersChange={handleFiltersChange}
                hasMore={hasMore}
                fetchMore={fetchMore}
                totalRows={totalRows}
                isInEditMode={isInEditMode}
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