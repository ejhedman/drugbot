'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginDialog } from './login-dialog';

export const UnauthenticatedHeader: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo/Banner */}
        <div className="flex-1 flex justify-center">
          <div className="text-2xl font-bold text-blue-600">
            DrugBot Healthcare
          </div>
        </div>
        
        {/* Login Button */}
        <div className="flex-1 flex justify-end">
          <Button 
            onClick={() => setShowLoginDialog(true)}
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </Button>
        </div>
      </div>
      
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
      />
    </header>
  );
}; 