import type { LucideIcon } from 'lucide-react'

/**
 * Central color system for the Tutor area.
 * Each module gets one of these color keys, used by the glass page header,
 * sidebar active state and icon chips — so every page reads as a distinct
 * "color identity" while staying on a shared system.
 *
 * Design language: GLASS. A frosted white card (bg-white/70 backdrop-blur)
 * carries a solid colored icon chip + a soft colored halo glow behind it +
 * a solid colored left accent bar. Title/subtitle stay neutral & dark for
 * contrast. The strong color lives in small accents, not a flooded band.
 *
 * NOTE: every Tailwind class below is a FULL literal string (no interpolation)
 * so the v4 scanner picks them up.
 */
export type TutorColorKey =
  | 'amber'
  | 'blue'
  | 'teal'
  | 'emerald'
  | 'violet'
  | 'orange'
  | 'pink'
  | 'rose'
  | 'indigo'

export interface TutorColorSet {
  /** Solid colored left accent bar: used with `border-l-4 <accent>` */
  accent: string
  /** Solid icon chip: colored bg, white icon/text */
  chip: string
  /** Soft colored halo blob behind the icon: `<halo> blur-2xl` */
  halo: string
  /** Icon-only color (sidebar inactive icon) */
  text: string
  /** data-[active=true] overrides for the sidebar button (full literals) */
  activeClass: string
}

export const TUTOR_COLORS: Record<TutorColorKey, TutorColorSet> = {
  amber: {
    accent: 'border-l-amber-500',
    chip: 'bg-amber-500 text-white',
    halo: 'bg-amber-400/30',
    text: 'text-amber-600 dark:text-amber-400',
    activeClass: 'data-[active=true]:bg-amber-500 data-[active=true]:text-white',
  },
  blue: {
    accent: 'border-l-blue-500',
    chip: 'bg-blue-500 text-white',
    halo: 'bg-blue-400/30',
    text: 'text-blue-600 dark:text-blue-400',
    activeClass: 'data-[active=true]:bg-blue-600 data-[active=true]:text-white',
  },
  teal: {
    accent: 'border-l-teal-500',
    chip: 'bg-teal-500 text-white',
    halo: 'bg-teal-400/30',
    text: 'text-teal-600 dark:text-teal-400',
    activeClass: 'data-[active=true]:bg-teal-600 data-[active=true]:text-white',
  },
  emerald: {
    accent: 'border-l-emerald-500',
    chip: 'bg-emerald-500 text-white',
    halo: 'bg-emerald-400/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    activeClass: 'data-[active=true]:bg-emerald-600 data-[active=true]:text-white',
  },
  violet: {
    accent: 'border-l-violet-500',
    chip: 'bg-violet-500 text-white',
    halo: 'bg-violet-400/30',
    text: 'text-violet-600 dark:text-violet-400',
    activeClass: 'data-[active=true]:bg-violet-600 data-[active=true]:text-white',
  },
  orange: {
    accent: 'border-l-orange-500',
    chip: 'bg-orange-500 text-white',
    halo: 'bg-orange-400/30',
    text: 'text-orange-600 dark:text-orange-400',
    activeClass: 'data-[active=true]:bg-orange-500 data-[active=true]:text-white',
  },
  pink: {
    accent: 'border-l-pink-500',
    chip: 'bg-pink-500 text-white',
    halo: 'bg-pink-400/30',
    text: 'text-pink-600 dark:text-pink-400',
    activeClass: 'data-[active=true]:bg-pink-600 data-[active=true]:text-white',
  },
  rose: {
    accent: 'border-l-rose-500',
    chip: 'bg-rose-500 text-white',
    halo: 'bg-rose-400/30',
    text: 'text-rose-600 dark:text-rose-400',
    activeClass: 'data-[active=true]:bg-rose-600 data-[active=true]:text-white',
  },
  indigo: {
    accent: 'border-l-indigo-500',
    chip: 'bg-indigo-500 text-white',
    halo: 'bg-indigo-400/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    activeClass: 'data-[active=true]:bg-indigo-600 data-[active=true]:text-white',
  },
}

export type { LucideIcon }
