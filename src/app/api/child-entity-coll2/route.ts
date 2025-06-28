import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { CreateLegacyChildEntityColl2Request } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childKey = searchParams.get('childKey');
    let data;
    if (childKey) {
      data = await dataRepository.getChildEntityColl2ByChildKey(childKey);
      if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(data);
    } else {
      data = await dataRepository.getAllChildEntityColl2();
      return NextResponse.json(data);
    }
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return NextResponse.json({ error: 'Failed to fetch child_entity_coll2' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLegacyChildEntityColl2Request = await request.json();
    
    // Validate required fields
    if (!body.child_entity_key || !body.coll2_property1 || typeof body.coll2_property2 !== 'boolean') {
      return NextResponse.json(
        { error: 'child_entity_key, coll2_property1, and coll2_property2 (boolean) are required' },
        { status: 400 }
      );
    }

    // Verify that the parent child entity exists
    const parentChild = await dataRepository.getChildByKey(body.child_entity_key);
    if (!parentChild) {
      return NextResponse.json(
        { error: 'Parent child entity not found' },
        { status: 400 }
      );
    }

    const newItem = await dataRepository.createChildEntityColl2(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating child_entity_coll2 item:', error);
    return NextResponse.json({ error: 'Failed to create child_entity_coll2 item' }, { status: 500 });
  }
} 