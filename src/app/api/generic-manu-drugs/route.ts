import { NextRequest, NextResponse } from 'next/server';
import { aggregateRepository } from '@/lib/repository';
import { UIAggregate } from '@/model_defs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');

    if (!entityKey) {
      return NextResponse.json({ error: 'entityKey parameter is required' }, { status: 400 });
    }

    // Use the new unified aggregate method
    const manuDrugs: UIAggregate = await aggregateRepository.getAggregateByEntityKey(entityKey, 'GenericManuDrugs');

    return NextResponse.json(manuDrugs);
  } catch (error) {
    console.error('Error in generic-manu-drugs API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 