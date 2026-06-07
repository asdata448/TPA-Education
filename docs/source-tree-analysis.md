# Source Tree Analysis

## Annotated Tree

```text
TPA-Education/
|-- app/                    # Next.js App Router entry layer
|   |-- globals.css         # Active design tokens, motion, accessibility, utilities
|   |-- layout.tsx          # Root shell, metadata, analytics, skip link
|   `-- page.tsx            # Landing page composition
|-- components/             # Feature sections + shared UI primitives
|   |-- ui/                 # Local shadcn/Radix component library + animated helpers
|   |-- site-header.tsx     # Fixed nav, mobile menu, CTA
|   |-- hero-section.tsx    # Top-of-page positioning, stats, CTA
|   |-- tutors-section.tsx  # Tutor cards driven by lib/data.ts
|   |-- contact-section.tsx # Lead form UI and contact methods
|   `-- ...                 # Remaining marketing sections/footer/CTA blocks
|-- hooks/                  # Duplicated/shared hooks (`use-mobile`, `use-toast`)
|-- lib/                    # Static content + helper utilities
|   |-- data.ts             # Tutors, subjects, FAQs, process, commitments
|   `-- utils.ts            # Tailwind class merge helper
|-- public/                 # Static local images/icons/placeholders
|-- styles/                 # Legacy global CSS candidate; likely unused by App Router path
|-- docs/                   # Generated project knowledge docs
|-- _bmad/                  # BMad workflow config/scripts
|-- _bmad-output/           # BMad generated artifacts
|-- .vercel/                # Vercel project linkage
|-- package.json            # Scripts + dependency manifest
|-- next.config.mjs         # Next runtime/build config
|-- tsconfig.json           # TypeScript config
`-- README.md               # Basic setup + v0 linkage
```

## Critical Folders

- `app/` -> primary application entry surface
- `components/` -> feature implementation layer
- `components/ui/` -> reusable UI system foundation
- `lib/` -> content model and shared helper layer
- `public/` -> static assets used by browser directly
- `.vercel/` -> deployment/project identity metadata
- `docs/` -> AI retrieval/documentation output target

## Entry Points

- `app/layout.tsx` -> HTML shell and global behaviors
- `app/page.tsx` -> main route rendering
- `package.json` scripts -> `dev`, `build`, `start`, `lint`

## Integration Notes

- No server folder, API route folder, or DB layer found
- External communication is link-based only (phone/mail/social)
- Remote assets load through `next/image` with unoptimized config

## Structural Observations

- UI kit inventory is much broader than current page usage
- `hooks/` duplicates functionality also found in `components/ui/`
- `styles/globals.css` looks like an older baseline and may be dead code
