/**
 * Feature Flags System
 * 
 * This module manages feature flags for the application.
 * Feature flags allow toggling features on/off without code changes.
 */

export interface FeatureFlags {
  'color-borders': boolean;
  // Add more feature flags here as needed
}

// Default feature flags configuration
const defaultFeatureFlags: FeatureFlags = {
  'color-borders': false, // Enable colored borders by default for development
};

// Get feature flags from localStorage or use defaults
export function getFeatureFlags(): FeatureFlags {
  if (typeof window === 'undefined') {
    // Server-side rendering - return defaults
    return defaultFeatureFlags;
  }

  try {
    const stored = localStorage.getItem('feature-flags');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultFeatureFlags, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to parse feature flags from localStorage:', error);
  }

  return defaultFeatureFlags;
}

// Set a specific feature flag
export function setFeatureFlag<K extends keyof FeatureFlags>(
  flag: K,
  value: FeatureFlags[K]
): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering - no localStorage
  }

  try {
    const currentFlags = getFeatureFlags();
    const updatedFlags = { ...currentFlags, [flag]: value };
    localStorage.setItem('feature-flags', JSON.stringify(updatedFlags));
  } catch (error) {
    console.warn('Failed to save feature flag:', error);
  }
}

// Check if a specific feature flag is enabled
export function isFeatureEnabled<K extends keyof FeatureFlags>(flag: K): boolean {
  const flags = getFeatureFlags();
  return flags[flag];
}

// Toggle a feature flag
export function toggleFeatureFlag<K extends keyof FeatureFlags>(flag: K): void {
  const currentValue = isFeatureEnabled(flag);
  setFeatureFlag(flag, !currentValue as FeatureFlags[K]);
}

// Reset all feature flags to defaults
export function resetFeatureFlags(): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering - no localStorage
  }

  try {
    localStorage.removeItem('feature-flags');
  } catch (error) {
    console.warn('Failed to reset feature flags:', error);
  }
} 