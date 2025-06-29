import { NextRequest, NextResponse } from 'next/server';
import { entityRepository, childEntityRepository } from '@/repository';
import { UpdateChildEntityRequest } from '@/model_defs/DBModel';
import { manuDrugsTable } from '@/model_instances/TheDBModel';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    // Use the unified getEntityByKey method with isChildEntity option
    const child = await entityRepository.getEntityByKey(key, manuDrugsTable, { isChildEntity: true });
    
    if (!child) {
      return NextResponse.json({ error: 'Child entity not found' }, { status: 404 });
    }

    return NextResponse.json(child);
  } catch (error) {
    console.error('Error fetching child entity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body: UpdateChildEntityRequest = await request.json();
    
    const updatedChild = await childEntityRepository.updateChildEntityAsUIEntity(key, body, manuDrugsTable);
    
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
    // Use the unified deleteEntity method with isChildEntity option
    const deleted = await entityRepository.deleteEntity(key, manuDrugsTable, { isChildEntity: true });
    
    if (!deleted) {
      return NextResponse.json({ error: 'Child entity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Child entity deleted successfully' });
  } catch (error) {
    console.error('Error deleting child entity:', error);
    return NextResponse.json({ error: 'Failed to delete child entity' }, { status: 500 });
  }
} 