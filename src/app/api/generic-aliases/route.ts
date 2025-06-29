import { NextRequest, NextResponse } from 'next/server';
import DatabaseRepository from '@/lib/database-repository';
import { UIAggregate } from '@/model_defs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');

    if (!entityKey) {
      return NextResponse.json({ error: 'entityKey parameter is required' }, { status: 400 });
    }

    const repo = new DatabaseRepository();
    
    // Use the new UIAggregate-based method
    const aliases: UIAggregate[] = await repo.getGenericAliasAggregatesByEntityKey(entityKey);

    return NextResponse.json(aliases);
  } catch (error) {
    console.error('Error in generic-aliases API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 