import { NextRequest, NextResponse } from 'next/server';
import { entityRepository } from '@/lib/repository';
import { genericDrugsTable } from '@/model_instances/TheDBModel';
import { CreateEntityRequest } from '@/model_defs/DBModel';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let entities;
    if (search) {
      entities = await entityRepository.searchEntities(search, genericDrugsTable); // Now returns UIEntity[]
    } else {
      entities = await entityRepository.getAllEntities(genericDrugsTable); // Now returns UIEntity[]
    }

    return NextResponse.json(entities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    return NextResponse.json({ error: 'Failed to fetch entities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEntityRequest = await request.json();
    
    // Validate required fields
    if (!body.displayName) {
      return NextResponse.json(
        { error: 'entity_name is required' },
        { status: 400 }
      );
    }

    const newEntity = await entityRepository.createEntity(body, genericDrugsTable); // Now returns UIEntity
    return NextResponse.json(newEntity, { status: 201 });
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json({ error: 'Failed to create entity' }, { status: 500 });
  }
} 