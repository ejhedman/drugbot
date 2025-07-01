/**
 * Data Transformation Utilities
 * 
 * This file contains utility functions for transforming data between UI and database formats.
 * These functions are referenced by name in the ModelMap configuration.
 */

// ============================================================================
// TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform integer value from database to boolean for UI display
 * @param value - Integer value from database (0, 1, or null)
 * @returns Boolean value for UI (true, false, or null)
 */
export function integerToBoolean(value: any): boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  // Handle string values that might come from form inputs
  if (typeof value === 'string') {
    if (value === '' || value === '0') {
      return false;
    }
    if (value === '1' || value === 'true') {
      return true;
    }
    // Try to parse as number
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      return num === 1;
    }
    return false;
  }
  
  // Handle numeric values
  if (typeof value === 'number') {
    return value === 1;
  }
  
  // Handle boolean values
  if (typeof value === 'boolean') {
    return value;
  }
  
  // Default to false for any other type
  return false;
}

/**
 * Transform boolean value from UI to integer for database storage
 * @param value - Boolean value from UI (true, false, or null)
 * @returns Integer value for database (1, 0, or null)
 */
export function booleanToInteger(value: any): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  // Handle string values that might come from form inputs
  if (typeof value === 'string') {
    if (value === '' || value === '0' || value === 'false') {
      return 0;
    }
    if (value === '1' || value === 'true') {
      return 1;
    }
    // Try to parse as number
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      return num === 1 ? 1 : 0;
    }
    return 0;
  }
  
  // Handle numeric values
  if (typeof value === 'number') {
    return value === 1 ? 1 : 0;
  }
  
  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  
  // Default to 0 for any other type
  return 0;
}

// ============================================================================
// TRANSFORMATION REGISTRY
// ============================================================================

/**
 * Registry of all available transformation functions
 * This allows the system to look up transformation functions by name
 */
export const TRANSFORM_FUNCTIONS: Record<string, (value: any) => any> = {
  integerToBoolean,
  booleanToInteger
};

/**
 * Apply a transformation function by name
 * @param functionName - Name of the transformation function
 * @param value - Value to transform
 * @returns Transformed value
 */
export function applyTransform(functionName: string, value: any): any {
  const transformFn = TRANSFORM_FUNCTIONS[functionName];
  if (!transformFn) {
    console.warn(`Transform function '${functionName}' not found, returning original value`);
    return value;
  }
  
  return transformFn(value);
} 