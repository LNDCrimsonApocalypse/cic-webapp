import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Check if Supabase is configured
  const isConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const isCallbackRoute = req.nextUrl.pathname.startsWith('/auth/callback')
  if (isCallbackRoute) {
    return NextResponse.next()
  }

  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')

  // If Supabase is not configured and trying to access dashboard, redirect to login
  if (!isConfigured && isDashboardPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If Supabase is not configured, allow other routes
  if (!isConfigured) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/admin'

  // If user is not logged in and trying to access dashboard
  if (!session && isDashboardPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Check admin access for admin routes
  if (session && isDashboardPage) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const isAdminRoute =
      req.nextUrl.pathname.startsWith('/dashboard/team') ||
      req.nextUrl.pathname.startsWith('/dashboard/settings')

    if (isAdminRoute && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/admin', '/auth/callback'],
}
