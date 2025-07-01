import { NextRequest, NextResponse } from 'next/server';
import { theDBModel } from '@/model_instances/TheDBModel';
import { createServiceClient } from '@/lib/supabase-server';
import { getAggregateMapping } from '@/model_instances/TheModelMap';
import { aggregateRepository } from '@/lib/repository';

function isSafeName(name: string) {
  return /^[a-zA-Z0-9_]+$/.test(name);
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, any>;
    const { table, uid, properties, aggregateType, ...aggregateData } = body;

    console.log('dynamic-update: Received request:', { table, uid, properties, aggregateType, aggregateData });

    // Handle aggregate updates
    if (aggregateType && uid) {
      console.log('dynamic-update: Processing aggregate update...');
      
      if (!isSafeName(aggregateType)) {
        console.log('dynamic-update: Invalid aggregateType format:', aggregateType);
        return NextResponse.json({ error: 'Invalid aggregateType format' }, { status: 400 });
      }

      // Validate that the aggregate type exists in our model
      const aggregateMapping = getAggregateMapping(aggregateType);
      if (!aggregateMapping) {
        console.log('dynamic-update: Aggregate type not found in model:', aggregateType);
        return NextResponse.json({ error: 'Aggregate type not found in model' }, { status: 400 });
      }

      // Update the aggregate record using the repository
      const result = await aggregateRepository.updateAggregateRecord(aggregateType, uid, aggregateData);
      
      console.log('dynamic-update: Aggregate update successful:', result);
      return NextResponse.json({ 
        success: true,
        message: `${aggregateType} updated successfully`,
        record: result 
      }, { status: 200 });
    }

    // Handle regular table updates (existing logic)
    if (!table || !uid || !properties) {
      console.log('dynamic-update: Missing required parameters for table update');
      return NextResponse.json({ error: 'Missing required parameters: table, uid, properties' }, { status: 400 });
    }

    // Validate table name
    if (!isSafeName(table)) {
      console.log('dynamic-update: Invalid table name format:', table);
      return NextResponse.json({ error: 'Invalid table name format' }, { status: 400 });
    }
    
    const dbTable = theDBModel.getTable(table);
    console.log('dynamic-update: DB table found:', !!dbTable, 'table name:', table);
    
    if (!dbTable) {
      console.log('dynamic-update: Table not found in schema:', table);
      return NextResponse.json({ error: 'Table not found in schema' }, { status: 400 });
    }

    // Validate property keys
    const validColumns = dbTable.fields.map(f => f.name);
    console.log('dynamic-update: Valid columns:', validColumns);
    console.log('dynamic-update: Properties to update:', Object.keys(properties));
    
    for (const propKey of Object.keys(properties)) {
      if (!isSafeName(propKey)) {
        console.log('dynamic-update: Invalid column name:', propKey);
        return NextResponse.json({ error: `Invalid column name: ${propKey}` }, { status: 400 });
      }
      if (!validColumns.includes(propKey)) {
        console.log('dynamic-update: Column not found in table:', propKey);
        return NextResponse.json({ error: `Column not found in table: ${propKey}` }, { status: 400 });
      }
    }

    // Update using parameterized query (Supabase client is safe)
    const supabase = createServiceClient();
    console.log('dynamic-update: Executing update query:', { table, uid, properties });
    
    const { data, error } = await (supabase as any)
      .from(table)
      .update(properties)
      .eq('uid', uid)
      .select()
      .single();

    if (error) {
      console.log('dynamic-update: Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('dynamic-update: Update successful, returned data:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.log('dynamic-update: Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 