import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDistinctValuesFunction() {
  console.log('Testing distinct values function...\n');

  try {
    // Test 1: Basic distinct values without filters
    console.log('Test 1: Basic distinct values for drug_name column');
    const { data: basicData, error: basicError } = await supabase
      .rpc('get_distinct_values', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'drug_name'
      });

    if (basicError) {
      console.error('Basic test error:', basicError);
    } else {
      console.log(`Found ${basicData?.length || 0} distinct drug names`);
      console.log('First 10 values:', basicData?.slice(0, 10));
    }

    // Test 2: Distinct values with filters
    console.log('\nTest 2: Distinct values with filters');
    const filters = {
      'manufacturer': ['AbbVie', 'Amgen']
    };
    
    const { data: filteredData, error: filteredError } = await supabase
      .rpc('get_distinct_values_with_filters', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'drug_name',
        filters: filters
      });

    if (filteredError) {
      console.error('Filtered test error:', filteredError);
    } else {
      console.log(`Found ${filteredData?.length || 0} distinct drug names with filters`);
      console.log('First 10 filtered values:', filteredData?.map((item: any) => item.result_value).slice(0, 10));
    }

    // Test 3: Test with a different column
    console.log('\nTest 3: Distinct values for manufacturer column');
    const { data: manufacturerData, error: manufacturerError } = await supabase
      .rpc('get_distinct_values', {
        table_name: 'generic_drugs_wide_view',
        column_name: 'manufacturer'
      });

    if (manufacturerError) {
      console.error('Manufacturer test error:', manufacturerError);
    } else {
      console.log(`Found ${manufacturerData?.length || 0} distinct manufacturers`);
      console.log('First 10 manufacturers:', manufacturerData?.slice(0, 10));
    }

    // Test 4: Compare with direct SQL query
    console.log('\nTest 4: Compare with direct SQL query');
    const { data: directData, error: directError } = await supabase
      .from('generic_drugs_wide_view')
      .select('drug_name');

    if (directError) {
      console.error('Direct query error:', directError);
    } else {
      const uniqueValues = [...new Set(directData?.map(row => row.drug_name).filter(Boolean))];
      console.log(`Direct query found ${uniqueValues.length} unique drug names`);
      console.log('First 10 from direct query:', uniqueValues.slice(0, 10));
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDistinctValuesFunction(); 