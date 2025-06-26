'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginHelpForm } from '@/components/auth/LoginHelpForm';
import { UnauthenticatedContent } from '@/components/content/UnauthenticatedContent';
import { AuthenticatedContent } from '@/components/content/AuthenticatedContent';
import { useLoginHelpSubmission } from '@/hooks/useLoginHelpSubmission';

export function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginHelp, setShowLoginHelp] = useState(false);
  
  // Use the login help submission hook with default logging behavior
  const { submitHelpRequest } = useLoginHelpSubmission();

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowLoginHelp(false);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowLoginHelp(false);
  };

  const handleLogout = () => {
    logout();
    setShowLogin(false);
    setShowLoginHelp(false);
  };

  const handleLoginHelpClick = () => {
    setShowLoginHelp(true);
    setShowLogin(false);
  };

  const handleLoginHelpCancel = () => {
    setShowLoginHelp(false);
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
        {isAuthenticated ? (
          <AuthenticatedContent />
        ) : showLogin ? (
          <LoginForm onSuccess={handleLoginSuccess} />
        ) : showLoginHelp ? (
          <LoginHelpForm 
            onSubmit={submitHelpRequest}
            onCancel={handleLoginHelpCancel}
          />
        ) : (
          <UnauthenticatedContent onLogin={handleLoginSuccess} />
        )}
      </main>

      {/* Footer */}
      <Footer onLoginHelpClick={handleLoginHelpClick} />
    </div>
  );
} 