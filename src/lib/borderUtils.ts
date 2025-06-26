import { isFeatureEnabled } from './featureFlags';

/**
 * Utility function to conditionally apply border classes based on feature flags
 * When colored borders are disabled, applies standard grey borders for visual separation
 */
export function getBorderClasses(
  baseClasses: string,
  borderClasses: string,
  featureFlag: 'color-borders' = 'color-borders'
): string {
  const shouldShowBorders = isFeatureEnabled(featureFlag);
  
  if (shouldShowBorders) {
    return `${baseClasses} ${borderClasses}`;
  } else {
    return `${baseClasses}`;
  }
}

/**
 * Utility function for components that need to check border visibility
 * Returns true if colored borders should be shown
 */
export function shouldShowBorders(featureFlag: 'color-borders' = 'color-borders'): boolean {
  return isFeatureEnabled(featureFlag);
} 