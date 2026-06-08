import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isTutor, isUserRole } from '@/lib/auth/role'
import { requiredPublicEnv } from '@/lib/env'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    requiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, active')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || !isUserRole(profile.role)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith('/dashboard/admin')
  const isTutorRoute = pathname.startsWith('/dashboard/tutor')

  if (isTutor(profile.role) && !profile.active && isTutorRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('reason', 'inactive')
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute && isTutor(profile.role)) {
    const tutorUrl = request.nextUrl.clone()
    tutorUrl.pathname = '/dashboard/tutor'
    return NextResponse.redirect(tutorUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
