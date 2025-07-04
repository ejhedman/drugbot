import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDistinctDataAPI() {
  console.log('Testing distinct data API endpoint...\n');

  try {
    // Test 1: Basic distinct data without filters
    console.log('Test 1: Basic distinct data (generic_name, route_type) without filters');
    const response1 = await fetch('http://localhost:3000/api/reports/distinct-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        tableName: 'generic_drugs_wide_view',
        columnList: ['generic_name', 'route_type'],
        filters: {},
        offset: 0,
        limit: 5,
        orderBy: 'generic_name'
      })
    });

    if (response1.ok) {
      const result1 = await response1.json();
      console.log('Test 1 success - Rows returned:', result1.data?.length || 0);
      console.log('Sample row:', result1.data?.[0]);
      console.log('Total rows:', result1.totalRows);
      console.log('Columns:', result1.columns);
    } else {
      console.error('Test 1 failed:', response1.status, await response1.text());
    }

    // Test 2: Distinct data with filters
    console.log('\nTest 2: Distinct data with filters (route_type = "Oral")');
    const response2 = await fetch('http://localhost:3000/api/reports/distinct-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        tableName: 'generic_drugs_wide_view',
        columnList: ['generic_name', 'route_type', 'drug_class'],
        filters: { route_type: 'Oral' },
        offset: 0,
        limit: 3,
        orderBy: 'generic_name'
      })
    });

    if (response2.ok) {
      const result2 = await response2.json();
      console.log('Test 2 success - Rows returned:', result2.data?.length || 0);
      console.log('Sample row:', result2.data?.[0]);
      console.log('Total rows:', result2.totalRows);
    } else {
      console.error('Test 2 failed:', response2.status, await response2.text());
    }

    // Test 3: Distinct data with array filters
    console.log('\nTest 3: Distinct data with array filters (route_type IN ["Oral", "Topical"])');
    const response3 = await fetch('http://localhost:3000/api/reports/distinct-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        tableName: 'generic_drugs_wide_view',
        columnList: ['generic_name', 'route_type'],
        filters: { route_type: ['Oral', 'Topical'] },
        offset: 0,
        limit: 3,
        orderBy: 'route_type'
      })
    });

    if (response3.ok) {
      const result3 = await response3.json();
      console.log('Test 3 success - Rows returned:', result3.data?.length || 0);
      console.log('Sample row:', result3.data?.[0]);
      console.log('Total rows:', result3.totalRows);
    } else {
      console.error('Test 3 failed:', response3.status, await response3.text());
    }

    // Test 4: Pagination test
    console.log('\nTest 4: Pagination test (page 2)');
    const response4 = await fetch('http://localhost:3000/api/reports/distinct-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        tableName: 'generic_drugs_wide_view',
        columnList: ['generic_name'],
        filters: {},
        offset: 5,
        limit: 3,
        orderBy: 'generic_name'
      })
    });

    if (response4.ok) {
      const result4 = await response4.json();
      console.log('Test 4 success - Rows returned:', result4.data?.length || 0);
      console.log('Sample row:', result4.data?.[0]);
      console.log('Total rows:', result4.totalRows);
      console.log('Offset:', result4.offset);
    } else {
      console.error('Test 4 failed:', response4.status, await response4.text());
    }

    // Test 5: Multiple column distinct with complex filters
    console.log('\nTest 5: Multiple columns with complex filters');
    const response5 = await fetch('http://localhost:3000/api/reports/distinct-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        tableName: 'generic_drugs_wide_view',
        columnList: ['generic_name', 'route_type', 'drug_class', 'approval_status'],
        filters: { 
          route_type: ['Oral', 'Topical'],
          approval_status: 'Approved'
        },
        offset: 0,
        limit: 2,
        orderBy: 'generic_name'
      })
    });

    if (response5.ok) {
      const result5 = await response5.json();
      console.log('Test 5 success - Rows returned:', result5.data?.length || 0);
      console.log('Sample row:', result5.data?.[0]);
      console.log('Total rows:', result5.totalRows);
    } else {
      console.error('Test 5 failed:', response5.status, await response5.text());
    }

    // Test 6: Performance test with large dataset
    console.log('\nTest 6: Performance test with large dataset');
    const startTime = Date.now();
    const response6 = await fetch('http://localhost:3000/api/reports/distinct-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        tableName: 'generic_drugs_wide_view',
        columnList: ['generic_name', 'route_type'],
        filters: {},
        offset: 0,
        limit: 100,
        orderBy: 'generic_name'
      })
    });
    const endTime = Date.now();

    if (response6.ok) {
      const result6 = await response6.json();
      console.log('Test 6 success - Rows returned:', result6.data?.length || 0);
      console.log('Total rows:', result6.totalRows);
      console.log('Query time:', endTime - startTime, 'ms');
    } else {
      console.error('Test 6 failed:', response6.status, await response6.text());
    }

  } catch (error) {
    console.error('Test failed with exception:', error);
  }
}

// Run the test
testDistinctDataAPI().then(() => {
  console.log('\nAll API tests completed');
  process.exit(0);
}).catch((error) => {
  console.error('API test script failed:', error);
  process.exit(1);
}); 