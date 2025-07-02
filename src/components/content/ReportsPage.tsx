'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Check, X, User, Globe, Copy, Settings, Trash, ChevronUp, ChevronDown, Lock, Unlock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { theUIModel } from '@/model_instances/TheUIModel';
import { useReports, type Report, type ReportDefinition, type ReportColumn } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { JsonViewer } from '@/components/ui/json-viewer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getReportTableName } from '@/model_instances/TheModelMap';
import { getReportColumnDisplayName } from '@/model_instances/TheUIModel';

export function ReportsPage() {
  const { user } = useAuth();
  const { reports, isLoading, createReport, updateReport, deleteReport } = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  const [isJsonViewerOpen, setIsJsonViewerOpen] = useState(false);
  const [reportDefinition, setReportDefinition] = useState<ReportDefinition | null>(null);
  const [isInConfigEditMode, setIsInConfigEditMode] = useState(false);
  const [originalReportDefinition, setOriginalReportDefinition] = useState<ReportDefinition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  // Get available report types from the UI model
  const reportTypes = theUIModel.getReportTypes();

  useEffect(() => {
    if (selectedReportType && (isInConfigEditMode || !selectedReport)) {
      const reportMeta = theUIModel.getReport(selectedReportType);
      if (reportMeta?.propertyDefs) {
        // Only initialize if there is NO columnList
        if (!reportDefinition?.columnList || Object.keys(reportDefinition.columnList).length === 0) {
          const allColumns = reportMeta.propertyDefs.filter(prop => prop.isVisible).map((prop, idx) => ({ name: prop.propertyName, ordinal: idx }));
          setSelectedColumns(allColumns.map(col => col.name));
          const newColumnList: Record<string, ReportColumn> = {};
          allColumns.forEach(({ name, ordinal }) => {
            newColumnList[name] = {
              isActive: true,
              isSortColumn: false,
              filter: {},
              ordinal,
              displayName: getReportColumnDisplayName(selectedReportType, name) || name
            };
          });
          setReportDefinition(prev => prev ? { ...prev, reportType: selectedReportType, columnList: newColumnList, tableName: getReportTableName(selectedReportType) } : null);
        } else {
          // Just update selectedColumns from the existing columnList
          const activeColumns = Object.entries(reportDefinition.columnList)
            .filter(([_, col]) => col.isActive)
            .map(([colName]) => colName);
          setSelectedColumns(activeColumns);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReportType, isInConfigEditMode]);

  const handleCreateReport = async () => {
    if (!newReportName.trim()) return;

    const tableName = getReportTableName(selectedReportType);
    const newColumnList: Record<string, ReportColumn> = {};
    if (selectedReportType) {
      const reportMeta = theUIModel.getReport(selectedReportType);
      if (reportMeta && reportMeta.propertyDefs) {
        reportMeta.propertyDefs.filter(prop => prop.isVisible).forEach((prop, idx) => {
          newColumnList[prop.propertyName] = {
            isActive: true,
            isSortColumn: false,
            filter: {},
            ordinal: idx,
            displayName: getReportColumnDisplayName(selectedReportType, prop.propertyName) || prop.propertyName
          };
        });
      }
    }

    const newReportDefinition: ReportDefinition = {
      name: newReportName,
      reportType: selectedReportType || '',
      owner: user?.email || '',
      public: false,
      tableName: tableName,
      columnList: newColumnList
    };

    try {
      const newReport = await createReport({
        name: newReportName.toLowerCase().replace(/\s+/g, '_'),
        display_name: newReportName,
        report_type: selectedReportType || '',
        report_definition: newReportDefinition,
        is_public: newReportDefinition.public
      });
      
      setSelectedReport(newReport);
      setSelectedReportType(selectedReportType || '');
      setSelectedColumns(Object.keys(newColumnList));
      setReportDefinition(newReportDefinition);
      setIsCreateDialogOpen(false);
      setNewReportName('');
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const updateReportName = async () => {
    if (!selectedReport || !editingName.trim() || !reportDefinition) return;

    const updatedReportDefinition: ReportDefinition = {
      ...reportDefinition,
      name: editingName,
      public: reportDefinition.public
    };

    try {
      const updatedReport = await updateReport(selectedReport.uid, {
        name: editingName.toLowerCase().replace(/\s+/g, '_'),
        display_name: editingName,
        is_public: reportDefinition.public,
        report_definition: updatedReportDefinition
      });
      
      setSelectedReport(updatedReport);
      setReportDefinition(updatedReportDefinition);
      setIsEditingName(false);
      setEditingName('');
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report);
    try {
      const definition = report.report_definition as ReportDefinition;
      // Ensure the public flag is set from the report if not in definition
      if (definition && typeof definition.public === 'undefined') {
        definition.public = report.is_public;
      }
      setReportDefinition(definition);
      setOriginalReportDefinition(definition);
      // Set report type and columns from the JSON
      setSelectedReportType(definition?.reportType || '');
      if (definition?.columnList) {
        const activeColumns = Object.entries(definition.columnList)
          .filter(([_, col]) => col.isActive)
          .map(([colName]) => colName);
        setSelectedColumns(activeColumns);
      } else {
        setSelectedColumns([]);
      }
    } catch (error) {
      // fallback
      setReportDefinition(null);
      setOriginalReportDefinition(null);
      setSelectedReportType('');
      setSelectedColumns([]);
    }
    setIsInConfigEditMode(false);
  };

  const handleColumnToggle = (columnName: string) => {
    // Update selectedColumns for legacy/compat
    setSelectedColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(col => col !== columnName)
        : [...prev, columnName]
    );
    // Update reportDefinition.columnList in state
    setReportDefinition(prev => {
      if (!prev || !prev.columnList) return prev;
      const newColumnList = { ...prev.columnList };
      if (newColumnList[columnName]) {
        newColumnList[columnName] = {
          ...newColumnList[columnName],
          isActive: !newColumnList[columnName].isActive
        };
      }
      return { ...prev, columnList: newColumnList };
    });
  };

  const handleReportTypeChange = (newReportType: string) => {
    setSelectedReportType(newReportType);
    
    // Put report in edit mode when report type changes
    if (selectedReport && !isInConfigEditMode) {
      setIsInConfigEditMode(true);
    }
  };

  const saveReportChanges = async () => {
    if (!selectedReport || !reportDefinition) return;
    const updatedColumnList: Record<string, ReportColumn> = {};
    if (selectedReportType) {
      const reportMeta = theUIModel.getReport(selectedReportType);
      if (reportMeta?.propertyDefs) {
        reportMeta.propertyDefs.forEach((prop) => {
          if (prop.isVisible) {
            const prevCol = reportDefinition.columnList[prop.propertyName];
            updatedColumnList[prop.propertyName] = {
              isActive: selectedColumns.includes(prop.propertyName),
              isSortColumn: false,
              filter: {},
              ordinal: prevCol ? prevCol.ordinal : 0 // Preserve ordinal if it exists
            };
          }
        });
      }
    }
    
    // Re-sequence ordinals to ensure they are unique and sequential
    const sortedEntries = Object.entries(updatedColumnList)
      .sort(([, a], [, b]) => a.ordinal - b.ordinal);
    
    const resequencedColumnList: Record<string, ReportColumn> = {};
    sortedEntries.forEach(([colName, col], index) => {
      resequencedColumnList[colName] = {
        ...col,
        ordinal: index
      };
    });
    
    const updatedReportDefinition: ReportDefinition = {
      ...reportDefinition,
      reportType: selectedReportType,
      columnList: resequencedColumnList
    };
    try {
      const updatedReport = await updateReport(selectedReport.uid, {
        name: selectedReport.name,
        display_name: selectedReport.display_name,
        is_public: reportDefinition.public,
        report_definition: updatedReportDefinition
      });
      setSelectedReport(updatedReport);
      setReportDefinition(updatedReportDefinition);
      setOriginalReportDefinition(updatedReportDefinition);
      setIsInConfigEditMode(false);
    } catch (error) {
      console.error('Error saving report changes:', error);
    }
  };

  const cancelReportChanges = () => {
    if (originalReportDefinition) {
      setReportDefinition(originalReportDefinition);
      setSelectedReportType(originalReportDefinition.reportType);
      
      const activeColumns = Object.entries(originalReportDefinition.columnList).filter(([_, col]) => col.isActive).map(([colName]) => colName);
      setSelectedColumns(activeColumns);
    }
    setIsInConfigEditMode(false);
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const isOwner = (report: Report) => {
    return user?.id === report.owner_uid;
  };

  const userReports = reports.filter(report => isOwner(report));
  const publicReports = reports.filter(report => !isOwner(report) && report.is_public);

  const renderColumnList = () => {
    if (reportDefinition?.columnList && Object.keys(reportDefinition.columnList).length > 0) {
      return Object.entries(reportDefinition.columnList)
        .sort(([, a], [, b]) => a.ordinal - b.ordinal)
        .map(([colName, col], idx, arr) => (
          <div key={colName} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={colName}
              checked={!!col.isActive}
              onChange={() => handleColumnToggle(colName)}
              className="rounded border-gray-300"
              disabled={!isInConfigEditMode}
            />
            <label
              htmlFor={colName}
              className="text-sm text-gray-700 cursor-pointer flex-1"
            >
              {theUIModel.getReportDisplayName(colName) || colName}
            </label>
            {isInConfigEditMode && (
              <div className="flex items-center gap-0.5 ml-auto">
                <Button size="icon" variant="ghost" disabled={idx === 0} onClick={e => { e.preventDefault(); e.stopPropagation(); moveColumn(colName, -1); }} title="Move up">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" disabled={idx === arr.length - 1} onClick={e => { e.preventDefault(); e.stopPropagation(); moveColumn(colName, 1); }} title="Move down">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ));
    } else if (selectedReportType) {
      // fallback to model if no JSON
      return Object.values(theUIModel.getReportVisibleProperties(selectedReportType)).map((property, idx) => (
        <div key={property.propertyName} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={property.propertyName}
            checked={selectedColumns.includes(property.propertyName)}
            onChange={() => handleColumnToggle(property.propertyName)}
            className="rounded border-gray-300"
            disabled={!isInConfigEditMode}
          />
          <label
            htmlFor={property.propertyName}
            className="text-sm text-gray-700 cursor-pointer flex-1"
          >
            {property.displayName || property.propertyName}
          </label>
          <Button size="icon" variant="ghost" className="p-1" disabled={!isInConfigEditMode || idx === 0} onClick={e => { e.preventDefault(); e.stopPropagation(); moveColumn(property.propertyName, -1); }} title="Move up">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="p-1" disabled={!isInConfigEditMode || idx === Object.values(theUIModel.getReportVisibleProperties(selectedReportType)).length - 1} onClick={e => { e.preventDefault(); e.stopPropagation(); moveColumn(property.propertyName, 1); }} title="Move down">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      ));
    } else {
      return null;
    }
  };

  const moveColumn = (colName: string, direction: -1 | 1) => {
    setReportDefinition(prev => {
      if (!prev || !prev.columnList) return prev;
      // Create a new array of entries sorted by ordinal
      const entries = Object.entries(prev.columnList).sort(([, a], [, b]) => a.ordinal - b.ordinal);
      const idx = entries.findIndex(([name]) => name === colName);
      if (idx < 0 || (direction === -1 && idx === 0) || (direction === 1 && idx === entries.length - 1)) return prev;
      // Swap ordinals
      const swapIdx = idx + direction;
      const [nameA, colA] = entries[idx];
      const [nameB, colB] = entries[swapIdx];
      // Create a new columnList object
      const newColumnList = { ...prev.columnList };
      newColumnList[nameA] = { ...colA, ordinal: colB.ordinal };
      newColumnList[nameB] = { ...colB, ordinal: colA.ordinal };
      // Debug log
      console.log('moveColumn', { colName, direction, before: entries.map(([n]) => n), after: Object.entries(newColumnList).sort(([, a], [, b]) => a.ordinal - b.ordinal).map(([n]) => n) });
      // Force a new object reference to trigger re-render
      return { ...prev, columnList: { ...newColumnList } };
    });
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Reports List Column */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Enter a name for your new report. You can configure the report type and columns after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="report-name" className="text-sm font-medium text-gray-700">
                    Report Name
                  </label>
                  <Input
                    id="report-name"
                    value={newReportName}
                    onChange={(e) => setNewReportName(e.target.value)}
                    placeholder="Enter report name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newReportName.trim()) {
                        handleCreateReport();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setNewReportName('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateReport}
                    disabled={!newReportName.trim()}
                  >
                    Create Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading reports...</div>
          ) : (
            <>
              {/* User's Reports */}
              {userReports.length > 0 && (
                <>
                  <div className="space-y-2">
                    {userReports.map((report) => (
                      <div
                        key={report.uid}
                        className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center ${selectedReport?.uid === report.uid ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => handleReportSelect(report)}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                            {getUserInitials(user?.email || '')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {report.display_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {report.report_type || 'No type selected'}
                            </div>
                          </div>
                        </div>
                        {isOwner(report) && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-2 text-red-600 hover:bg-red-50"
                            onClick={e => {
                              e.stopPropagation();
                              setReportToDelete(report);
                              setDeleteDialogOpen(true);
                            }}
                            title="Delete report"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {publicReports.length > 0 && (
                    <Separator className="my-4" />
                  )}
                </>
              )}

              {/* Public Reports */}
              {publicReports.length > 0 && (
                <div className="space-y-2">
                  {publicReports.map((report) => (
                    <div
                      key={report.uid}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedReport?.uid === report.uid
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleReportSelect(report)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {report.display_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {report.report_type || 'No type selected'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {reports.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No reports found. Create your first report!
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Column List Column */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          {selectedReport ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                {/* Public/Private Icon */}
                {!isEditingName ? (
                  <div className="flex items-center justify-center w-6 h-6">
                    {reportDefinition?.public ? (
                      <div className="group relative">
                        <Globe className="h-4 w-4 text-green-600" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                          Public Report
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                          Private Report
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-6 h-6">
                    <input
                      type="checkbox"
                      checked={reportDefinition?.public || false}
                      onChange={(e) => {
                        setReportDefinition(prev => prev ? { ...prev, public: e.target.checked } : null);
                      }}
                      className="rounded border-gray-300"
                      title={reportDefinition?.public ? "Make Private" : "Make Public"}
                    />
                  </div>
                )}
                
                {isEditingName ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-8 text-sm flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editingName.trim()) {
                        updateReportName();
                      } else if (e.key === 'Escape') {
                        setIsEditingName(false);
                        setEditingName(selectedReport.display_name);
                      }
                    }}
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {selectedReport.display_name}
                  </h3>
                )}
                {selectedReport && isOwner(selectedReport) && (
                  <div className="flex items-center space-x-1">
                    {isEditingName ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={updateReportName}
                          className="h-6 w-6 p-0 text-green-600"
                          disabled={!editingName.trim()}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsEditingName(false);
                            setEditingName(selectedReport.display_name);
                            // Restore original public state when canceling
                            if (originalReportDefinition) {
                              setReportDefinition(prev => prev ? { ...prev, public: originalReportDefinition.public } : null);
                            }
                          }}
                          className="h-6 w-6 p-0 text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsEditingName(true);
                          setEditingName(selectedReport.display_name);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900">Columns</h3>
          )}
        </div>

        {/* Report type dropdown and edit controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Report Type
              </label>
              <div className="flex items-center space-x-1">
                {selectedReport && isOwner(selectedReport) && !isInConfigEditMode && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsInConfigEditMode(true)}
                    className="h-6 w-6 p-0"
                    title="Edit report type and columns"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                {selectedReport && isOwner(selectedReport) && isInConfigEditMode && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={saveReportChanges}
                      className="h-6 w-6 p-0 text-green-600"
                      title="Save changes"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelReportChanges}
                      className="h-6 w-6 p-0 text-red-600"
                      title="Cancel changes"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Select
              value={selectedReportType}
              onValueChange={handleReportTypeChange}
              disabled={!isInConfigEditMode}
            >
              <SelectTrigger disabled={!isInConfigEditMode}>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {theUIModel.getReportDisplayName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scrollable column list */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4">
          {renderColumnList()}
          {!selectedReportType && selectedReport && (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">Select a report type to configure columns</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Data Column */}
      <div className="flex-1 bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Report Data</h3>
          {selectedReport && (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsJsonViewerOpen(true)}
                className="flex items-center space-x-2"
                title="View Report Configuration"
              >
                <Settings className="h-4 w-4" />
                <span>View Config</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4">
          {selectedReport && reportDefinition ? (
            <div className="space-y-4">
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">Coming Soon</p>
                <p className="text-sm mt-2">Report data will be displayed here</p>
              </div>
              
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
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg">Select a report to view data</p>
              <p className="text-sm mt-2">Choose a report from the list to see its configuration and data</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the report &quot;{reportToDelete?.display_name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (reportToDelete) {
                  await deleteReport(reportToDelete.uid);
                  setDeleteDialogOpen(false);
                  setReportToDelete(null);
                  if (selectedReport?.uid === reportToDelete.uid) setSelectedReport(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 