import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { CreateChildEntityRequest } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');
    const search = searchParams.get('search');

    let children;
    if (entityKey) {
      children = await dataRepository.getChildrenByEntityKey(entityKey);
    } else if (search) {
      children = await dataRepository.searchChildren(search);
    } else {
      children = await dataRepository.getAllChildren();
    }

    return NextResponse.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateChildEntityRequest = await request.json();
    
    // Validate required fields
    if (!body.entity_key || !body.child_entity_name || !body.child_entity_property1) {
      return NextResponse.json(
        { error: 'entity_key, child_entity_name, and child_entity_property1 are required' },
        { status: 400 }
      );
    }

    // Verify that the parent entity exists
    const parentEntity = await dataRepository.getEntityByKey(body.entity_key);
    if (!parentEntity) {
      return NextResponse.json(
        { error: 'Parent entity not found' },
        { status: 400 }
      );
    }

    const newChild = await dataRepository.createChildEntity(body);
    return NextResponse.json(newChild, { status: 201 });
  } catch (error) {
    console.error('Error creating child entity:', error);
    return NextResponse.json({ error: 'Failed to create child entity' }, { status: 500 });
  }
} 