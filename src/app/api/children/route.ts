import { NextRequest, NextResponse } from 'next/server';
import { entityRepository } from '@/repository';
import { UIEntity } from '@/model_defs';
import { CreateChildEntityRequest } from '@/model_defs/DBModel';
import { genericDrugsTable, manuDrugsTable } from '@/model_instances/TheDBModel';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityUid = searchParams.get('entityUid');
    const search = searchParams.get('search');

    let children: UIEntity[];
    if (entityUid) {
      children = await entityRepository.getChildUIEntitiesByParentUid(entityUid, manuDrugsTable);
    } else if (search) {
      // Use the unified searchEntities method from entityRepository
      children = await entityRepository.searchEntities(search, manuDrugsTable);
    } else {
      // Get all children - this might need a new method or different approach
      children = [];
    }

    return NextResponse.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    
    // Verify that the parent entity exists
    const parentEntity = await entityRepository.getEntityByUid(body.parent_entity_uid, genericDrugsTable);
    if (!parentEntity) {
      return NextResponse.json(
        { error: 'Parent entity not found' }, 
        { status: 404 }
      );
    }

    // Validate required fields
    if (!body.parent_entity_uid || !body.displayName) {
      return NextResponse.json(
        { error: 'parent_entity_uid and displayName are required' },
        { status: 400 }
      );
    }

    const child = await entityRepository.createChildEntity(body, manuDrugsTable);
    
    // Return UIEntity format if requested, otherwise return the raw child data
    if (format === 'ui') {
      return NextResponse.json(child, { status: 201 });
    } else {
      return NextResponse.json(child, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating child entity:', error);
    return NextResponse.json({ error: 'Failed to create child entity' }, { status: 500 });
  }
} 