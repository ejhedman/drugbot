'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Check, X, User, Globe, Copy, Settings, Trash, ChevronUp, ChevronDown, Lock, Unlock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { theUIModel } from '@/model_instances/TheUIModel';
import { useReports, type Report, type ReportDefinition, type ReportColumn } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
import { ReportList } from '@/components/content/ReportList';
import { ColumnList } from '@/components/content/ColumnList';
import { ReportBody } from '@/components/content/ReportBody';

type PanelState = 'RLISTE' | 'RLISTC' | 'RCROPEN' | 'RCCOPEN' | 'RCCCLOSED';

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
  const [panelState, setPanelState] = useState<PanelState>('RLISTE');
  const [creatingNewReport, setCreatingNewReport] = useState(false);



  // Auto-collapse/expand Reports list based on report selection
  useEffect(() => {
    if (creatingNewReport) return; // Do not override state when creating a new report
    if (selectedReport) {
      setPanelState('RCCOPEN');
    } else {
      setPanelState('RLISTE');
    }
  }, [selectedReport, creatingNewReport]);

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

  // State machine transition helpers
  const transition = (action: string) => {
    setPanelState(prev => {
      switch (prev) {
        case 'RLISTE':
          if (action === 'collapseReportList') return 'RLISTC';
          if (action === 'clickNewReport') return 'RCCOPEN';
          break;
        case 'RLISTC':
          if (action === 'expandReportList') return 'RLISTE';
          break;
        case 'RCROPEN':
          if (action === 'collapseReportList') return 'RCCCLOSED';
          if (action === 'expandColumnList') return 'RCCOPEN';
          if (action === 'clickNewReport') return 'RCCOPEN';
          break;
        case 'RCCOPEN':
          if (action === 'collapseColumnList') return 'RCCCLOSED';
          if (action === 'expandReportList') return 'RCROPEN';
          break;
        case 'RCCCLOSED':
          if (action === 'expandReportList') return 'RCROPEN';
          if (action === 'expandColumnList') return 'RCCOPEN';
          break;
        default:
          return prev;
      }
      return prev;
    });
  };

  // Handlers for expand/collapse buttons
  const handleSetReportsCollapsed = (collapsed: boolean) => {
    if (panelState === 'RLISTE' && collapsed) transition('collapseReportList');
    else if (panelState === 'RLISTC' && !collapsed) transition('expandReportList');
    else if (panelState === 'RCROPEN' && collapsed) transition('collapseReportList');
    else if (panelState === 'RCCOPEN' && !collapsed) transition('expandReportList');
    else if (panelState === 'RCCCLOSED' && !collapsed) transition('expandReportList');
  };
  const handleSetColumnsCollapsed = (collapsed: boolean) => {
    if (panelState === 'RCCOPEN' && collapsed) transition('collapseColumnList');
    else if (panelState === 'RCROPEN' && !collapsed) transition('expandColumnList');
    else if (panelState === 'RCCCLOSED' && !collapsed) transition('expandColumnList');
  };

  // New report button handler
  const handleStartCreateReport = () => {
    setCreatingNewReport(true);
    setSelectedReport(null);
    setIsEditingName(true);
    setEditingName('');
    setSelectedReportType('');
    setReportDefinition({
      name: '',
      reportType: '',
      owner: user?.email || '',
      public: false,
      tableName: '',
      columnList: {}
    });
    // State machine transition
    if (panelState === 'RLISTE' || panelState === 'RCROPEN') transition('clickNewReport');
    else setPanelState('RCCOPEN'); // fallback
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

  const handleReportUpdate = (updatedReport: Report) => {
    setSelectedReport(updatedReport);
    try {
      const definition = updatedReport.report_definition as ReportDefinition;
      // Ensure the public flag is set from the report if not in definition
      if (definition && typeof definition.public === 'undefined') {
        definition.public = updatedReport.is_public;
      }
      setReportDefinition(definition);
      setOriginalReportDefinition(definition);
    } catch (error) {
      // fallback
      setReportDefinition(null);
      setOriginalReportDefinition(null);
    }
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

  // Save new report (when creating)
  const handleSaveNewReport = async () => {
    if (!editingName.trim() || !reportDefinition) return;
    const newReportDefinition: ReportDefinition = {
      name: editingName,
      owner: user?.email || '',
      public: reportDefinition.public,
      reportType: '',
      columnList: {},
    };
    try {
      const newReport = await createReport({
        name: editingName.toLowerCase().replace(/\s+/g, '_'),
        display_name: editingName,
        report_type: '',
        report_definition: newReportDefinition,
        is_public: newReportDefinition.public
      });
      setSelectedReport(newReport);
      setReportDefinition(newReportDefinition);
      setIsEditingName(false);
      setEditingName('');
      setCreatingNewReport(false);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleEditReport = (report: Report) => {
    // Set the report and put it into edit mode without calling handleReportSelect
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
    // Set edit mode to true for editing
    setIsInConfigEditMode(true);
  };

  // Collapsed prop for children
  const reportListCollapsed = panelState !== 'RLISTE' && panelState !== 'RCROPEN';
  const columnListCollapsed = panelState !== 'RCCOPEN';

  // Only one panel can be open at a time
  const reportListWidth = reportListCollapsed ? 'w-12 flex-none' : 'w-1/8 flex-none';
  let columnListWidth = columnListCollapsed ? 'w-12 flex-none' : 'w-1/8 flex-none';

  // If both are open (shouldn't happen), force only one open
  if (!reportListCollapsed && !columnListCollapsed) {
    // Default to report list open, column list collapsed
    columnListWidth = 'w-12 flex-none';
  }

  return (
    <div className="flex flex-1 min-h-0 gap-4 p-4 bg-gray-50">
      {/* Report List Card */}
      <div className={`${reportListWidth} min-w-0 ${!reportListCollapsed ? 'min-w-[360px] flex-none' : ''} bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-all duration-200`}>
        <ReportList
          isLoading={isLoading}
          userReports={reports.filter(r => isOwner(r))}
          publicReports={reports.filter(r => !isOwner(r))}
          selectedReport={selectedReport}
          user={user}
          getUserInitials={getUserInitials}
          isOwner={isOwner}
          handleReportSelect={handleReportSelect}
          setReportToDelete={setReportToDelete}
          setDeleteDialogOpen={setDeleteDialogOpen}
          reports={reports}
          newReportName={newReportName}
          setNewReportName={setNewReportName}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          handleCreateReport={handleStartCreateReport}
          collapsed={reportListCollapsed}
          setCollapsed={handleSetReportsCollapsed}
          onEditReport={handleEditReport}
          panelState={panelState}
        />
      </div>

      {/* Only show one of Column List or Report List open at a time */}
      {(selectedReport || creatingNewReport) && panelState !== 'RLISTE' && (
        <>
          {/* Column List Card: always render, but width and content depend on collapsed state */}
          <div className={`${columnListWidth} min-w-0 ${!columnListCollapsed ? 'min-w-[360px] flex-none' : ''} bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-all duration-200`}>
            <ColumnList
              reportDefinition={reportDefinition}
              selectedReportType={selectedReportType}
              isInConfigEditMode={isInConfigEditMode}
              renderColumnList={renderColumnList}
              selectedReport={selectedReport}
              isOwner={isOwner}
              isEditingName={isEditingName}
              editingName={editingName}
              setIsEditingName={setIsEditingName}
              setEditingName={setEditingName}
              updateReportName={creatingNewReport ? handleSaveNewReport : updateReportName}
              originalReportDefinition={originalReportDefinition}
              setReportDefinition={setReportDefinition}
              collapsed={columnListCollapsed}
              setCollapsed={handleSetColumnsCollapsed}
              creatingNewReport={creatingNewReport}
              setCreatingNewReport={setCreatingNewReport}
              onReportTypeChange={handleReportTypeChange}
              onSaveChanges={saveReportChanges}
              onCancelChanges={cancelReportChanges}
              onEditConfig={() => setIsInConfigEditMode(true)}
            />
          </div>

          {/* Report Data Card - hide when creating new report */}
          {!creatingNewReport && (
            <div className="flex-1 min-w-0 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                      <ReportBody
          selectedReport={selectedReport}
          reportDefinition={reportDefinition}
          isJsonViewerOpen={isJsonViewerOpen}
          setIsJsonViewerOpen={setIsJsonViewerOpen}
          isOwner={isOwner}
          onReportUpdate={handleReportUpdate}
        />
            </div>
          )}
        </>
      )}

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