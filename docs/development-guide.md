# Development Guide

## Prerequisites

- Node.js 20+ recommended
- npm available (lockfile also suggests pnpm has been used)
- Access to Vercel project if deploying previews/production

## Install

```bash
npm install
```

## Local Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

Note: `package.json` defines a lint script, but dedicated ESLint config was not identified during this scan.

## Important Source Files

- `app/page.tsx` - page assembly
- `app/layout.tsx` - metadata and shell
- `app/globals.css` - theme tokens and utilities
- `lib/data.ts` - editable business content
- `components/contact-section.tsx` - lead capture UX

## Environment Variables Observed

Environment files exist and include values for:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `AUTH0_SECRET`
- `AUTH0_BASE_URL`
- `APP_BASE_URL`
- `AUTH0_CLIENT_ID`
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_CALLBACK_URL`
- `TPA_ADMIN_EMAIL`
- `TPA_ADMIN_USERNAME`
- `TPA_ADMIN_PASSWORD`
- `SUPABASE_SERVICE_ROLE_KEY`

These secrets were not copied into documentation. Current scanned app code does not show active runtime consumption of most of them.

## Content Editing Workflow

- Tutor/FAQ/process/commitment text lives in `lib/data.ts`
- Hero/header/contact/footer sections also embed local content directly
- Brand styling is centralized in `app/globals.css`
- Remote images are embedded in component props rather than a media registry

## Recommended Developer Tasks

- Re-enable strict build failure on TypeScript errors
- Implement real contact submission endpoint/server action
- Remove unused env vars or align them with actual app architecture
- Add test coverage for the contact form and smoke checks for the landing page
