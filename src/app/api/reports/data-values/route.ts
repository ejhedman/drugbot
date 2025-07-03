import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reportDefinition, columnName } = body;

    if (!reportDefinition || !reportDefinition.columnList || !columnName) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    // Get the table name from the report definition
    const tableName = reportDefinition.tableName || 'generic_drugs_wide_view';
    
    // Check if the column exists in the report definition
    if (!reportDefinition.columnList[columnName]) {
      return NextResponse.json({ error: 'Column not found in report definition' }, { status: 400 });
    }

    // Query distinct values for the specified column using raw SQL
    const { data: distinctValues, error } = await supabase
      .rpc('get_distinct_values', {
        table_name: tableName,
        column_name: columnName
      });

    if (error) {
      console.error('Error fetching distinct values:', error);
      return NextResponse.json({ error: 'Failed to fetch distinct values' }, { status: 500 });
    }

    // Extract unique values and convert to strings
    const uniqueValues = distinctValues
      .map((row: any) => String(row.value || ''))
      .filter((value: string) => value !== '')
      .sort();

    return NextResponse.json({ 
      values: uniqueValues,
      columnName: columnName
    });
  } catch (error) {
    console.error('Error in data-values endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 