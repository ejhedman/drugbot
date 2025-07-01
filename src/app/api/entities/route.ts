import { NextRequest, NextResponse } from 'next/server';
import { entityRepository } from '@/lib/repository';
import { genericDrugsTable } from '@/model_instances/TheDBModel';
import { CreateEntityRequest } from '@/model_defs/DBModel';

// Helper function to get the base URL for internal API calls
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Default to localhost for development
  return 'http://localhost:3000';
}

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
    const body = await request.json();
    // Require: { table: string, properties: object }
    const { table, properties } = body;
    if (!table || !properties) {
      return NextResponse.json({ error: 'Missing table or properties in request body' }, { status: 400 });
    }

    // Call the dynamic create endpoint internally
    const res = await fetch(`${getBaseUrl()}/api/dynamic-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, properties }),
    });

    const result = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: result.error || 'Failed to create entity' }, { status: res.status });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating entity:', error);
    return NextResponse.json({ error: 'Failed to create entity' }, { status: 500 });
  }
} 