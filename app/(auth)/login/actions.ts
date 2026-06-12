'use server'

import { isAdmin, isTutor, isUserRole } from '@/lib/auth/role'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type LoginResult =
  | { error: string }
  | { redirectUrl: '/dashboard/admin' | '/dashboard/tutor' }

export async function login(email: string, password: string): Promise<LoginResult> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return { error: 'Invalid email or password' }
  }

  if (!authData.user) {
    return { error: 'Authentication failed' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, active')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    await supabase.auth.signOut()
    return { error: 'Unable to retrieve user profile' }
  }

  if (!isUserRole(profile.role)) {
    await supabase.auth.signOut()
    return { error: 'User profile has an invalid role' }
  }

  if (!profile.active) {
    await supabase.auth.signOut()
    return { error: 'Your account is inactive. Please contact an administrator.' }
  }

  if (isAdmin(profile.role)) {
    return { redirectUrl: '/dashboard/admin' }
  }

  if (isTutor(profile.role)) {
    return { redirectUrl: '/dashboard/tutor' }
  }

  await supabase.auth.signOut()
  return { error: 'Unable to determine dashboard access for this account' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

