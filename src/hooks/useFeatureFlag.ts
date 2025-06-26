import { useState, useEffect } from 'react';
import { isFeatureEnabled, setFeatureFlag, FeatureFlags } from '@/lib/featureFlags';

/**
 * React hook for using feature flags
 * Provides reactive access to feature flags with automatic re-rendering
 */
export function useFeatureFlag<K extends keyof FeatureFlags>(flag: K) {
  const [enabled, setEnabled] = useState(() => isFeatureEnabled(flag));

  useEffect(() => {
    // Update state when localStorage changes
    const handleStorageChange = () => {
      setEnabled(isFeatureEnabled(flag));
    };

    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Also check on focus (in case localStorage was changed in another tab)
    const handleFocus = () => {
      setEnabled(isFeatureEnabled(flag));
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [flag]);

  const setValue = (value: FeatureFlags[K]) => {
    setFeatureFlag(flag, value);
    setEnabled(value as boolean);
  };

  return [enabled, setValue] as const;
} 