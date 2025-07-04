/**
 * Test script to verify infinite scrolling debouncing functionality
 * This script simulates rapid scroll events and verifies that:
 * 1. Duplicate requests are prevented
 * 2. Requests are properly debounced
 * 3. Only one request is made for rapid successive calls
 */

// Mock the fetch function to track API calls
let apiCallCount = 0;
let lastCallTime = 0;
let callHistory: Array<{ timestamp: number; params: any }> = [];

const mockFetch = (url: string, options: any) => {
  const now = Date.now();
  apiCallCount++;
  callHistory.push({
    timestamp: now,
    params: JSON.parse(options.body)
  });
  lastCallTime = now;
  
  console.log(`API Call #${apiCallCount} at ${now}ms`);
  
  // Return a mock response
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      data: Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Item ${i}` })),
      columns: [],
      totalRows: 100,
      offset: callHistory.length * 10,
      limit: 10
    })
  });
};

// Mock the useDebounce hook
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastCallArgs: Parameters<T> | null = null;

  const debouncedCallback = ((...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Check for duplicate calls with same parameters
    if (lastCallArgs && 
        lastCallArgs.length === args.length &&
        lastCallArgs.every((arg, index) => JSON.stringify(arg) === JSON.stringify(args[index]))) {
      console.log('Duplicate call detected, skipping...');
      return;
    }

    lastCallArgs = args;

    timeoutId = setTimeout(() => {
      callback(...args);
      lastCallArgs = null;
    }, delay);
  }) as T;

  return debouncedCallback;
}

// Test the debouncing functionality
async function testDebouncing() {
  console.log('=== Testing Infinite Scroll Debouncing ===\n');
  
  // Reset counters
  apiCallCount = 0;
  callHistory = [];
  
  // Create a debounced fetch function
  const debouncedFetch = useDebounce(async (offset: number) => {
    await mockFetch('/api/reports/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offset, limit: 10 })
    });
  }, 150);
  
  console.log('Simulating rapid scroll events...\n');
  
  // Simulate rapid scroll events (should trigger only one API call)
  const startTime = Date.now();
  
  // Rapid successive calls
  debouncedFetch(10);
  debouncedFetch(10);
  debouncedFetch(10);
  debouncedFetch(10);
  debouncedFetch(10);
  
  console.log(`Made 5 rapid calls with same parameters at ${Date.now() - startTime}ms`);
  
  // Wait for debounce delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log(`\nAfter debounce delay (${Date.now() - startTime}ms):`);
  console.log(`Total API calls made: ${apiCallCount}`);
  console.log(`Expected: 1 (only one call should be made)`);
  
  // Test with different parameters
  console.log('\n--- Testing with different parameters ---');
  
  debouncedFetch(20);
  debouncedFetch(20);
  debouncedFetch(30);
  debouncedFetch(30);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log(`\nAfter second test (${Date.now() - startTime}ms):`);
  console.log(`Total API calls made: ${apiCallCount}`);
  console.log(`Expected: 3 (one for offset 10, one for offset 20, one for offset 30)`);
  
  // Test call history
  console.log('\n--- Call History ---');
  callHistory.forEach((call, index) => {
    console.log(`Call ${index + 1}: offset=${call.params.offset} at ${call.timestamp - startTime}ms`);
  });
  
  // Verify results
  const success = apiCallCount === 3 && 
                  callHistory.length === 3 &&
                  callHistory[0].params.offset === 10 &&
                  callHistory[1].params.offset === 20 &&
                  callHistory[2].params.offset === 30;
  
  console.log(`\n=== Test Result: ${success ? 'PASSED' : 'FAILED'} ===`);
  
  if (!success) {
    console.log('Issues found:');
    if (apiCallCount !== 3) {
      console.log(`- Expected 3 API calls, got ${apiCallCount}`);
    }
    if (callHistory.length !== 3) {
      console.log(`- Expected 3 calls in history, got ${callHistory.length}`);
    }
  } else {
    console.log('✅ Debouncing working correctly!');
    console.log('✅ Duplicate requests prevented!');
    console.log('✅ Only unique requests processed!');
  }
}

// Run the test
testDebouncing().catch(console.error); 