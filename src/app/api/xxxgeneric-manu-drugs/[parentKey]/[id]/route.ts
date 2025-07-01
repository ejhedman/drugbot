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
    const result = await aggregateRepository.updateAggregateRecord('GenericManuDrugs', id, data);
    
    return NextResponse.json({ 
      message: 'Manufactured drug updated successfully',
      manuDrug: result 
    });
  } catch (error) {
    console.error('Error updating manufactured drug:', error);
    return NextResponse.json({ error: 'Failed to update manufactured drug' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ parentKey: string; id: string }> }
) {
  try {
    const { parentKey, id } = await params;
    
    // Delete the aggregate record by UID
    await aggregateRepository.deleteAggregateRecord('GenericManuDrugs', id);
    
    return NextResponse.json({ message: 'Manufactured drug deleted successfully' });
  } catch (error) {
    console.error('Error deleting manufactured drug:', error);
    return NextResponse.json({ error: 'Failed to delete manufactured drug' }, { status: 500 });
  }
} 