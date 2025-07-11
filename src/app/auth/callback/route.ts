import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const next = searchParams.get('next') || '/'

  console.log('Auth callback - URL params:', { 
    code: code?.substring(0, 10), 
    error,
    next,
    hasCode: !!code 
  })

  if (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(`${origin}/?error=auth_failed&details=${encodeURIComponent(error)}`)
  }

  if (code) {
    try {
      const cookieStore = await cookies()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options })
            },
          },
        }
      )
      
      console.log('Attempting to exchange code for session...')
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', {
          message: exchangeError.message,
          status: exchangeError.status,
          details: exchangeError
        })
        return NextResponse.redirect(`${origin}/?error=auth_failed&details=${encodeURIComponent(exchangeError.message)}`)
      }

      console.log('Successfully exchanged code for session:', { 
        userId: data?.user?.id,
        email: data?.user?.email,
        emailConfirmed: data?.user?.email_confirmed_at
      })
      
      // Check if email is confirmed (for email auth)
      if (data?.user && !data.user.email_confirmed_at) {
        console.log('User email not confirmed, redirecting to confirmation page')
        return NextResponse.redirect(`${origin}/?message=check_email`)
      }
      
    } catch (err) {
      console.error('Unexpected error in auth callback:', err)
      return NextResponse.redirect(`${origin}/?error=server_error`)
    }
  }

  // URL to redirect to after sign in process completes
  console.log('Redirecting to:', next)
  return NextResponse.redirect(`${origin}${next}`)
} 