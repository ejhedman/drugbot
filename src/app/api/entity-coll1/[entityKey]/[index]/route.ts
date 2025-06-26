import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { UpdateEntityColl1Request } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entityKey: string; index: string }> }
) {
  try {
    const { entityKey, index } = await params;
    const body: UpdateEntityColl1Request = await request.json();
    const indexNum = parseInt(index, 10);
    
    if (isNaN(indexNum) || indexNum < 0) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }
    
    const updatedItem = await dataRepository.updateEntityColl1(entityKey, indexNum, body);
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating entity_coll1 item:', error);
    return NextResponse.json({ error: 'Failed to update entity_coll1 item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entityKey: string; index: string }> }
) {
  try {
    const { entityKey, index } = await params;
    const indexNum = parseInt(index, 10);
    
    if (isNaN(indexNum) || indexNum < 0) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }
    
    const deleted = await dataRepository.deleteEntityColl1(entityKey, indexNum);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting entity_coll1 item:', error);
    return NextResponse.json({ error: 'Failed to delete entity_coll1 item' }, { status: 500 });
  }
} 