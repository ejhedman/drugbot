import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Get all approved users (data_editor only)
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated and has data_editor role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = user.user_metadata?.role
    if (userRole !== 'data_editor') {
      return NextResponse.json({ error: 'Forbidden - Data editor role required' }, { status: 403 })
    }

    // Fetch approved users using service role to bypass RLS
    const supabaseService = createServiceClient()
    const { data: approvedUsers, error } = await supabaseService
      .from('approved_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ users: approvedUsers })

  } catch (error) {
    console.error('Error fetching approved users:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Add new approved user (data_editor only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check if user is authenticated and has data_editor role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = user.user_metadata?.role
    if (userRole !== 'data_editor') {
      return NextResponse.json({ error: 'Forbidden - Data editor role required' }, { status: 403 })
    }

    const body = await request.json()
    const { email, role = 'readonly', github_username, notes } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Add user using service role to bypass RLS
    const supabaseService = createServiceClient()
    const { data: newUser, error } = await supabaseService
      .from('approved_users')
      .insert({
        email,
        role,
        github_username,
        notes,
        approved_by: user.email
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ user: newUser }, { status: 201 })

  } catch (error) {
    console.error('Error adding approved user:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 