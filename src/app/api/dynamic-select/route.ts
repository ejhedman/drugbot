import { NextRequest, NextResponse } from 'next/server';
import { theDBModel } from '@/model_instances/TheDBModel';
import { createServiceClient } from '@/lib/supabase-server';

function isSafeName(name: string) {
  return /^[a-zA-Z0-9_]+$/.test(name);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, any>;
    const { table, properties, where, orderBy, limit, offset } = body;

    console.log('dynamic-select: Received request:', { table, properties, where, orderBy, limit, offset });

    // Validate table name
    if (!isSafeName(table)) {
      console.log('dynamic-select: Invalid table name format:', table);
      return NextResponse.json({ error: 'Invalid table name format' }, { status: 400 });
    }
    
    const dbTable = theDBModel.getTable(table);
    console.log('dynamic-select: DB table found:', !!dbTable, 'table name:', table);
    
    if (!dbTable) {
      console.log('dynamic-select: Table not found in schema:', table);
      return NextResponse.json({ error: 'Table not found in schema' }, { status: 400 });
    }

    // Validate property names if provided
    if (properties && Array.isArray(properties)) {
      const validColumns = dbTable.fields.map(f => f.name);
      console.log('dynamic-select: Valid columns:', validColumns);
      console.log('dynamic-select: Requested properties:', properties);
      
      for (const prop of properties) {
        if (!isSafeName(prop)) {
          console.log('dynamic-select: Invalid column name:', prop);
          return NextResponse.json({ error: `Invalid column name: ${prop}` }, { status: 400 });
        }
        if (!validColumns.includes(prop)) {
          console.log('dynamic-select: Column not found in table:', prop);
          return NextResponse.json({ error: `Column not found in table: ${prop}` }, { status: 400 });
        }
      }
    }

    // Build the query
    const supabase = createServiceClient();
    let query = (supabase as any).from(table);

    // Select specific properties or all if not specified
    if (properties && Array.isArray(properties) && properties.length > 0) {
      query = query.select(properties.join(','));
    } else {
      query = query.select('*');
    }

    // Add WHERE conditions if provided
    if (where && typeof where === 'object') {
      for (const [column, value] of Object.entries(where)) {
        if (!isSafeName(column)) {
          console.log('dynamic-select: Invalid column name in where clause:', column);
          return NextResponse.json({ error: `Invalid column name in where clause: ${column}` }, { status: 400 });
        }
        if (!dbTable.fields.some(f => f.name === column)) {
          console.log('dynamic-select: Column not found in table for where clause:', column);
          return NextResponse.json({ error: `Column not found in table for where clause: ${column}` }, { status: 400 });
        }
        query = query.eq(column, value);
      }
    }

    // Add ORDER BY if provided
    if (orderBy && typeof orderBy === 'object') {
      for (const [column, direction] of Object.entries(orderBy)) {
        if (!isSafeName(column)) {
          console.log('dynamic-select: Invalid column name in orderBy:', column);
          return NextResponse.json({ error: `Invalid column name in orderBy: ${column}` }, { status: 400 });
        }
        if (!dbTable.fields.some(f => f.name === column)) {
          console.log('dynamic-select: Column not found in table for orderBy:', column);
          return NextResponse.json({ error: `Column not found in table for orderBy: ${column}` }, { status: 400 });
        }
        if (direction === 'asc' || direction === 'desc') {
          query = query.order(column, { ascending: direction === 'asc' });
        } else {
          console.log('dynamic-select: Invalid order direction:', direction);
          return NextResponse.json({ error: `Invalid order direction: ${direction}. Use 'asc' or 'desc'` }, { status: 400 });
        }
      }
    }

    // Add LIMIT if provided
    if (limit && typeof limit === 'number' && limit > 0) {
      query = query.limit(limit);
    }

    // Add OFFSET if provided
    if (offset && typeof offset === 'number' && offset >= 0) {
      query = query.range(offset, offset + (limit || 1000) - 1);
    }

    console.log('dynamic-select: Executing select query');
    
    const { data, error } = await query;

    if (error) {
      console.log('dynamic-select: Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('dynamic-select: Select successful, returned data count:', data?.length || 0);
    return NextResponse.json({ 
      data,
      count: data?.length || 0
    }, { status: 200 });
  } catch (err: any) {
    console.log('dynamic-select: Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 