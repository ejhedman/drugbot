import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get reports - user's reports first, then public reports
    const { data: reports, error } = await supabase
      .from('reports')
      .select('uid, name, display_name, owner_uid, is_public, report_type, report_definition, created_at, updated_at')
      .or(`owner_uid.eq.${user.id},is_public.eq.true`)
      .order('owner_uid', { ascending: false }) // User's reports first
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Reports GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, display_name, is_public, report_type, report_definition } = body;

    // Validate required fields
    if (!name || !display_name || !report_definition) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new report
    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        name,
        display_name,
        owner_uid: user.id,
        is_public: is_public || false,
        report_type,
        report_definition
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating report:', error);
      return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Reports POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { uid, name, display_name, is_public, report_definition } = body;

    if (!uid) {
      return NextResponse.json({ error: 'Report UID is required' }, { status: 400 });
    }

    // Update report (only if user owns it)
    const { data: report, error } = await supabase
      .from('reports')
      .update({
        name,
        display_name,
        is_public,
        report_definition
      })
      .eq('uid', uid)
      .eq('owner_uid', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating report:', error);
      return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
    }

    if (!report) {
      return NextResponse.json({ error: 'Report not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Reports PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'Report UID is required' }, { status: 400 });
    }

    // Delete report (only if user owns it)
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('uid', uid)
      .eq('owner_uid', user.id);

    if (error) {
      console.error('Error deleting report:', error);
      return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reports DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 