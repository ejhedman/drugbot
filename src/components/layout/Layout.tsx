'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginHelpForm } from '@/components/auth/LoginHelpForm';
import { UnauthenticatedContent } from '@/components/content/UnauthenticatedContent';
import { AuthenticatedContent } from '@/components/content/AuthenticatedContent';
import { HomePage } from '@/components/content/HomePage';
import { ReportsPage } from '@/components/content/ReportsPage';
import { DocumentationPage } from '@/components/content/DocumentationPage';
import { ReleaseNotesPage } from '@/components/content/ReleaseNotesPage';
import { HelpFeedbackPage } from '@/components/content/HelpFeedbackPage';
import { useLoginHelpSubmission } from '@/hooks/useLoginHelpSubmission';
import { useHelpFeedbackSubmission } from '@/hooks/useHelpFeedbackSubmission';

export function Layout() {
  const { isAuthenticated, signOut, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginHelp, setShowLoginHelp] = useState(false);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [showHelpFeedback, setShowHelpFeedback] = useState(false);
  const [activeFeature, setActiveFeature] = useState('home');
  
  // Use the login help submission hook with default logging behavior
  const { submitHelpRequest } = useLoginHelpSubmission();
  
  // Use the help feedback submission hook with default logging behavior
  const { submitFeedback } = useHelpFeedbackSubmission();

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowLoginHelp(false);
    setShowReleaseNotes(false);
    setShowHelpFeedback(false);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowLoginHelp(false);
    setShowReleaseNotes(false);
    setShowHelpFeedback(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowLogin(false);
      setShowLoginHelp(false);
      setShowReleaseNotes(false);
      setShowHelpFeedback(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLoginHelpClick = () => {
    setShowLoginHelp(true);
    setShowLogin(false);
    setShowReleaseNotes(false);
    setShowHelpFeedback(false);
  };

  const handleLoginHelpCancel = () => {
    setShowLoginHelp(false);
  };

  const handleVersionClick = () => {
    setShowReleaseNotes(true);
    setShowHelpFeedback(false);
  };

  const handleHelpFeedbackClick = () => {
    setShowHelpFeedback(true);
    setShowReleaseNotes(false);
  };

  const handleReleaseNotesClose = () => {
    setShowReleaseNotes(false);
  };

  const handleHelpFeedbackCancel = () => {
    setShowHelpFeedback(false);
  };

  const handleFeatureChange = (feature: string) => {
    setActiveFeature(feature);
    // Close any modals when switching features
    setShowReleaseNotes(false);
    setShowHelpFeedback(false);
  };

  // Determine what content to show
  const getMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      if (showLogin) {
        return <LoginForm onSuccess={handleLoginSuccess} />;
      } else if (showLoginHelp) {
        return (
          <LoginHelpForm 
            onSubmit={submitHelpRequest}
            onCancel={handleLoginHelpCancel}
          />
        );
      } else {
        return (
          <UnauthenticatedContent 
            onLogin={handleLoginSuccess} 
            onLoginHelp={handleLoginHelpClick}
          />
        );
      }
    }

    // Authenticated content
    if (showReleaseNotes) {
      return (
        <ReleaseNotesPage 
          selectedVersion="1.0"
          onClose={handleReleaseNotesClose}
        />
      );
    } else if (showHelpFeedback) {
      return (
        <HelpFeedbackPage 
          onSubmit={submitFeedback}
          onCancel={handleHelpFeedbackCancel}
        />
      );
    } else {
      // Show different content based on active feature
      switch (activeFeature) {
        case 'home':
          return <HomePage />;
        case 'drugs':
          return <AuthenticatedContent />;
        case 'reports':
          return <ReportsPage />;
        case 'documentation':
          return <DocumentationPage />;
        default:
          return <HomePage />;
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header 
        onLogin={handleLoginClick}
        onLogout={handleLogout}
      />

      {/* Body Content */}
      <main className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sidebar - only show for authenticated users */}
        {isAuthenticated && !isLoading && (
          <Sidebar 
            activeFeature={activeFeature}
            onFeatureChange={handleFeatureChange}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {getMainContent()}
        </div>
      </main>

      {/* Footer */}
      <Footer 
        onVersionClick={handleVersionClick}
        onHelpFeedbackClick={handleHelpFeedbackClick}
      />
    </div>
  );
} 