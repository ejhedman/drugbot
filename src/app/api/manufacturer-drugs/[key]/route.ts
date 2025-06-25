import { NextRequest, NextResponse } from 'next/server';
import { getManufacturerDrugByKey } from '@/lib/drug-repository';

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const drug = await getManufacturerDrugByKey(params.key);
    
    if (!drug) {
      return NextResponse.json(
        { error: 'Manufacturer drug not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(drug);
  } catch (error) {
    console.error('Error fetching manufacturer drug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manufacturer drug' },
      { status: 500 }
    );
  }
} 