'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SharedReportHeader } from '@/components/layout/SharedReportHeader';
import { SharedReportFooter } from '@/components/layout/SharedReportFooter';
import { SharedReportBody } from '@/components/content/SharedReportBody';
import { SharedReportAuth } from '@/components/content/SharedReportAuth';
import { Report } from '@/hooks/useReports';

interface SharedReportLayoutProps {
  reportSlug: string;
}

export function SharedReportLayout({ reportSlug }: SharedReportLayoutProps) {
  const { user, isAuthenticated, signOut, isLoading } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [reportDefinition, setReportDefinition] = useState<any>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fetch report data only when authenticated
  useEffect(() => {
    const fetchReport = async () => {
      if (!reportSlug || !isAuthenticated) return;

      try {
        setIsLoadingReport(true);
        setError(null);
        
        const response = await fetch(`/api/reports/${reportSlug}`);
        if (response.ok) {
          const data = await response.json();
          setReport(data.report);
          
          // Parse the report definition
          if (data.report.report_definition) {
            setReportDefinition(data.report.report_definition);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to load report');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Failed to load report');
      } finally {
        setIsLoadingReport(false);
      }
    };

    fetchReport();
  }, [reportSlug, isAuthenticated]);

  // Show authentication page for unauthenticated users
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="h-screen flex flex-col">
        <SharedReportHeader onLogout={handleLogout} />
        <main className="flex-1 flex min-h-0 overflow-hidden">
          <SharedReportAuth 
            reportSlug={reportSlug}
            onLoginSuccess={() => {
              // Reset loading state to trigger report fetch
              setIsLoadingReport(true);
              setError(null);
            }}
          />
        </main>
        <SharedReportFooter />
      </div>
    );
  }

  // Show loading state
  if (isLoading || isLoadingReport) {
    return (
      <div className="h-screen flex flex-col">
        <SharedReportHeader onLogout={handleLogout} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report...</p>
          </div>
        </main>
        <SharedReportFooter />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <SharedReportHeader onLogout={handleLogout} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <p className="text-gray-600">The report may not exist or you may not have access to it.</p>
          </div>
        </main>
        <SharedReportFooter />
      </div>
    );
  }

  // Show main content
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <SharedReportHeader onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        <SharedReportBody 
          selectedReport={report}
          reportDefinition={reportDefinition}
        />
      </main>

      {/* Footer */}
      <SharedReportFooter />
    </div>
  );
} 