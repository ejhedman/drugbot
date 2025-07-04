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
    const { 
      tableName, 
      columnList, 
      filters = {}, 
      offset = 0, 
      limit = 1000, 
      orderBy = null 
    } = body;

    // Validate required parameters
    if (!tableName) {
      return NextResponse.json({ error: 'Table name is required' }, { status: 400 });
    }

    if (!columnList || !Array.isArray(columnList) || columnList.length === 0) {
      return NextResponse.json({ error: 'Column list must be a non-empty array' }, { status: 400 });
    }

    // Validate pagination parameters
    const pageOffset = typeof offset === 'number' ? Math.max(0, offset) : 0;
    const pageLimit = typeof limit === 'number' ? Math.min(Math.max(1, limit), 10000) : 1000;

    // Call the distinct rows function
    const { data: result, error } = await supabase.rpc('get_distinct_rows_with_filters', {
      table_name: tableName,
      column_list: columnList,
      filters: filters,
      page_offset: pageOffset,
      page_limit: pageLimit,
      order_by: orderBy
    });

    if (error) {
      console.error('Error calling get_distinct_rows_with_filters:', error);
      return NextResponse.json({ error: 'Failed to fetch distinct data' }, { status: 500 });
    }

    if (!result || result.length === 0) {
      return NextResponse.json({
        data: [],
        columns: columnList.map(col => ({
          key: col,
          displayName: col,
          fieldName: col
        })),
        totalRows: 0,
        offset: pageOffset,
        limit: pageLimit
      });
    }

    // Extract the actual row data and total count
    const rows = result.map((row: any) => row.row_data);
    const totalRows = result[0]?.total_count || 0;

    // Build column definitions
    const columns = columnList.map(col => ({
      key: col,
      displayName: col,
      fieldName: col
    }));

    return NextResponse.json({
      data: rows,
      columns: columns,
      totalRows: totalRows,
      offset: pageOffset,
      limit: pageLimit
    });

  } catch (error) {
    console.error('Distinct data POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 