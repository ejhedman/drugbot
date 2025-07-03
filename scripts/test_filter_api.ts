import { createClient } from '@supabase/supabase-js';

// Test the data-values API endpoint
async function testDataValuesAPI() {
  console.log('Testing data-values API...');
  
  const testReportDefinition = {
    reportType: 'GenericDrugsWideView',
    tableName: 'generic_drugs_wide_view',
    columnList: {
      'generic_name': {
        isActive: true,
        isSortColumn: false,
        filter: {},
        ordinal: 0,
        displayName: 'Generic Name'
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/reports/data-values', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportDefinition: testReportDefinition,
        columnName: 'generic_name'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ data-values API response:', data);
      console.log(`Found ${data.values.length} distinct values for generic_name`);
    } else {
      const error = await response.json();
      console.log('❌ data-values API error:', error);
    }
  } catch (error) {
    console.log('❌ data-values API request failed:', error);
  }
}

// Test the data API endpoint with filters
async function testDataAPIWithFilters() {
  console.log('\nTesting data API with filters...');
  
  const testReportDefinition = {
    reportType: 'GenericDrugsWideView',
    tableName: 'generic_drugs_wide_view',
    columnList: {
      'generic_name': {
        isActive: true,
        isSortColumn: false,
        filter: {
          'Aspirin': true,
          'Ibuprofen': true
        },
        ordinal: 0,
        displayName: 'Generic Name'
      },
      'manufacturer': {
        isActive: true,
        isSortColumn: false,
        filter: {},
        ordinal: 1,
        displayName: 'Manufacturer'
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/reports/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportDefinition: testReportDefinition
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ data API response:', {
        totalRows: data.totalRows,
        columns: data.columns.length,
        sampleData: data.data.slice(0, 3)
      });
    } else {
      const error = await response.json();
      console.log('❌ data API error:', error);
    }
  } catch (error) {
    console.log('❌ data API request failed:', error);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Testing Filter API Endpoints\n');
  
  await testDataValuesAPI();
  await testDataAPIWithFilters();
  
  console.log('\n✅ Tests completed');
}

runTests().catch(console.error); 