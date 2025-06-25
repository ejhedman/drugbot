'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FeedbackDialog } from './feedback-dialog';

export const AuthenticatedFooter: React.FC = () => {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Copyright */}
        <div className="flex-1 flex justify-center">
          <div className="text-sm text-gray-600">
            © 2024 DrugBot Healthcare. All rights reserved.
          </div>
        </div>
        
        {/* Feedback Button */}
        <div className="flex-1 flex justify-end">
          <Button 
            onClick={() => setShowFeedbackDialog(true)}
            variant="outline"
            size="sm"
          >
            Feedback
          </Button>
        </div>
      </div>
      
      <FeedbackDialog 
        open={showFeedbackDialog} 
        onOpenChange={setShowFeedbackDialog} 
      />
    </footer>
  );
}; 