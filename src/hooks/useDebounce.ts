import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - The function to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns A debounced version of the callback function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<{ args: Parameters<T>; timestamp: number } | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check if this is a duplicate call with the same arguments
      if (lastCallRef.current && 
          lastCallRef.current.args.length === args.length &&
          lastCallRef.current.args.every((arg, index) => arg === args[index]) &&
          now - lastCallRef.current.timestamp < delay) {
        // This is a duplicate call, don't execute
        return;
      }

      // Store the current call
      lastCallRef.current = { args, timestamp: now };

      // Set the new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastCallRef.current = null;
      }, delay);
    },
    [callback, delay]
  ) as T;

  return debouncedCallback;
}

/**
 * Custom hook for throttling function calls
 * @param callback - The function to throttle
 * @param delay - The throttle delay in milliseconds
 * @returns A throttled version of the callback function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallRef.current >= delay) {
        // Execute immediately if enough time has passed
        callback(...args);
        lastCallRef.current = now;
      } else {
        // Schedule execution for the remaining time
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastCallRef.current = Date.now();
        }, delay - (now - lastCallRef.current));
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
} 