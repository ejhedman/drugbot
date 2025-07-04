import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDistinctRowsFunction() {
  console.log('Testing get_distinct_rows_with_filters function...\n');

  try {
    // Test 1: Basic distinct rows without filters
    console.log('Test 1: Basic distinct rows (generic_name, route_type) without filters');
    const result1 = await supabase.rpc('get_distinct_rows_with_filters', {
      table_name: 'generic_drugs_wide_view',
      column_list: ['generic_name', 'route_type'],
      filters: {},
      page_offset: 0,
      page_limit: 5,
      order_by: 'generic_name'
    });
    
    if (result1.error) {
      console.error('Test 1 failed:', result1.error);
    } else {
      console.log('Test 1 success - Rows returned:', result1.data?.length || 0);
      console.log('Sample row:', result1.data?.[0]?.row_data);
      console.log('Total count:', result1.data?.[0]?.total_count);
    }

    // Test 2: Distinct rows with filters
    console.log('\nTest 2: Distinct rows with filters (route_type = "Oral")');
    const result2 = await supabase.rpc('get_distinct_rows_with_filters', {
      table_name: 'generic_drugs_wide_view',
      column_list: ['generic_name', 'route_type'],
      filters: { route_type: 'Oral' },
      page_offset: 0,
      page_limit: 3,
      order_by: 'generic_name'
    });
    
    if (result2.error) {
      console.error('Test 2 failed:', result2.error);
    } else {
      console.log('Test 2 success - Rows returned:', result2.data?.length || 0);
      console.log('Sample row:', result2.data?.[0]?.row_data);
      console.log('Total count:', result2.data?.[0]?.total_count);
    }

    // Test 3: Distinct rows with array filters
    console.log('\nTest 3: Distinct rows with array filters (route_type IN ["Oral", "Topical"])');
    const result3 = await supabase.rpc('get_distinct_rows_with_filters', {
      table_name: 'generic_drugs_wide_view',
      column_list: ['generic_name', 'route_type'],
      filters: { route_type: ['Oral', 'Topical'] },
      page_offset: 0,
      page_limit: 3,
      order_by: 'route_type'
    });
    
    if (result3.error) {
      console.error('Test 3 failed:', result3.error);
    } else {
      console.log('Test 3 success - Rows returned:', result3.data?.length || 0);
      console.log('Sample row:', result3.data?.[0]?.row_data);
      console.log('Total count:', result3.data?.[0]?.total_count);
    }

    // Test 4: Pagination test
    console.log('\nTest 4: Pagination test (page 2)');
    const result4 = await supabase.rpc('get_distinct_rows_with_filters', {
      table_name: 'generic_drugs_wide_view',
      column_list: ['generic_name'],
      filters: {},
      page_offset: 5,
      page_limit: 3,
      order_by: 'generic_name'
    });
    
    if (result4.error) {
      console.error('Test 4 failed:', result4.error);
    } else {
      console.log('Test 4 success - Rows returned:', result4.data?.length || 0);
      console.log('Sample row:', result4.data?.[0]?.row_data);
      console.log('Total count:', result4.data?.[0]?.total_count);
    }

    // Test 5: Multiple column distinct with complex filters
    console.log('\nTest 5: Multiple columns with complex filters');
    const result5 = await supabase.rpc('get_distinct_rows_with_filters', {
      table_name: 'generic_drugs_wide_view',
      column_list: ['generic_name', 'route_type'],
      filters: { 
        route_type: ['Oral', 'Topical']
      },
      page_offset: 0,
      page_limit: 2,
      order_by: 'generic_name'
    });
    
    if (result5.error) {
      console.error('Test 5 failed:', result5.error);
    } else {
      console.log('Test 5 success - Rows returned:', result5.data?.length || 0);
      console.log('Sample row:', result5.data?.[0]?.row_data);
      console.log('Total count:', result5.data?.[0]?.total_count);
    }

    // Test 6: Performance test with large dataset
    console.log('\nTest 6: Performance test with large dataset');
    const startTime = Date.now();
    const result6 = await supabase.rpc('get_distinct_rows_with_filters', {
      table_name: 'generic_drugs_wide_view',
      column_list: ['generic_name', 'route_type'],
      filters: {},
      page_offset: 0,
      page_limit: 100,
      order_by: 'generic_name'
    });
    const endTime = Date.now();
    
    if (result6.error) {
      console.error('Test 6 failed:', result6.error);
    } else {
      console.log('Test 6 success - Rows returned:', result6.data?.length || 0);
      console.log('Total count:', result6.data?.[0]?.total_count);
      console.log('Query time:', endTime - startTime, 'ms');
    }

  } catch (error) {
    console.error('Test failed with exception:', error);
  }
}

// Run the test
testDistinctRowsFunction().then(() => {
  console.log('\nAll tests completed');
  process.exit(0);
}).catch((error) => {
  console.error('Test script failed:', error);
  process.exit(1);
}); 