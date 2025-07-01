import { createServiceClient } from '../src/lib/supabase-server';

async function testWideViewAPI() {
  console.log('=== Testing Wide View API with Live Data ===\n');

  try {
    // Get a sample generic drug UID
    const supabase = createServiceClient();
    
    const { data: sampleDrug, error: drugError } = await supabase
      .from('generic_drugs')
      .select('uid, generic_name')
      .limit(1)
      .single();

    if (drugError || !sampleDrug) {
      console.error('❌ Could not find a sample generic drug:', drugError?.message);
      return;
    }

    console.log(`1. Found sample drug:`);
    console.log(`   - UID: ${sampleDrug.uid}`);
    console.log(`   - Name: ${sampleDrug.generic_name}\n`);

    // Test the wide view query directly
    const { data: wideViewData, error: wideViewError } = await supabase
      .from('generic_drugs_wide_view')
      .select('*')
      .eq('generic_uid', sampleDrug.uid);

    if (wideViewError) {
      console.error('❌ Wide view query failed:', wideViewError.message);
      return;
    }

    console.log(`2. Wide view query results:`);
    console.log(`   - Records found: ${wideViewData.length}`);
    
    if (wideViewData.length > 0) {
      console.log(`   - Sample record keys:`, Object.keys(wideViewData[0]));
      console.log(`   - Generic name: ${wideViewData[0].generic_name}`);
      console.log(`   - Has manufactured drugs: ${wideViewData.some((r: any) => r.manu_drug_uid)}`);
      console.log(`   - Has routes: ${wideViewData.some((r: any) => r.route_uid)}`);
      console.log(`   - Has approvals: ${wideViewData.some((r: any) => r.approval_uid)}`);
    }

    // Test the API endpoint
    console.log(`\n3. Testing API endpoint...`);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/dynamic-aggregate?entityUid=${encodeURIComponent(sampleDrug.uid)}&aggregateType=GenericDrugsWideView`;
    
    console.log(`   - URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    const apiData = await response.json();

    if (!response.ok) {
      console.error(`❌ API request failed:`, apiData);
      return;
    }

    console.log(`✅ API request successful`);
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Aggregate type: ${apiData.aggregateType}`);
    console.log(`   - Display name: ${apiData.displayName}`);
    console.log(`   - Rows returned: ${apiData.rows?.length || 0}`);
    
    if (apiData.rows && apiData.rows.length > 0) {
      console.log(`   - Sample row properties:`, apiData.rows[0].map((p: any) => p.propertyName));
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testWideViewAPI(); 