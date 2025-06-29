import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { CreateChildUIAggregateRequest } from '@/model_defs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childKey = searchParams.get('childKey');
    
    let data;
    if (childKey) {
      data = await dataRepository.getChildEntityAggregatesByChildKey(childKey);
      if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(data);
    } else {
      data = await dataRepository.getAllChildEntityAggregates();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching child entity aggregates:', error);
    return NextResponse.json({ error: 'Failed to fetch child entity aggregates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateChildUIAggregateRequest = await request.json();
    
    // Validate required fields
    if (!body.child_entity_key || !body.displayName || typeof body.ordinal !== 'number' || !Array.isArray(body.properties)) {
      return NextResponse.json(
        { error: 'child_entity_key, displayName, ordinal (number), and properties (array) are required' },
        { status: 400 }
      );
    }

    // Verify that the parent child entity exists
    const parentChild = await dataRepository.getChildByKey(body.child_entity_key);
    if (!parentChild) {
      return NextResponse.json(
        { error: 'Parent child entity not found' },
        { status: 400 }
      );
    }

    const newAggregate = await dataRepository.createChildEntityAggregate(body);
    return NextResponse.json(newAggregate, { status: 201 });
  } catch (error) {
    console.error('Error creating child entity aggregate:', error);
    return NextResponse.json({ error: 'Failed to create child entity aggregate' }, { status: 500 });
  }
} 