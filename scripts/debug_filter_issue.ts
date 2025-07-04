import { createServiceClient } from '../src/lib/supabase-server';

async function debugFilterIssue() {
  const supabase = createServiceClient();
  
  console.log('🔍 Debugging filter issue...\n');

  try {
    // 1. Check what manufacturers exist in the database
    console.log('1. Checking what manufacturers exist...');
    const { data: manufacturers, error: manuError } = await supabase
      .rpc('get_distinct_values', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'manufacturer'
      });

    if (manuError) {
      console.error('Error getting manufacturers:', manuError);
      return;
    }

    console.log(`Found ${manufacturers?.length || 0} manufacturers:`);
    console.log(manufacturers?.slice(0, 10).map((m: any) => m.value));

    // 2. Check if "Merck" specifically exists
    console.log('\n2. Checking if "Merck" exists...');
    const { data: merckData, error: merckError } = await supabase
      .from('generic_drugs_wide_view')
      .select('manufacturer, generic_name')
      .eq('manufacturer', 'Merck')
      .limit(5);

    if (merckError) {
      console.error('Error checking Merck data:', merckError);
    } else {
      console.log(`Found ${merckData?.length || 0} records with manufacturer = "Merck"`);
      if (merckData && merckData.length > 0) {
        console.log('Sample Merck records:', merckData);
      }
    }

    // 3. Test the new filtered function with Merck
    console.log('\n3. Testing filtered function with Merck...');
    const { data: filteredData, error: filteredError } = await supabase
      .rpc('get_distinct_values_with_filters', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'generic_name',
        filters: { manufacturer: ['Merck'] }
      });

    if (filteredError) {
      console.error('Filtered function error:', filteredError);
    } else {
      console.log(`Filtered function returned ${filteredData?.length || 0} generic names for Merck`);
      if (filteredData && filteredData.length > 0) {
        console.log('Sample filtered generic names:', filteredData.slice(0, 5).map((d: any) => d.value));
      }
    }

    // 4. Test with a manufacturer that definitely exists
    console.log('\n4. Testing with first available manufacturer...');
    if (manufacturers && manufacturers.length > 0) {
      const firstManufacturer = manufacturers[0].value;
      console.log(`Testing with manufacturer: "${firstManufacturer}"`);
      
      const { data: testData, error: testError } = await supabase
        .rpc('get_distinct_values_with_filters', {
          table_name: 'generic_drugs_wide_view',
          column_name: 'generic_name',
          filters: { manufacturer: [firstManufacturer] }
        });

      if (testError) {
        console.error('Test function error:', testError);
      } else {
        console.log(`Test function returned ${testData?.length || 0} generic names for ${firstManufacturer}`);
        if (testData && testData.length > 0) {
          console.log('Sample test generic names:', testData.slice(0, 5).map((d: any) => d.value));
        }
      }
    }

  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugFilterIssue(); 