import { NextRequest, NextResponse } from 'next/server';
import { getGenericDrugs, getGenericDrugsBySearch } from '@/lib/drug-repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let drugs;
    if (search) {
      drugs = await getGenericDrugsBySearch(search);
    } else {
      drugs = await getGenericDrugs();
    }

    return NextResponse.json(drugs);
  } catch (error) {
    console.error('Error fetching generic drugs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generic drugs' },
      { status: 500 }
    );
  }
} 