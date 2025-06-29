import { NextRequest, NextResponse } from 'next/server';
import { entityRepository } from '@/lib/repository';
import { CreateEntityRequest } from '@/model_defs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    // const format = searchParams.get('format'); // 'legacy' for LegacyEntity format, default to UIEntity

    let entities;
    if (search) {
      // if (format === 'legacy') {
      //   entities = await dataRepository.searchEntitiesAsUIEntities(search);
      //   // Convert UIEntity back to legacy format if needed - but we'll remove this conversion
      //   // since we're migrating everything to UIEntity
      // } else {
        entities = await entityRepository.searchEntities(search); // Now returns UIEntity[]
      // }
    } else {
      // if (format === 'legacy') {
      //   entities = await dataRepository.getAllEntitiesAsUIEntities();
      //   // Convert UIEntity back to legacy format if needed - but we'll remove this conversion
      //   // since we're migrating everything to UIEntity
      // } else {
        entities = await entityRepository.getAllEntities(); // Now returns UIEntity[]
      // }
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

    const newEntity = await entityRepository.createEntity(body); // Now returns UIEntity
    return NextResponse.json(newEntity, { status: 201 });
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json({ error: 'Failed to create entity' }, { status: 500 });
  }
} 