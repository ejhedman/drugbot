import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Globe, ShieldOff, Trash, Plus, Search, ArrowLeftFromLine, ArrowRightFromLine, Edit, Copy } from 'lucide-react';
import { Report } from '@/hooks/useReports';
import { User } from '@supabase/supabase-js';

// Helper function to get report type from report definition
const getReportType = (report: Report): string => {
  try {
    if (report.report_definition && typeof report.report_definition === 'object') {
      return report.report_definition.reportType || report.report_type || 'No type selected';
    }
  } catch (error) {
    console.warn('Error parsing report definition:', error);
  }
  return report.report_type || 'No type selected';
};

// Helper function to get the appropriate icon for a report based on its public status
const getReportIcon = (report: Report) => {
  try {
    if (report.report_definition && typeof report.report_definition === 'object') {
      const isPublic = report.report_definition.public !== false; // Default to public if not specified
      return isPublic ? Globe : ShieldOff;
    }
  } catch (error) {
    console.warn('Error parsing report definition for icon:', error);
  }
  // Fallback to checking the report's is_public field
  return report.is_public ? Globe : ShieldOff;
};

// Helper function to get the icon color and background for a report
const getReportIconStyle = (report: Report) => {
  const isPublic = getReportIcon(report) === Globe;
  return {
    icon: isPublic ? Globe : ShieldOff,
    bgColor: isPublic ? 'bg-green-500' : 'bg-gray-500',
    iconColor: 'text-white'
  };
};

interface ReportListProps {
  isLoading: boolean;
  userReports: Report[];
  publicReports: Report[];
  selectedReport: Report | null;
  user: User | null;
  getUserInitials: (email: string) => string;
  isOwner: (report: Report) => boolean;
  handleReportSelect: (report: Report) => void;
  setReportToDelete: (report: Report) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  reports: Report[];
  newReportName: string;
  setNewReportName: (name: string) => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  handleCreateReport: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onEditReport?: (report: Report) => void;
  onDuplicateReport?: (report: Report) => void;
  panelState: string;
}

export function ReportList({
  isLoading,
  userReports,
  publicReports,
  selectedReport,
  user,
  getUserInitials,
  isOwner,
  handleReportSelect,
  setReportToDelete,
  setDeleteDialogOpen,
  reports,
  newReportName,
  setNewReportName,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  handleCreateReport,
  collapsed,
  setCollapsed,
  onEditReport,
  onDuplicateReport,
  panelState
}: ReportListProps) {
  return (
    <div className="flex-1 min-h-0 h-full flex flex-col bg-white rounded-xl">
      {/* Header */}
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
              <h2 className="section-title text-gray-900 font-semibold text-lg">Reports</h2>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  onClick={() => handleCreateReport()}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  title="Create New Report"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Content */}
      {collapsed ? (
        <div 
          className="flex-1 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setCollapsed(false)}
          title="Click to expand"
        >
          <span className="text-xs text-gray-500 font-semibold" style={{ writingMode: 'vertical-rl', transform: 'rotate(-180deg)' }}>
            Available Reports
          </span>
        </div>
      ) : (
        <>
          {/* Reports List */}
          <div className="flex-1 overflow-y-auto min-h-0 pt-3">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">Loading reports...</div>
            ) : (
              <div className="space-y-1 px-2">
                {/* User's Reports */}
                {userReports.length > 0 && (
                  <>
                    {userReports.map((report) => (
                      <div
                        key={report.uid}
                        className={`flex items-center gap-2 rounded-xl overflow-hidden ${
                          selectedReport?.uid === report.uid
                            ? 'bg-slate-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <button
                          onClick={() => handleReportSelect(report)}
                          className="flex-1 text-left px-4 py-2 transition-colors text-sm rounded-xl"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full ${getReportIconStyle(report).bgColor} flex items-center justify-center text-white text-sm group relative`}>
                              {React.createElement(getReportIconStyle(report).icon, { className: "h-4 w-4" })}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                {getReportIconStyle(report).icon === Globe ? 'Public Report' : 'Private Report'}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {report.display_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getReportType(report)}
                              </div>
                            </div>
                          </div>
                        </button>
                        {isOwner(report) && (
                          <div className="flex items-center gap-1 mr-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50 rounded-lg"
                              onClick={e => {
                                e.stopPropagation();
                                if (onDuplicateReport) {
                                  onDuplicateReport(report);
                                }
                              }}
                              title="Duplicate report"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-600 hover:bg-red-50 rounded-lg"
                              onClick={e => {
                                e.stopPropagation();
                                setReportToDelete(report);
                                setDeleteDialogOpen(true);
                              }}
                              title="Delete report"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                    {publicReports.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <div className="text-center">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shared</span>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Public Reports */}
                {publicReports.length > 0 && (
                  <div className="space-y-1">
                    {publicReports.map((report) => (
                      <div
                        key={report.uid}
                        className={`flex items-center gap-2 rounded-xl overflow-hidden ${
                          selectedReport?.uid === report.uid
                            ? 'bg-slate-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <button
                          onClick={() => handleReportSelect(report)}
                          className="flex-1 text-left px-4 py-2 transition-colors text-sm rounded-xl"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full ${getReportIconStyle(report).bgColor} flex items-center justify-center text-white text-sm group relative`}>
                              {React.createElement(getReportIconStyle(report).icon, { className: "h-4 w-4" })}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                {getReportIconStyle(report).icon === Globe ? 'Public Report' : 'Private Report'}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {report.display_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getReportType(report)}
                              </div>
                            </div>
                          </div>
                        </button>
                        {/* Duplicate button for public reports */}
                        <div className="flex items-center gap-1 mr-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={e => {
                              e.stopPropagation();
                              if (onDuplicateReport) {
                                onDuplicateReport(report);
                              }
                            }}
                            title="Duplicate report"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
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
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 