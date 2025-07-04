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

    // Get all select lists (all are public)
    const { data: selectLists, error } = await supabase
      .from('select_lists')
      .select('uid, name, display_name, items, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching select lists:', error);
      return NextResponse.json({ error: 'Failed to fetch select lists' }, { status: 500 });
    }

    return NextResponse.json({ selectLists });
  } catch (error) {
    console.error('Select lists GET error:', error);
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
    const { name, display_name, items } = body;

    // Validate required fields
    if (!name || !display_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new select list
    const { data: selectList, error } = await supabase
      .from('select_lists')
      .insert({
        name,
        display_name,
        items: items || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating select list:', error);
      return NextResponse.json({ error: 'Failed to create select list' }, { status: 500 });
    }

    return NextResponse.json({ selectList });
  } catch (error) {
    console.error('Select lists POST error:', error);
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
    const { uid, name, display_name, items } = body;

    if (!uid) {
      return NextResponse.json({ error: 'Select list UID is required' }, { status: 400 });
    }

    // Update select list (any authenticated user can update any list)
    const { data: selectList, error } = await supabase
      .from('select_lists')
      .update({
        name,
        display_name,
        items
      })
      .eq('uid', uid)
      .select()
      .single();

    if (error) {
      console.error('Error updating select list:', error);
      return NextResponse.json({ error: 'Failed to update select list' }, { status: 500 });
    }

    if (!selectList) {
      return NextResponse.json({ error: 'Select list not found' }, { status: 404 });
    }

    return NextResponse.json({ selectList });
  } catch (error) {
    console.error('Select lists PUT error:', error);
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
      return NextResponse.json({ error: 'Select list UID is required' }, { status: 400 });
    }

    // Delete select list (any authenticated user can delete any list)
    const { error } = await supabase
      .from('select_lists')
      .delete()
      .eq('uid', uid);

    if (error) {
      console.error('Error deleting select list:', error);
      return NextResponse.json({ error: 'Failed to delete select list' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Select lists DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 