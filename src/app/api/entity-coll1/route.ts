import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { CreateUIAggregateRequest } from '@/model_defs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');
    
    let data;
    if (entityKey) {
      data = await dataRepository.getEntityAggregatesByEntityKey(entityKey);
      if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(data);
    } else {
      data = await dataRepository.getAllEntityAggregates();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching entity aggregates:', error);
    return NextResponse.json({ error: 'Failed to fetch entity aggregates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateUIAggregateRequest = await request.json();
    
    // Validate required fields
    if (!body.entity_key || !body.displayName || typeof body.ordinal !== 'number' || !Array.isArray(body.properties)) {
      return NextResponse.json(
        { error: 'entity_key, displayName, ordinal (number), and properties (array) are required' },
        { status: 400 }
      );
    }

    // Verify that the parent entity exists
    const parentEntity = await dataRepository.getEntityByKey(body.entity_key);
    if (!parentEntity) {
      return NextResponse.json(
        { error: 'Parent entity not found' },
        { status: 400 }
      );
    }

    const newAggregate = await dataRepository.createEntityAggregate(body);
    return NextResponse.json(newAggregate, { status: 201 });
  } catch (error) {
    console.error('Error creating entity aggregate:', error);
    return NextResponse.json({ error: 'Failed to create entity aggregate' }, { status: 500 });
  }
} 