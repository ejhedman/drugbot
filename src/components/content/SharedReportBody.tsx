import React, { useState, useMemo, useEffect } from 'react';
import { Report } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown } from 'lucide-react';
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

interface SharedReportBodyProps {
  selectedReport: Report | null;
  reportDefinition: any;
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
  const headers = [
    '#', 
    ...filteredColumns.map((col: any) => col.displayName || col.key)];
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
    horizontalPageBreakRepeat: 0, // repeat first column on each horizontal page
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

export function SharedReportBody({
  selectedReport,
  reportDefinition
}: SharedReportBodyProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ loaded: number; total: number } | null>(null);

  // Get distinct data params for the report
  const distinctParams = useMemo(() => getDistinctParams(reportDefinition), [reportDefinition]);

  // Use the distinct data hook
  const { data: reportData, columns: reportColumns, isLoading, error } = useDistinctData(distinctParams);

  const handleDownload = async (format: 'csv' | 'xlsx' | 'json' | 'pdf') => {
    if (!selectedReport || !reportDefinition) return;

    setIsDownloading(true);
    setDownloadProgress(null);

    try {
      // Fetch all data for export
      const { allRows, columns } = await fetchAllReportData(
        reportDefinition, 
        1000, 
        (loaded, total) => setDownloadProgress({ loaded, total })
      );

      const reportName = selectedReport.display_name || 'Report';
      let content: string | ArrayBuffer;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'csv':
          content = arrayToCSV(allRows, columns);
          filename = `${reportName.toLowerCase().replace(/\s+/g, '_')}.csv`;
          mimeType = 'text/csv';
          break;
        case 'xlsx':
          content = arrayToXLSX(allRows, columns);
          filename = `${reportName.toLowerCase().replace(/\s+/g, '_')}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'json':
          content = arrayToJSON(allRows, columns);
          filename = `${reportName.toLowerCase().replace(/\s+/g, '_')}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
          content = await arrayToPDF(allRows, columns, reportName);
          filename = `${reportName.toLowerCase().replace(/\s+/g, '_')}.pdf`;
          mimeType = 'application/pdf';
          break;
        default:
          throw new Error('Unsupported format');
      }

      downloadFile(content, filename, mimeType);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  if (!selectedReport || !reportDefinition) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No report selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Report Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{selectedReport.display_name}</h1>
          </div>
          
          {/* Download Controls */}
          <div className="flex items-center gap-2">
            {isDownloading && downloadProgress && (
              <div className="text-sm text-gray-600">
                Downloading... {downloadProgress.loaded.toLocaleString()} / {downloadProgress.total.toLocaleString()} rows
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownload('csv')}>
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('xlsx')}>
                  Download as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('json')}>
                  Download as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                  Download as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="flex-1 h-0 p-4 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading report data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600">Error loading report data: {error}</p>
            </div>
          </div>
        ) : reportData && reportColumns ? (
          <div className="flex-1 h-0 overflow-hidden flex flex-col">
            <DataTable 
              data={reportData} 
              columns={reportColumns}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600">No data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 