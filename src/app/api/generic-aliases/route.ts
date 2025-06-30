import { NextRequest, NextResponse } from 'next/server';
import { aggregateRepository } from '@/lib/repository';
import { UIAggregate } from '@/model_defs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityUid = searchParams.get('entityUid');

    if (!entityUid) {
      return NextResponse.json({ error: 'entityUid parameter is required' }, { status: 400 });
    }

    // Use the new unified aggregate method
    const aliases: UIAggregate = await aggregateRepository.getAggregateByEntityUid(entityUid, 'GenericAlias');

    return NextResponse.json(aliases);
  } catch (error) {
    console.error('Error in generic-aliases API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityUid, ...data } = body;

    if (!entityUid) {
      return NextResponse.json({ error: 'entityUid is required' }, { status: 400 });
    }

    // Create the aggregate record
    const result = await aggregateRepository.createAggregateRecordByEntityUid('GenericAlias', entityUid, data);
    
    return NextResponse.json({ 
      message: 'Alias created successfully',
      aliasId: result.uid 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating alias:', error);
    return NextResponse.json({ error: 'Failed to create alias' }, { status: 500 });
  }
} 