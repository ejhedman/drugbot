'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  onLogin?: () => void;
  onLogout: () => void;
}

// User Avatar Component
function UserAvatar({ user }: { user: any }) {
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User';
  
  // Generate initials from display name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // If we have a name, show initials, otherwise show user icon
  if (displayName && displayName !== 'User') {
    const initials = getInitials(displayName);
    return (
      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
        {initials}
      </div>
    );
  }

  // Fallback to user icon
  return (
    <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
      <User className="w-4 h-4" />
    </div>
  );
}

export function Header({ onLogin, onLogout }: HeaderProps) {
  const { user } = useAuth();
  
  // Get display name from user data
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User';
  
  return (
    <header className="bg-slate-200 px-6 flex justify-between items-center border-b border-slate-200 shadow-sm" style={{ minHeight: '70px' }}>
      <div className="flex items-center">
        <div className="h-12 rounded-xl overflow-hidden">
          <Image 
            src="/drugissimo.png" 
            alt="Drugissimo Logo" 
            width={0}
            height={0}
            sizes="100vw"
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-3">
              <UserAvatar user={user} />
              <span className="label text-slate-700">Welcome, {displayName}</span>
            </div>
            <Button
              onClick={onLogout}
              size="sm"
              variant="outline"
              className="px-4 py-2 rounded-xl border-slate-400 text-slate-700 hover:bg-slate-600 hover:text-white hover:border-slate-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : null}
      </div>
    </header>
  );
} 