'use client';

import { useAuth } from '@/contexts/AuthContext';

interface FooterProps {
  onLoginHelpClick?: () => void;
}

export function Footer({ onLoginHelpClick }: FooterProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Authenticated footer - show system status and build info
    return (
      <footer className="bg-slate-200 px-6 py-4 flex items-center justify-between border-t border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-600">© 2024 Entity Manager</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-500">
            Built with modern design principles
          </span>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-500">System Online</span>
          </div>
        </div>
      </footer>
    );
  }

  // Unauthenticated footer - show copyright center and login help right
  return (
    <footer className="bg-slate-200 px-6 py-4 flex items-center justify-between border-t border-slate-200 shadow-sm">
      {/* Left side - empty for spacing */}
      <div className="flex-1"></div>
      
      {/* Center - Copyright notice */}
      <div className="flex-1 flex justify-center">
        <p className="text-sm text-slate-600">© 2024 Entity Manager</p>
      </div>
      
      {/* Right side - Login Help link */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={onLoginHelpClick}
          className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
        >
          Login Help
        </button>
      </div>
    </footer>
  );
} 