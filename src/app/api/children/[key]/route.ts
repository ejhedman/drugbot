import { NextRequest, NextResponse } from 'next/server';
import { childEntityRepository } from '@/lib/repository';
import { UpdateChildEntityRequest } from '@/model_defs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    // const { searchParams } = new URL(request.url);
    // const format = searchParams.get('format'); // 'ui' for UIEntity format, default to legacy
    
    const { key } = await params;
    const child = await childEntityRepository.getChildByKeyAsUIEntity(key);
    
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
    // const { searchParams } = new URL(request.url);
    // const format = searchParams.get('format'); // 'ui' for UIEntity format, default to legacy
    
    const { key } = await params;
    const body: UpdateChildEntityRequest = await request.json();
    
    const updatedChild = await childEntityRepository.updateChildEntityAsUIEntity(key, body);
    
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
    const deleted = await childEntityRepository.deleteChildEntity(key);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Child entity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Child entity deleted successfully' });
  } catch (error) {
    console.error('Error deleting child entity:', error);
    return NextResponse.json({ error: 'Failed to delete child entity' }, { status: 500 });
  }
} 