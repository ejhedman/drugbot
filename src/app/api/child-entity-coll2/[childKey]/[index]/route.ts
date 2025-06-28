import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { UpdateLegacyChildEntityColl2Request } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ childKey: string; index: string }> }
) {
  try {
    const { childKey, index } = await params;
    const body: UpdateLegacyChildEntityColl2Request = await request.json();
    const indexNum = parseInt(index, 10);
    
    if (isNaN(indexNum) || indexNum < 0) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }
    
    const updatedItem = await dataRepository.updateChildEntityColl2(childKey, indexNum, body);
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating child_entity_coll2 item:', error);
    return NextResponse.json({ error: 'Failed to update child_entity_coll2 item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ childKey: string; index: string }> }
) {
  try {
    const { childKey, index } = await params;
    const indexNum = parseInt(index, 10);
    
    if (isNaN(indexNum) || indexNum < 0) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }
    
    const deleted = await dataRepository.deleteChildEntityColl2(childKey, indexNum);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting child_entity_coll2 item:', error);
    return NextResponse.json({ error: 'Failed to delete child_entity_coll2 item' }, { status: 500 });
  }
} 