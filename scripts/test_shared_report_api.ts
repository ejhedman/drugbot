import { createClient } from '@supabase/supabase-js';

// Test the shared report API endpoint
async function testSharedReportAPI() {
  console.log('🧪 Testing Shared Report API...\n');

  try {
    // Test with a sample report name
    const reportName = 'test_report'; // This should match a report in your database
    
    console.log(`Testing GET /api/reports/${reportName}`);
    
    const response = await fetch(`http://localhost:3000/api/reports/${reportName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API endpoint working');
      console.log(`   - Report name: ${result.report?.display_name}`);
      console.log(`   - Report type: ${result.report?.report_type}`);
      console.log(`   - Is public: ${result.report?.is_public}`);
      console.log(`   - Owner UID: ${result.report?.owner_uid}`);
      
      if (result.report?.report_definition) {
        console.log('   - Report definition found');
        const def = result.report.report_definition;
        if (def.columnList) {
          const activeColumns = Object.entries(def.columnList)
            .filter(([_, col]) => (col as any).isActive)
            .map(([name]) => name);
          console.log(`   - Active columns: ${activeColumns.length}`);
        }
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ API endpoint error (${response.status}): ${errorText}`);
    }
  } catch (apiError) {
    console.log('❌ API endpoint not accessible (server may not be running)');
    console.log('   Start the server with: npm run dev');
  }

  console.log('\n✅ Shared Report API test completed!');
}

// Run the test
testSharedReportAPI().catch(console.error); 