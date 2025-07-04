import { createServiceClient } from '../src/lib/supabase-server';

async function testSQLFunction() {
  console.log('Testing SQL function existence...');
  
  try {
    // Test if the function exists by calling it with minimal parameters
    const supabase = createServiceClient();
    
    console.log('Testing get_distinct_values function...');
    const { data: oldResult, error: oldError } = await supabase
      .rpc('get_distinct_values', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'generic_name'
      });
    
    if (oldError) {
      console.error('Old function error:', oldError);
    } else {
      console.log('Old function works, got', oldResult?.length || 0, 'values');
      console.log('Sample values:', oldResult?.slice(0, 3));
    }
    
    console.log('\nTesting get_distinct_values_with_filters function...');
    const { data: newResult, error: newError } = await supabase
      .rpc('get_distinct_values_with_filters', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'generic_name',
        filters: {}
      });
    
    if (newError) {
      console.error('New function error:', newError);
    } else {
      console.log('New function works, got', newResult?.length || 0, 'values');
      console.log('Sample values:', newResult?.slice(0, 3));
    }
    
    // Test with actual filters
    console.log('\nTesting get_distinct_values_with_filters with filters...');
    const { data: filteredResult, error: filteredError } = await supabase
      .rpc('get_distinct_values_with_filters', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'generic_name',
        filters: { manufacturer: ['Pfizer'] }
      });
    
    if (filteredError) {
      console.error('Filtered function error:', filteredError);
    } else {
      console.log('Filtered function works, got', filteredResult?.length || 0, 'values');
      console.log('Sample filtered values:', filteredResult?.slice(0, 3));
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testSQLFunction();
} 