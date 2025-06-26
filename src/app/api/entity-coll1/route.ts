import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { CreateEntityColl1Request } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');
    let data;
    if (entityKey) {
      data = await dataRepository.getEntityColl1ByEntityKey(entityKey);
      if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(data);
    } else {
      data = await dataRepository.getAllEntityColl1();
      return NextResponse.json(data);
    }
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return NextResponse.json({ error: 'Failed to fetch entity_coll1' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEntityColl1Request = await request.json();
    
    // Validate required fields
    if (!body.entity_key || !body.coll1_property1 || !body.coll1_property2 || typeof body.coll1_property3 !== 'number') {
      return NextResponse.json(
        { error: 'entity_key, coll1_property1, coll1_property2, and coll1_property3 (number) are required' },
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

    const newItem = await dataRepository.createEntityColl1(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating entity_coll1 item:', error);
    return NextResponse.json({ error: 'Failed to create entity_coll1 item' }, { status: 500 });
  }
} 