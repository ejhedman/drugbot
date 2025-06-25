import { NextRequest, NextResponse } from 'next/server';
import { getDrugApprovalsByGenericKey } from '@/lib/drug-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genericKey = searchParams.get('genericKey');

    if (!genericKey) {
      return NextResponse.json(
        { error: 'genericKey parameter is required' },
        { status: 400 }
      );
    }

    const approvals = await getDrugApprovalsByGenericKey(genericKey);
    return NextResponse.json(approvals);
  } catch (error) {
    console.error('Error fetching drug approvals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drug approvals' },
      { status: 500 }
    );
  }
} 