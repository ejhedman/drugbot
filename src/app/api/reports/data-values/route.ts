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
    const { reportDefinition, columnName, excludeColumn } = body;

    // console.log('data-values API called with:', { columnName, excludeColumn, tableName: reportDefinition?.tableName });

    if (!reportDefinition || !reportDefinition.columnList || !columnName) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    // Get the table name from the report definition
    const tableName = reportDefinition.tableName || 'generic_drugs_wide_view';
    
    // Check if the column exists in the report definition
    if (!reportDefinition.columnList[columnName]) {
      return NextResponse.json({ error: 'Column not found in report definition' }, { status: 400 });
    }

    // Build filters, excluding the current column being filtered
    const filters: Record<string, string[]> = {};
    Object.entries(reportDefinition.columnList).forEach(([colName, column]) => {
      const col = column as any;
      if (colName !== excludeColumn && col.filter && Object.keys(col.filter).length > 0) {
        const selectedValues = Object.keys(col.filter).filter(key => col.filter[key]);
        if (selectedValues.length > 0) {
          filters[colName] = selectedValues;
        }
      }
    });

    // Log the filters
    // console.log('[FILTER DROPDOWN FILTERS]', filters);

    // Call the SQL function via RPC
    const { data, error } = await supabase.rpc('get_distinct_values_with_filters', {
      table_name: tableName,
      column_name: columnName,
      filters: filters
    });

    // Log the raw data returned
    // console.log('[FILTER DROPDOWN RAW DATA]', data);

    if (error) {
      console.error('Error fetching distinct values:', error);
      return NextResponse.json({ error: 'Failed to fetch distinct values' }, { status: 500 });
    }

    // Extract unique values and convert to strings
    const uniqueValues = [...new Set(data?.map((row: any) => String(row.result_value) || '') || [])]
      .filter((value) => typeof value === 'string' && value !== '')
      .sort();

    // console.log('Returning values:', { count: uniqueValues.length, sample: uniqueValues.slice(0, 3) });

    return NextResponse.json({ 
      values: uniqueValues,
      columnName: columnName
    });
  } catch (error) {
    console.error('Error in data-values endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 