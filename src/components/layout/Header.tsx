'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogin?: () => void;
  onLogout: () => void;
}

export function Header({ onLogin, onLogout }: HeaderProps) {
  const { user } = useAuth();
  
  // Get display name and avatar from GitHub user data
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  return (
    <header className="bg-slate-200 px-6 flex justify-between items-center border-b border-slate-200 shadow-sm" style={{ minHeight: '100px' }}>
      <div className="flex items-center">
        <div className="h-24 rounded-xl overflow-hidden">
          <Image 
            src="/Mapissimo.png" 
            alt="Entity Manager Logo" 
            width={0}
            height={0}
            sizes="100vw"
            className="h-24 w-auto object-contain"
            priority
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-3">
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
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