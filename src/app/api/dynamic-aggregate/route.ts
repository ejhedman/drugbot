import { NextRequest, NextResponse } from 'next/server';
import { aggregateRepository } from '@/lib/repository';
import { UIAggregate } from '@/model_defs';
import { getAggregateMapping } from '@/model_instances/TheModelMap';

function isSafeName(name: string) {
  return /^[a-zA-Z0-9_]+$/.test(name);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityUid = searchParams.get('entityUid');
    const aggregateType = searchParams.get('aggregateType');

    if (!entityUid) {
      return NextResponse.json({ error: 'entityUid parameter is required' }, { status: 400 });
    }

    if (!aggregateType) {
      return NextResponse.json({ error: 'aggregateType parameter is required' }, { status: 400 });
    }

    if (!isSafeName(aggregateType)) {
      return NextResponse.json({ error: 'Invalid aggregateType format' }, { status: 400 });
    }

    // Validate that the aggregate type exists in our model
    const aggregateMapping = getAggregateMapping(aggregateType);
    if (!aggregateMapping) {
      return NextResponse.json({ error: 'Aggregate type not found in model' }, { status: 400 });
    }

    // Use the aggregate repository to get the data
    const aggregate: UIAggregate = await aggregateRepository.getAggregateByEntityUid(entityUid, aggregateType);

    return NextResponse.json(aggregate);
  } catch (error) {
    console.error('Error in dynamic-aggregate GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
