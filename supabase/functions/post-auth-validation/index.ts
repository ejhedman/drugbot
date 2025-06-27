import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the webhook payload
    const payload = await req.json()
    console.log('Auth webhook payload:', payload)

    // Extract user information
    const { user } = payload
    if (!user) {
      throw new Error('No user data in payload')
    }

    const userEmail = user.email
    const userId = user.id

    console.log(`Validating user: ${userEmail} (${userId})`)

    // Check if user is approved
    const { data: approvedUser, error: approvedError } = await supabaseAdmin
      .from('approved_users')
      .select('email, role, is_active')
      .eq('email', userEmail)
      .eq('is_active', true)
      .single()

    if (approvedError && approvedError.code !== 'PGRST116') { // Not "not found" error
      throw new Error(`Database error: ${approvedError.message}`)
    }

    if (!approvedUser) {
      console.log(`User ${userEmail} is not approved. Signing out.`)
      
      // Sign out the user immediately
      const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(userId)
      if (signOutError) {
        console.error('Error signing out unapproved user:', signOutError)
      }

      return new Response(
        JSON.stringify({ 
          error: 'Access denied', 
          message: 'Your account is not approved for access. Please contact an administrator.' 
        }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`User ${userEmail} is approved with role: ${approvedUser.role}`)

    // Update user metadata with role
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...user.user_metadata,
          role: approvedUser.role,
          approved: true,
          approved_at: new Date().toISOString()
        }
      }
    )

    if (updateError) {
      console.error('Error updating user metadata:', updateError)
      throw new Error(`Failed to update user: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User approved with role: ${approvedUser.role}` 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Auth validation error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 