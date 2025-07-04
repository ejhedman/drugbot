import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: 'Report slug is required' }, { status: 400 });
    }

    // Get report by name (slug) - user's reports first, then public reports
    const { data: report, error } = await supabase
      .from('reports')
      .select('uid, name, display_name, owner_uid, is_public, report_type, report_definition, created_at, updated_at')
      .eq('name', slug)
      .or(`owner_uid.eq.${user.id},is_public.eq.true`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Report not found' }, { status: 404 });
      }
      console.error('Error fetching report:', error);
      return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
    }

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Report GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 