import { NextRequest, NextResponse } from 'next/server';
import { theDBModel } from '@/model_instances/TheDBModel';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getAggregateMapping } from '@/model_instances/TheModelMap';
import { aggregateRepository } from '@/lib/repository';

function isSafeName(name: string) {
  return /^[a-zA-Z0-9_]+$/.test(name);
}

export async function POST(request: NextRequest) {
  try {
    const { table, properties, entityUid, aggregateType, ...aggregateData } = await request.json();

    console.log('dynamic-create: Received request:', { table, properties, entityUid, aggregateType, aggregateData });

    // Handle aggregate creation
    if (entityUid && aggregateType) {
      console.log('dynamic-create: Processing aggregate creation...');
      
      if (!isSafeName(aggregateType)) {
        console.log('dynamic-create: Invalid aggregateType format:', aggregateType);
        return NextResponse.json({ error: 'Invalid aggregateType format' }, { status: 400 });
      }

      // Validate that the aggregate type exists in our model
      const aggregateMapping = getAggregateMapping(aggregateType);
      if (!aggregateMapping) {
        console.log('dynamic-create: Aggregate type not found in model:', aggregateType);
        return NextResponse.json({ error: 'Aggregate type not found in model' }, { status: 400 });
      }

      console.log('dynamic-create: Creating aggregate record with mapping:', aggregateMapping);

      // Create the aggregate record using the repository
      const result = await aggregateRepository.createAggregateRecordByEntityUid(aggregateType, entityUid, aggregateData);
      
      console.log('dynamic-create: Aggregate created successfully:', result);
      return NextResponse.json({ 
        success: true,
        message: `${aggregateType} created successfully`,
        id: result.uid 
      }, { status: 201 });
    }

    // Handle regular table creation (existing logic)
    if (!table || !properties) {
      console.log('dynamic-create: Missing required parameters for table creation');
      return NextResponse.json({ error: 'Missing required parameters: table, properties' }, { status: 400 });
    }

    // Validate table name
    if (!isSafeName(table)) {
      console.log('dynamic-create: Invalid table name format:', table);
      return NextResponse.json({ error: 'Invalid table name format' }, { status: 400 });
    }
    const dbTable = theDBModel.getTable(table);
    if (!dbTable) {
      console.log('dynamic-create: Table not found in schema:', table);
      return NextResponse.json({ error: 'Table not found in schema' }, { status: 400 });
    }

    // Validate property keys
    const validColumns = dbTable.fields.map(f => f.name);
    for (const key of Object.keys(properties)) {
      if (!isSafeName(key)) {
        console.log('dynamic-create: Invalid column name:', key);
        return NextResponse.json({ error: `Invalid column name: ${key}` }, { status: 400 });
      }
      if (!validColumns.includes(key)) {
        console.log('dynamic-create: Column not found in table:', key);
        return NextResponse.json({ error: `Column not found in table: ${key}` }, { status: 400 });
      }
    }

    // Insert using parameterized query (Supabase client is safe)
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from(table)
      .insert(properties)
      .select()
      .single();

    if (error) {
      console.log('dynamic-create: Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('dynamic-create: Table record created successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.log('dynamic-create: Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 