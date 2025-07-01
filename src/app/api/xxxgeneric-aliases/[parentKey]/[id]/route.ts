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
    const result = await aggregateRepository.updateAggregateRecord('GenericAlias', id, data);
    
    return NextResponse.json({ 
      message: 'Alias updated successfully',
      alias: result 
    });
  } catch (error) {
    console.error('Error updating alias:', error);
    return NextResponse.json({ error: 'Failed to update alias' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ parentKey: string; id: string }> }
) {
  try {
    const { parentKey, id } = await params;
    
    console.log('DELETE /api/generic-aliases/[parentKey]/[id] - parentKey:', parentKey, 'id:', id);
    
    // Delete the aggregate record by UID
    await aggregateRepository.deleteAggregateRecord('GenericAlias', id);
    
    console.log('DELETE /api/generic-aliases/[parentKey]/[id] - Successfully deleted alias with id:', id);
    
    return NextResponse.json({ message: 'Alias deleted successfully' });
  } catch (error) {
    console.error('Error deleting alias:', error);
    return NextResponse.json({ error: 'Failed to delete alias' }, { status: 500 });
  }
} 