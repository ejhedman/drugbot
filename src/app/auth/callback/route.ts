import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  console.log('Auth callback - URL params:', { code: code?.substring(0, 10), error })

  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
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

      console.log('Successfully exchanged code for session:', { userId: data?.user?.id })
      
    } catch (err) {
      console.error('Unexpected error in auth callback:', err)
      return NextResponse.redirect(`${origin}/?error=server_error`)
    }
  }

  // URL to redirect to after sign in process completes
  console.log('Redirecting to home page')
  return NextResponse.redirect(`${origin}/`)
} 