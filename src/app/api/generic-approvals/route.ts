import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { GenericApproval } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');

    if (!entityKey) {
      return NextResponse.json({ error: 'entityKey parameter is required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('generic_approvals')
      .select('*')
      .eq('generic_key', entityKey)
      .order('approval_date', { ascending: false });

    if (error) {
      console.error('Error fetching generic approvals:', error);
      return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
    }

    // Transform data to match GenericApproval interface
    const approvals: GenericApproval[] = (data || []).map((item: any) => ({
      uid: item.uid,
      row: item.row,
      generic_key: item.generic_key,
      generic_uid: item.generic_uid,
      route_type: item.route_type,
      country: item.country,
      indication: item.indication,
      populations: item.populations,
      approval_date: item.approval_date,
      discon_date: item.discon_date,
      box_warning: item.box_warning,
      box_warning_date: item.box_warning_date
    }));

    return NextResponse.json(approvals);
  } catch (error) {
    console.error('Error in generic-approvals API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 