# Deployment Guide

## Current Deployment Shape

- Platform: Vercel
- Project metadata source: `.vercel/project.json`
- Vercel project name: `tpa-education`
- Next.js app deploys as a standard frontend app

## Build / Runtime Commands

```bash
npm run build
npm run start
```

## Config Files

- `next.config.mjs`
- `.vercel/project.json`
- `.env`, `.env.local`

## Notable Deployment Behaviors

- TypeScript build errors are ignored in `next.config.mjs`
- `images.unoptimized = true`, so optimization is disabled
- Vercel Analytics loads only in production

## Deployment Risks

- Ignoring TS errors can let broken code ship
- Secret-heavy `.env.local` should not be treated as documentation or source-of-truth
- No CI workflow found in `.github/workflows/`
- No explicit preview/prod environment matrix documented in repo

## Recommended Hardening

1. Remove `ignoreBuildErrors: true` unless absolutely necessary
2. Audit and rotate unused secrets
3. Add CI checks for build + lint
4. Add a real form submission backend before marketing launch if lead capture is business-critical
