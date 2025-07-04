import { createServiceClient } from '../src/lib/supabase-server';

async function testFilteredDistinctValues() {
  const supabase = createServiceClient();
  
  console.log('Testing filtered distinct values function...\n');

  try {
    // Test 1: Get all distinct values for generic_name (no filters)
    console.log('Test 1: Getting all distinct generic_name values (no filters)...');
    const { data: allValues, error: allError } = await supabase
      .rpc('get_distinct_values_with_filters', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'generic_name',
        filters: {}
      });

    if (allError) {
      console.error('Error getting all values:', allError);
      return;
    }

    console.log(`Found ${allValues?.length || 0} total generic_name values`);
    console.log('Sample values:', allValues?.slice(0, 5));

    // Test 2: Get distinct values with a filter
    console.log('\nTest 2: Getting distinct generic_name values filtered by manufacturer...');
    const { data: filteredValues, error: filteredError } = await supabase
      .rpc('get_distinct_values_with_filters', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'generic_name',
        filters: { manufacturer: ['Pfizer', 'Johnson & Johnson'] }
      });

    if (filteredError) {
      console.error('Error getting filtered values:', filteredError);
      return;
    }

    console.log(`Found ${filteredValues?.length || 0} generic_name values when filtered by manufacturer`);
    console.log('Sample filtered values:', filteredValues?.slice(0, 5));

    // Test 3: Verify that filtered results are actually a subset
    const allValuesSet = new Set(allValues?.map((v: any) => v.value) || []);
    const filteredValuesSet = new Set(filteredValues?.map((v: any) => v.value) || []);
    
    console.log('\nTest 3: Verifying filtered results are subset of all results...');
    const isSubset = [...filteredValuesSet].every(value => allValuesSet.has(value));
    console.log(`Filtered results are subset of all results: ${isSubset}`);
    
    if (filteredValuesSet.size > 0) {
      console.log(`Filtered results are smaller than all results: ${filteredValuesSet.size < allValuesSet.size}`);
    }

    // Test 4: Test the API endpoint
    console.log('\nTest 4: Testing the API endpoint...');
    const testReportDefinition = {
      tableName: 'generic_drugs_wide_view',
      columnList: {
        manufacturer: {
          filter: { 'Pfizer': true, 'Johnson & Johnson': true }
        }
      }
    };

    const response = await fetch('/api/reports/data-values', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportDefinition: testReportDefinition,
        columnName: 'generic_name',
        excludeColumn: 'generic_name'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`API returned ${result.values?.length || 0} values for generic_name`);
      console.log('API sample values:', result.values?.slice(0, 5));
    } else {
      console.error('API test failed:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testFilteredDistinctValues(); 