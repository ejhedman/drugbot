import { NextRequest, NextResponse } from 'next/server';
import { entityRepository } from '@/repository';
import { genericDrugsTable } from '@/model_instances/TheDBModel';
import { UpdateEntityRequest } from '@/model_defs/DBModel';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    const entity = await entityRepository.getEntityByKey(key, genericDrugsTable); // Now returns UIEntity
    
    if (!entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    return NextResponse.json(entity);
  } catch (error) {
    console.error('Error fetching entity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body: UpdateEntityRequest = await request.json();
    
    const updatedEntity = await entityRepository.updateEntity(key, body, genericDrugsTable); // Now returns UIEntity
    
    if (!updatedEntity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEntity);
  } catch (error) {
    console.error('Error updating entity:', error);
    return NextResponse.json({ error: 'Failed to update entity' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const deleted = await entityRepository.deleteEntity(key, genericDrugsTable);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Entity deleted successfully' });
  } catch (error) {
    console.error('Error deleting entity:', error);
    return NextResponse.json({ error: 'Failed to delete entity' }, { status: 500 });
  }
} 