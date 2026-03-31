import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
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

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
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

  // Check admin access for admin routes (if you add /admin/dashboard, etc.)
  if (session && isDashboardPage) {
    // Fetch user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // If accessing admin-specific routes (you can add more conditions)
    const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard/team') ||
                        req.nextUrl.pathname.startsWith('/dashboard/settings')
    
    if (isAdminRoute && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/admin', '/auth/callback']
}
