import { NextRequest, NextResponse } from 'next/server';
import { getManufacturerDrugsByGenericKey } from '@/lib/drug-repository';

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

    const drugs = await getManufacturerDrugsByGenericKey(genericKey);
    return NextResponse.json(drugs);
  } catch (error) {
    console.error('Error fetching manufacturer drugs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manufacturer drugs' },
      { status: 500 }
    );
  }
} 