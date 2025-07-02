import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Globe, Trash, Plus, Search, ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import { Report } from '@/hooks/useReports';
import { User } from '@supabase/supabase-js';

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
  setCollapsed
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
        <div className="flex-1 flex items-center justify-center">
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
                        </button>
                        {isOwner(report) && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-2 text-red-600 hover:bg-red-50 rounded-xl"
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
                    {publicReports.length > 0 && (
                      <Separator className="my-4" />
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
                        </button>
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