'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface FooterProps {
  onVersionClick?: () => void;
  onHelpFeedbackClick?: () => void;
}

export function Footer({ onVersionClick, onHelpFeedbackClick }: FooterProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    // Authenticated footer - 3 sections: Version, Copyright, Help/Feedback
    return (
      <footer className="bg-slate-200 px-6 py-4 flex items-center justify-between border-t border-slate-200 shadow-sm">
        {/* Left - Version Link */}
        <div className="flex items-center">
          <button
            onClick={onVersionClick}
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            Version 1.0
          </button>
        </div>

        {/* Center - Copyright */}
        <div className="flex items-center">
          <p className="text-sm text-slate-600">© 2024 Entity Manager</p>
        </div>

        {/* Right - Help/Feedback Link */}
        <div className="flex items-center">
          <button
            onClick={onHelpFeedbackClick}
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            Help/Feedback
          </button>
        </div>
      </footer>
    );
  }

  // Unauthenticated footer - show copyright center only
  return (
    <footer className="bg-slate-200 px-6 py-4 flex items-center justify-center border-t border-slate-200 shadow-sm">
      {/* Center - Copyright notice */}
      <p className="text-sm text-slate-600">© 2024 Entity Manager</p>
    </footer>
  );
} 