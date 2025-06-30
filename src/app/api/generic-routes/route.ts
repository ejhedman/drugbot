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
    const routes: UIAggregate = await aggregateRepository.getAggregateByEntityUid(entityUid, 'GenericRoute');

    return NextResponse.json(routes);
  } catch (error) {
    console.error('Error in generic-routes API:', error);
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
    const result = await aggregateRepository.createAggregateRecordByEntityUid('GenericRoute', entityUid, data);
    
    return NextResponse.json({ 
      message: 'Route created successfully',
      routeId: result.uid 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating route:', error);
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
} 