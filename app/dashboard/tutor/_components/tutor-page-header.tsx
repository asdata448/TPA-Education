import type { ReactNode } from 'react'
import { TUTOR_COLORS, type LucideIcon, type TutorColorKey } from './tutor-theme'

interface TutorPageHeaderProps {
  /** Module color identity — should match the page''s sidebar entry */
  color: TutorColorKey
  title: string
  subtitle?: string
  icon?: LucideIcon
  /** Optional action slot rendered on the right (e.g. a button) */
  children?: ReactNode
}

/**
 * Editorial page header — Notion-warm aesthetic.
 *
 * Flat (no box): a small solid colored icon chip + a serif navy display
 * title + a muted slate subtitle + a thin gold rule as the hero accent.
 * The module color lives only in the small chip; warmth and elegance come
 * from the serif type, the cream canvas behind it, and the gold rule.
 *
 * Responsive: on mobile, the action slot stacks below the title row to
 * avoid cramping; on `sm` and up it sits on the right as before.
 */
export function TutorPageHeader({ color, title, subtitle, icon: Icon, children }: TutorPageHeaderProps) {
  const c = TUTOR_COLORS[color]
  return (
    <div className="px-0.5 py-1 md:px-1.5 md:py-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${c.chip} md:h-12 md:w-12`}>
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold leading-tight tracking-tight text-[#0F2A44] dark:text-[#F8F5EC] md:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 [&>*]:w-full sm:w-auto sm:pt-1 sm:[&>*]:w-auto">
            {children}
          </div>
        )}
      </div>
      {/* Hero accent: a short thin gold rule */}
      <div className="mt-3 h-[3px] w-16 rounded-full bg-[#D8B76A]" />
    </div>
  )
}
