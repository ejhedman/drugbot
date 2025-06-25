'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AuthenticatedHeader } from './authenticated-header';
import { UnauthenticatedHeader } from './unauthenticated-header';
import { AuthenticatedFooter } from './authenticated-footer';
import { UnauthenticatedFooter } from './unauthenticated-footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {isAuthenticated ? <AuthenticatedHeader /> : <UnauthenticatedHeader />}
      
      {/* Body Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
      
      {/* Footer */}
      {isAuthenticated ? <AuthenticatedFooter /> : <UnauthenticatedFooter />}
    </div>
  );
}; 