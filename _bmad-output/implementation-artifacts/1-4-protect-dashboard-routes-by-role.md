# Story 1.4: Protect Dashboard Routes by Role

**Identifier:** 1-4-protect-dashboard-routes-by-role
**Epic:** Epic 1 - Authentication and Authorization
**Status:** done
**Priority:** critical
**Dependencies:** 1-3-implement-login-and-session-middleware

---

## Story

As the system,
I want dashboard routes protected by role,
So that users cannot access unauthorized pages.

---

## Acceptance Criteria

**Given** an unauthenticated visitor opens `/dashboard/*`
**When** middleware runs
**Then** the visitor is redirected to `/login`

**And** a Tutor opening `/dashboard/admin/*` is blocked or redirected

**And** an Admin opening `/dashboard/tutor/*` is handled according to role navigation rules

**And** role checks are server-side, not UI-only.

---

## Implementation Context

### Current State

From Story 1-3:
- `proxy.ts` middleware already has session + user fetch scaffold
- `createClient()` from `@/lib/supabase/server` returns typed Supabase client
- Session available via `supabase.auth.getUser()`
- Profile with role in `public.profiles` table

### Files Modified in 1-3

```
app/(auth)/login/actions.ts          ? role-based redirect logic exists
proxy.ts                             ? middleware scaffold with session check
app/dashboard/admin/page.tsx         ? admin dashboard placeholder
app/dashboard/tutor/page.tsx         ? tutor dashboard placeholder
```

### Architecture Decisions

- Use `proxy.ts` middleware for all route protection
- Fetch session + profile once per request
- Redirect unauthenticated ? `/login`
- Block Tutor from `/dashboard/admin/*`
- Allow Admin to view `/dashboard/tutor/*` (per AC: "handled according to role navigation rules")
- Do NOT duplicate auth checks in page components

---

## Tasks

### 1. Enhance Middleware Route Protection

**File:** `proxy.ts`

**Requirements:**
- Match all `/dashboard/*` routes
- Fetch session + user
- If no session ? redirect to `/login`
- Fetch profile with role from `public.profiles`
- If Tutor accessing `/dashboard/admin/*` ? redirect to `/dashboard/tutor` or show 403
- If Admin accessing `/dashboard/tutor/*` ? allow (informational access)
- Return NextResponse.next() for allowed routes

**Edge Cases:**
- Profile not found after auth ? treat as unauthorized
- Inactive users already handled in login action (Story 1-3)

### 2. Remove Redundant Auth Checks from Dashboard Pages

**Files:**
- `app/dashboard/admin/page.tsx`
- `app/dashboard/tutor/page.tsx`

**Action:** Verify no inline auth/role checks remain (already done in Story 1-3)

### 3. Manual Verification

**Tests:**
- Unauthenticated user accessing `/dashboard/admin` ? redirect to `/login`
- Tutor accessing `/dashboard/admin` ? blocked/redirected
- Admin accessing `/dashboard/tutor` ? allowed
- Admin accessing `/dashboard/admin` ? allowed
- Tutor accessing `/dashboard/tutor` ? allowed

---

## Definition of Done

- [x] Middleware protects all `/dashboard/*` routes
- [x] Unauthenticated users redirected to `/login`
- [x] Role-based access enforced server-side in middleware
- [x] Tutor cannot access `/dashboard/admin/*`
- [x] Admin can access all dashboard routes
- [x] No console errors on protected route access
- [x] Build passes: `pnpm run build`
- [x] Manual browser testing confirms all AC scenarios

---

## Notes

- This story completes Epic 1 route protection
- Story 1-3 already removed inline auth checks from pages
- Middleware is the single source of truth for route authorization


