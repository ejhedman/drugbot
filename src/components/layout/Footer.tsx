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

  const handleDocsClick = () => {
    router.push('/docs');
  };

  if (isAuthenticated) {
    // Authenticated footer - 4 sections: Version, Copyright, Docs, Help/Feedback
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

        {/* Center Left - Copyright */}
        <div className="flex items-center">
          <p className="text-sm text-slate-600">© 2024 Entity Manager</p>
        </div>

        {/* Center Right - Docs Link */}
        <div className="flex items-center">
          <button
            onClick={handleDocsClick}
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            Docs
          </button>
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

  // Unauthenticated footer - show copyright center and docs link
  return (
    <footer className="bg-slate-200 px-6 py-4 flex items-center justify-between border-t border-slate-200 shadow-sm">
      {/* Left - Empty for balance */}
      <div></div>
      
      {/* Center - Copyright notice */}
      <p className="text-sm text-slate-600">© 2024 Entity Manager</p>
      
      {/* Right - Docs Link */}
      <div className="flex items-center">
        <button
          onClick={handleDocsClick}
          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
        >
          Docs
        </button>
      </div>
    </footer>
  );
} 