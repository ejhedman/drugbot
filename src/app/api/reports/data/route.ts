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
    const { reportDefinition } = body;

    if (!reportDefinition || !reportDefinition.columnList) {
      return NextResponse.json({ error: 'Invalid report definition' }, { status: 400 });
    }

    // Get the table name from the report definition
    const tableName = reportDefinition.tableName || 'generic_drugs_wide_view';
    
    // Get active columns from the report definition
    const activeColumns = Object.entries(reportDefinition.columnList)
      .filter(([_, col]) => (col as any).isActive)
      .sort(([, a], [, b]) => ((a as any).ordinal ?? 0) - ((b as any).ordinal ?? 0))
      .map(([key, col]) => ({
        key,
        displayName: (col as any).displayName || key,
        fieldName: key
      }));

    if (activeColumns.length === 0) {
      return NextResponse.json({ error: 'No active columns found' }, { status: 400 });
    }

    // Build the select query with only the active columns
    const selectFields = activeColumns.map(col => col.fieldName).join(', ');
    
    // Query the database
    const { data: rows, error } = await supabase
      .from(tableName)
      .select(selectFields)
      .limit(1000); // Limit to prevent overwhelming response

    if (error) {
      console.error('Error fetching report data:', error);
      return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }

    return NextResponse.json({ 
      data: rows || [],
      columns: activeColumns,
      totalRows: rows?.length || 0
    });
  } catch (error) {
    console.error('Report data POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 