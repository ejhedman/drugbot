import { NextRequest, NextResponse } from 'next/server';
import { getDrugAliasesByGenericKey } from '@/lib/drug-repository';

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

    const aliases = await getDrugAliasesByGenericKey(genericKey);
    return NextResponse.json(aliases);
  } catch (error) {
    console.error('Error fetching drug aliases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drug aliases' },
      { status: 500 }
    );
  }
} 