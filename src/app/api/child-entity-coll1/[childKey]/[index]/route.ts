import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { UpdateChildUIAggregateRequest } from '@/model_defs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ childKey: string; index: string }> }
) {
  try {
    const { childKey, index } = await params;
    const indexNum = parseInt(index);
    
    const body: UpdateChildUIAggregateRequest = await request.json();
    const updatedAggregate = await dataRepository.updateChildEntityAggregate(childKey, indexNum, body);
    
    if (!updatedAggregate) {
      return NextResponse.json({ error: 'Child aggregate not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedAggregate);
  } catch (error) {
    console.error('Error updating child entity aggregate:', error);
    return NextResponse.json({ error: 'Failed to update child entity aggregate' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ childKey: string; index: string }> }
) {
  try {
    const { childKey, index } = await params;
    const indexNum = parseInt(index);
    
    const deleted = await dataRepository.deleteChildEntityAggregate(childKey, indexNum);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Child aggregate not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Child entity aggregate deleted successfully' });
  } catch (error) {
    console.error('Error deleting child entity aggregate:', error);
    return NextResponse.json({ error: 'Failed to delete child entity aggregate' }, { status: 500 });
  }
} 