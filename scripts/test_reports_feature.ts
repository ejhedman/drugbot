// Test script for the reports feature
// This script can be run to test the basic functionality

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testReportsFeature() {
  console.log('Testing Reports Feature...\n');

  try {
    // Test 1: Check if reports table exists
    console.log('1. Checking reports table...');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'reports');

    if (tableError) {
      console.error('❌ Error checking reports table:', tableError);
      return;
    }

    if (tables && tables.length > 0) {
      console.log('✅ Reports table exists');
    } else {
      console.log('❌ Reports table does not exist');
      console.log('Please run: \\i ddl/09_reports_table.sql');
      return;
    }

    // Test 2: Check table structure
    console.log('\n2. Checking table structure...');
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'reports')
      .order('ordinal_position');

    if (columnError) {
      console.error('❌ Error checking table structure:', columnError);
      return;
    }

    console.log('✅ Table structure:');
    columns?.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Test 3: Check RLS policies
    console.log('\n3. Checking RLS policies...');
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('policyname, cmd')
      .eq('tablename', 'reports');

    if (policyError) {
      console.error('❌ Error checking RLS policies:', policyError);
      return;
    }

    if (policies && policies.length > 0) {
      console.log('✅ RLS policies found:');
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd}`);
      });
    } else {
      console.log('❌ No RLS policies found');
    }

    console.log('\n✅ Reports feature setup appears correct!');
    console.log('\nNext steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Navigate to the reports page');
    console.log('3. Click the + button to create a new report');
    console.log('4. Test the edit functionality');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testReportsFeature();
}

export { testReportsFeature }; 