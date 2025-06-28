import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');
    
    const supabase = await createServerSupabaseClient();
    
    let query = supabase
      .from('generic_aliases')
      .select('*');
    
    if (entityKey) {
      query = query.eq('generic_key', entityKey);
    }
    
    const { data, error } = await query.order('alias');
    
    if (error) {
      console.error('Error fetching aliases:', error);
      return NextResponse.json({ error: 'Failed to fetch aliases' }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in aliases API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 