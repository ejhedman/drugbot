import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { UpdateChildEntityRequest } from '@/model_defs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const child = await dataRepository.getChildByKey(key);
    
    if (!child) {
      return NextResponse.json({ error: 'Child entity not found' }, { status: 404 });
    }

    return NextResponse.json(child);
  } catch (error) {
    console.error('Error fetching child entity:', error);
    return NextResponse.json({ error: 'Failed to fetch child entity' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body: UpdateChildEntityRequest = await request.json();
    
    const updatedChild = await dataRepository.updateChildEntity(key, body);
    
    if (!updatedChild) {
      return NextResponse.json({ error: 'Child entity not found' }, { status: 404 });
    }

    return NextResponse.json(updatedChild);
  } catch (error) {
    console.error('Error updating child entity:', error);
    return NextResponse.json({ error: 'Failed to update child entity' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const deleted = await dataRepository.deleteChildEntity(key);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Child entity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Child entity deleted successfully' });
  } catch (error) {
    console.error('Error deleting child entity:', error);
    return NextResponse.json({ error: 'Failed to delete child entity' }, { status: 500 });
  }
} 