import { useState, useEffect } from 'react';

export interface Report {
  uid: string;
  name: string;
  display_name: string;
  owner_uid: string;
  is_public: boolean;
  report_type: string;
  report_definition: ReportDefinition;
  created_at: string;
  updated_at: string;
}

export interface ReportColumn {
  isActive: boolean;
  isSortColumn: boolean;
  filter: Record<string, any>;
  ordinal: number;
  displayName?: string;
}

export interface ReportDefinition {
  name: string;
  reportType: string;
  owner: string;
  public: boolean;
  columnList: Record<string, ReportColumn>;
  tableName?: string;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  const createReport = async (reportData: {
    name: string;
    display_name: string;
    report_type: string;
    report_definition: ReportDefinition;
    is_public: boolean;
  }) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        const data = await response.json();
        setReports(prev => [data.report, ...prev]);
        return data.report;
      } else {
        throw new Error('Failed to create report');
      }
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  };

  const updateReport = async (uid: string, reportData: {
    name: string;
    display_name: string;
    is_public: boolean;
    report_definition: ReportDefinition;
  }) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, ...reportData })
      });

      if (response.ok) {
        const data = await response.json();
        setReports(prev => prev.map(r => r.uid === uid ? data.report : r));
        return data.report;
      } else {
        throw new Error('Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  };

  const deleteReport = async (uid: string) => {
    try {
      const response = await fetch(`/api/reports?uid=${uid}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setReports(prev => prev.filter(r => r.uid !== uid));
        return true;
      } else {
        throw new Error('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    isLoading,
    error,
    fetchReports,
    createReport,
    updateReport,
    deleteReport
  };
} 