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
    const result = await aggregateRepository.updateAggregateRecord('GenericApproval', id, data);
    
    return NextResponse.json({ 
      message: 'Approval updated successfully',
      approval: result 
    });
  } catch (error) {
    console.error('Error updating approval:', error);
    return NextResponse.json({ error: 'Failed to update approval' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ parentKey: string; id: string }> }
) {
  try {
    const { parentKey, id } = await params;
    
    // Delete the aggregate record by UID
    await aggregateRepository.deleteAggregateRecord('GenericApproval', id);
    
    return NextResponse.json({ message: 'Approval deleted successfully' });
  } catch (error) {
    console.error('Error deleting approval:', error);
    return NextResponse.json({ error: 'Failed to delete approval' }, { status: 500 });
  }
} 