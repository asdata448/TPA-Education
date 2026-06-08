# API Contracts

## Current First-Party Server Interfaces

The project now includes a small set of first-party auth-related server interfaces.

## Login Server Action

**File:** `app/(auth)/login/actions.ts`

### Purpose

Authenticate an Admin or Tutor using Supabase email/password auth, then resolve the user's role from `public.profiles`.

### Input

- `email: string`
- `password: string`

### Output

Union result:

```ts
type LoginResult =
  | { error: string }
  | { redirectUrl: '/dashboard/admin' | '/dashboard/tutor' }
```

### Behavior

1. call `supabase.auth.signInWithPassword()`
2. fetch matching profile from `profiles`
3. validate role with `isUserRole()`
4. return dashboard redirect target
5. return user-facing error on failure

## Middleware / Proxy Contract

**File:** `proxy.ts`

### Protected Route Scope

```text
/dashboard/:path*
```

### Behavior

- refresh Supabase session using `@supabase/ssr`
- if unauthenticated -> redirect to `/login`
- if role lookup fails -> redirect to `/login`
- if Tutor accesses `/dashboard/admin/*` -> redirect to `/dashboard/tutor`
- if Admin accesses dashboard routes -> allow request

## Current External Interaction Modes

- Supabase Auth HTTPS API via `@supabase/supabase-js`
- `tel:` links for phone calls
- `mailto:` links for email
- outbound links to Facebook and Zalo
- Vercel Analytics client integration

## Gaps

- no REST API routes under `app/api`
- no backend endpoint yet for contact form submission
- no public API contract yet for future student/class/schedule workflows
