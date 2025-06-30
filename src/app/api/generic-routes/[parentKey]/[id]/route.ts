import { NextRequest, NextResponse } from 'next/server';
import { aggregateRepository } from '@/lib/repository';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ parentKey: string; id: string }> }
) {
  try {
    const { parentKey, id } = await params;
    const data = await request.json();
    
    // Update the aggregate record by UID
    const result = await aggregateRepository.updateAggregateRecord('GenericRoute', id, data);
    
    return NextResponse.json({ 
      message: 'Route updated successfully',
      route: result 
    });
  } catch (error) {
    console.error('Error updating route:', error);
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ parentKey: string; id: string }> }
) {
  try {
    const { parentKey, id } = await params;
    
    // Delete the aggregate record by UID
    await aggregateRepository.deleteAggregateRecord('GenericRoute', id);
    
    return NextResponse.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
} 