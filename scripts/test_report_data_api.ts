// Test script for the report data API
// This script tests the new /api/reports/data endpoint

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'set' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample report definition for testing
const sampleReportDefinition = {
  name: "Test Report",
  reportType: "GenericDrugsWideView",
  owner: "test-user",
  public: false,
  tableName: "generic_drugs_wide_view",
  columnList: {
    "generic_name": {
      isActive: true,
      isSortColumn: false,
      filter: {},
      ordinal: 0,
      displayName: "Generic Name"
    },
    "manufacturer": {
      isActive: true,
      isSortColumn: false,
      filter: {},
      ordinal: 1,
      displayName: "Manufacturer"
    },
    "route_type": {
      isActive: true,
      isSortColumn: false,
      filter: {},
      ordinal: 2,
      displayName: "Route Type"
    }
  }
};

async function testReportDataAPI() {
  console.log('Testing Report Data API...\n');

  try {
    // Test 1: Check if the wide view exists
    console.log('1. Checking generic_drugs_wide_view...');
    const { data: viewData, error: viewError } = await supabase
      .from('generic_drugs_wide_view')
      .select('generic_name, manufacturer, route_type')
      .limit(5);

    if (viewError) {
      console.error('❌ Error accessing wide view:', viewError);
      return;
    }

    if (viewData && viewData.length > 0) {
      console.log(`✅ Wide view accessible, found ${viewData.length} sample rows`);
      console.log('Sample data:');
      viewData.forEach((row, i) => {
        console.log(`   Row ${i + 1}: ${row.generic_name} | ${row.manufacturer} | ${row.route_type}`);
      });
    } else {
      console.log('❌ No data found in wide view');
      return;
    }

    // Test 2: Test the API endpoint (if server is running)
    console.log('\n2. Testing API endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/reports/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportDefinition: sampleReportDefinition
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ API endpoint working');
        console.log(`   - Data rows: ${result.data?.length || 0}`);
        console.log(`   - Columns: ${result.columns?.length || 0}`);
        console.log(`   - Total rows: ${result.totalRows || 0}`);
        
        if (result.columns) {
          console.log('   - Column names:');
          result.columns.forEach((col: any) => {
            console.log(`     * ${col.displayName} (${col.key})`);
          });
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ API endpoint error (${response.status}): ${errorText}`);
      }
    } catch (apiError) {
      console.log('❌ API endpoint not accessible (server may not be running)');
      console.log('   Start the server with: npm run dev');
    }

    console.log('\n✅ Report data API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testReportDataAPI();
}

export { testReportDataAPI }; 