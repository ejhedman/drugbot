'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Feature Flag Toggle Component
 * 
 * This component provides a simple way to toggle feature flags during development.
 * It's designed to be easily removable for production builds.
 */
export function FeatureFlagToggle() {
  const [colorBordersEnabled, setColorBordersEnabled] = useFeatureFlag('color-borders');
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle visibility button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        size="sm"
        variant="outline"
        className="mb-2 bg-white/90 backdrop-blur-sm"
      >
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>

      {/* Feature flag controls */}
      {isVisible && (
        <div className="bg-white/95 backdrop-blur-sm border border-blue-100 rounded-lg p-3 shadow-lg">
          <h3 className="text-sm font-semibold mb-2">Feature Flags</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Color Borders</span>
              <Button
                onClick={() => setColorBordersEnabled(!colorBordersEnabled)}
                size="sm"
                variant={colorBordersEnabled ? "default" : "outline"}
                className="ml-2"
              >
                {colorBordersEnabled ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 