'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpDialog } from './help-dialog';

export const UnauthenticatedFooter: React.FC = () => {
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Copyright */}
        <div className="flex-1 flex justify-center">
          <div className="text-sm text-gray-600">
            © 2024 DrugBot Healthcare. All rights reserved.
          </div>
        </div>
        
        {/* Login Help Button */}
        <div className="flex-1 flex justify-end">
          <Button 
            onClick={() => setShowHelpDialog(true)}
            variant="outline"
            size="sm"
          >
            Login Help
          </Button>
        </div>
      </div>
      
      <HelpDialog 
        open={showHelpDialog} 
        onOpenChange={setShowHelpDialog} 
      />
    </footer>
  );
}; 