# Component Inventory

## Feature Components

| Component | Purpose | Data Source | Interactivity |
| --- | --- | --- | --- |
| `components/site-header.tsx` | Sticky header, nav, CTA, mobile menu | local nav array | scroll + menu state |
| `components/hero-section.tsx` | Hero messaging, visual stats, primary CTA | inline content | animated visuals |
| `components/trust-section.tsx` | Trust signals / proof points | local constants | low |
| `components/tutors-section.tsx` | Tutor profile cards with tabs | `lib/data.ts` | tab switching |
| `components/process-section.tsx` | Consultation process steps | `lib/data.ts` | low |
| `components/about-section.tsx` | Brand/benefit section | local constants | low |
| `components/commitments-section.tsx` | Guarantees / commitments | local constants / `lib/data.ts` style | low |
| `components/parent-report-section.tsx` | Parent communication/reporting value | local constants | low |
| `components/faq-section.tsx` | FAQ disclosure content | `lib/data.ts` | accordion-style UI |
| `components/contact-section.tsx` | Lead form + direct contact channels | local arrays + form input | high |
| `components/floating-cta.tsx` | Persistent conversion CTA | local state | scroll/expand |
| `components/site-footer.tsx` | Footer nav/contact/brand close | local constants | low |

## Shared Data Modules

| Module | Role |
| --- | --- |
| `lib/data.ts` | Static business content repository for tutors, subjects, FAQs, process, commitments |
| `lib/utils.ts` | `cn()` helper for class composition |

## UI Primitive Inventory

The `components/ui/` folder contains a full local design system. Categories observed:

- Inputs/forms: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `form`, `field`, `label`, `switch`, `slider`, `input-otp`
- Overlay/navigation: `dialog`, `drawer`, `sheet`, `popover`, `tooltip`, `dropdown-menu`, `context-menu`, `navigation-menu`, `menubar`, `sidebar`
- Display/layout: `card`, `table`, `tabs`, `accordion`, `badge`, `avatar`, `separator`, `breadcrumb`, `scroll-area`, `pagination`
- Motion/visual polish: `confetti`, `cursor-follower`, `floating-particles`, `glass-card`, `gradient-text`, `magnetic-button`, `parallax-bg`, `progress-path`, `scroll-progress`, `scroll-reveal`, `text-reveal`, `counter-animation`
- Feedback/state: `alert`, `alert-dialog`, `toast`, `toaster`, `sonner`, `spinner`, `skeleton`, `empty`, `progress`

## Components Currently Central to UX

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/tabs.tsx`
- `components/ui/accordion.tsx`
- `components/ui/checkbox.tsx`
- `components/ui/select.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- animation helpers used by hero and contact flows

## Reuse / Maintenance Notes

- UI inventory exceeds current product scope; candidate for pruning or codifying usage policy
- Content rendering relies on static TS arrays rather than CMS-style abstraction
- Contact section is the highest-value component for future backend integration
