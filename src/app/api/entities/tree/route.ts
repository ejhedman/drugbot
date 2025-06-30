import { NextRequest, NextResponse } from 'next/server';
import { entityRepository } from '@/repository';

export async function GET(request: NextRequest) {
  try {
    const treeData = await entityRepository.getEntityTreeData();
    
    return NextResponse.json(treeData);
  } catch (error) {
    console.error('Error fetching tree data:', error);
    return NextResponse.json({ error: 'Failed to fetch tree data' }, { status: 500 });
  }
} 