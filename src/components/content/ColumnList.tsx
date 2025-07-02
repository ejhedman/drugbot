import React from 'react';
import { Report, ReportDefinition } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Lock, Edit, Check, X, ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

interface ColumnListProps {
  reportDefinition: ReportDefinition | null;
  selectedReportType: string;
  isInConfigEditMode: boolean;
  renderColumnList: () => React.ReactNode;
  selectedReport: Report | null;
  isOwner: (report: Report) => boolean;
  isEditingName: boolean;
  editingName: string;
  setIsEditingName: (v: boolean) => void;
  setEditingName: (v: string) => void;
  updateReportName: () => void;
  originalReportDefinition: ReportDefinition | null;
  setReportDefinition: (v: (prev: ReportDefinition | null) => ReportDefinition | null) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  creatingNewReport: boolean;
  setCreatingNewReport: (v: boolean) => void;
  children?: React.ReactNode;
}

export function ColumnList({
  reportDefinition,
  selectedReportType,
  isInConfigEditMode,
  renderColumnList,
  selectedReport,
  isOwner,
  isEditingName,
  editingName,
  setIsEditingName,
  setEditingName,
  updateReportName,
  originalReportDefinition,
  setReportDefinition,
  collapsed,
  setCollapsed,
  creatingNewReport,
  setCreatingNewReport,
  children
}: ColumnListProps) {
  // Always show header in edit mode if creatingNewReport
  const showEditHeader = creatingNewReport || isEditingName;

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col bg-white rounded-xl overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between py-4 border-b border-slate-200 bg-slate-100 rounded-t-xl min-h-[64px]">
        <div className="flex items-center gap-2 flex-1">
          <Button
            size="icon"
            variant="ghost"
            className="mr-2"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ArrowRightFromLine className="h-5 w-5" /> : <ArrowLeftFromLine className="h-5 w-5" />}
          </Button>
          {!collapsed && (
            <>
              {(selectedReport || creatingNewReport) ? (
                <div className="flex items-center space-x-2 flex-1">
                  {/* Public/Private Icon or Checkbox */}
                  {showEditHeader ? (
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
                  ) : (
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
                  )}
                  {/* Report Title (editable) */}
                  {showEditHeader ? (
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
                          setEditingName(selectedReport ? selectedReport.display_name : '');
                          if (creatingNewReport) setCreatingNewReport(false);
                        }
                      }}
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 truncate">
                      {selectedReport ? selectedReport.display_name : ''}
                    </h3>
                  )}
                  {/* Edit Controls */}
                  {(selectedReport && isOwner(selectedReport) && !creatingNewReport) || creatingNewReport ? (
                    <div className="flex items-center space-x-1">
                      {showEditHeader ? (
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
                              setEditingName(selectedReport ? selectedReport.display_name : '');
                              if (creatingNewReport) setCreatingNewReport(false);
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
                            setEditingName(selectedReport ? selectedReport.display_name : '');
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                <h3 className="text-lg font-semibold text-gray-900">Columns</h3>
              )}
            </>
          )}
        </div>
      </div>
      {/* Content */}
      {collapsed ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-gray-500 font-semibold" style={{ writingMode: 'vertical-rl', transform: 'rotate(-180deg)' }}>
            Report Column List
          </span>
        </div>
      ) : (
        <>
          {/* Report type dropdown and controls */}
          {children}
          {/* Column list */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            {renderColumnList()}
            {!selectedReportType && selectedReport && (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">Select a report type to configure columns</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 