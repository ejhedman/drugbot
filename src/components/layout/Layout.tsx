'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginHelpForm } from '@/components/auth/LoginHelpForm';
import { UnauthenticatedContent } from '@/components/content/UnauthenticatedContent';
import { AuthenticatedContent } from '@/components/content/AuthenticatedContent';
import { ReleaseNotesPage } from '@/components/content/ReleaseNotesPage';
import { HelpFeedbackPage } from '@/components/content/HelpFeedbackPage';
import { useLoginHelpSubmission } from '@/hooks/useLoginHelpSubmission';
import { useHelpFeedbackSubmission } from '@/hooks/useHelpFeedbackSubmission';

export function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginHelp, setShowLoginHelp] = useState(false);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [showHelpFeedback, setShowHelpFeedback] = useState(false);
  
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

  const handleLogout = () => {
    logout();
    setShowLogin(false);
    setShowLoginHelp(false);
    setShowReleaseNotes(false);
    setShowHelpFeedback(false);
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

  // Determine what content to show
  const getMainContent = () => {
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
      return <AuthenticatedContent />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header 
        onLogin={handleLoginClick}
        onLogout={handleLogout}
      />

      {/* Body Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {getMainContent()}
      </main>

      {/* Footer */}
      <Footer 
        onVersionClick={handleVersionClick}
        onHelpFeedbackClick={handleHelpFeedbackClick}
      />
    </div>
  );
} 