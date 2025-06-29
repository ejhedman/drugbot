import { NextRequest, NextResponse } from 'next/server';
import { entityRepository, childEntityRepository } from '@/lib/repository';
import { CreateChildEntityRequest } from '@/model_defs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');
    const search = searchParams.get('search');
    // const format = searchParams.get('format'); // 'ui' for UIEntity format, default to legacy

    let children;
    if (entityKey) {
      // if (format === 'ui') {
        children = await childEntityRepository.getChildrenAsUIEntitiesByEntityKey(entityKey);
      // } else {
      //   children = await dataRepository.getChildrenByEntityKey(entityKey);
      // }
    } else if (search) {
      // if (format === 'ui') {
        children = await childEntityRepository.searchChildrenAsUIEntities(search);
      // } else {
      //   children = await dataRepository.searchChildren(search);
      // }
    } 
    else {
      throw new Error('no usable arguments');
    //   // if (format === 'ui') {
    //     children = await childEntityRepository.getAllChildrenAsUIEntities();
    //   // } else {
    //   //   children = await dataRepository.getAllChildren();
    //   // }
    }

    return NextResponse.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // const { searchParams } = new URL(request.url);
    // const format = searchParams.get('format'); // 'ui' for UIEntity format, default to legacy
    
    const body: CreateChildEntityRequest = await request.json();
    
    // Validate required fields
    if (!body.parent_entity_key || !body.displayName || !body.child_entity_property1) {
      return NextResponse.json(
        { error: 'entity_key, child_entity_name, and child_entity_property1 are required' },
        { status: 400 }
      );
    }

    // Verify that the parent entity exists
    const parentEntity = await entityRepository.getEntityByKey(body.parent_entity_key);
    if (!parentEntity) {
      return NextResponse.json(
        { error: 'Parent entity not found' },
        { status: 400 }
      );
    }

    const newChild = await childEntityRepository.createChildEntityAsUIEntity(body);
    
    return NextResponse.json(newChild, { status: 201 });
  } catch (error) {
    console.error('Error creating child entity:', error);
    return NextResponse.json({ error: 'Failed to create child entity' }, { status: 500 });
  }
} 