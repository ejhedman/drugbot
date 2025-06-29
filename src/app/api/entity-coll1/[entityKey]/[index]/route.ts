import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { UpdateUIAggregateRequest } from '@/model_defs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entityKey: string; index: string }> }
) {
  try {
    const { entityKey, index } = await params;
    const indexNum = parseInt(index);
    
    const body: UpdateUIAggregateRequest = await request.json();
    const updatedAggregate = await dataRepository.updateEntityAggregate(entityKey, indexNum, body);
    
    if (!updatedAggregate) {
      return NextResponse.json({ error: 'Aggregate not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedAggregate);
  } catch (error) {
    console.error('Error updating entity aggregate:', error);
    return NextResponse.json({ error: 'Failed to update entity aggregate' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entityKey: string; index: string }> }
) {
  try {
    const { entityKey, index } = await params;
    const indexNum = parseInt(index);
    
    const deleted = await dataRepository.deleteEntityAggregate(entityKey, indexNum);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Entity aggregate deleted successfully' });
  } catch (error) {
    console.error('Error deleting entity aggregate:', error);
    return NextResponse.json({ error: 'Failed to delete entity aggregate' }, { status: 500 });
  }
} 