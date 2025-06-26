import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/repository';
import { CreateEntityRequest } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let entities;
    if (search) {
      entities = await dataRepository.searchEntities(search);
    } else {
      entities = await dataRepository.getAllEntities();
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
    if (!body.entity_name || !body.entity_property1) {
      return NextResponse.json(
        { error: 'entity_name and entity_property1 are required' },
        { status: 400 }
      );
    }

    const newEntity = await dataRepository.createEntity(body);
    return NextResponse.json(newEntity, { status: 201 });
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json({ error: 'Failed to create entity' }, { status: 500 });
  }
} 