"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  intensity?: "light" | "medium" | "heavy"
  blur?: string
  opacity?: string
  border?: boolean
}

export function GlassCard({
  children,
  className = "",
  intensity = "medium",
  blur = "12px",
  opacity = "0.1",
  border = true,
}: GlassCardProps) {
  const intensityStyles = {
    light: {
      bg: "bg-white/40",
      border: "border-white/30",
    },
    medium: {
      bg: "bg-white/20",
      border: "border-white/40",
    },
    heavy: {
      bg: "bg-white/10",
      border: "border-white/50",
    },
  }

  const styles = intensityStyles[intensity]

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={className}
    >
      <Card
        className={`${styles.bg} backdrop-blur-${blur} ${border ? styles.border : "border-0"} shadow-xl`}
      >
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Glassmorphism for modals and overlays
export function GlassModal({
  children,
  className = "",
  blur = "20px",
}: {
  children: ReactNode
  className?: string
  blur?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-white/20 backdrop-blur-${blur} border border-white/30 rounded-2xl shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Glass effect for navigation
export function GlassNav({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <nav
      className={`bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 ${className}`}
    >
      {children}
    </nav>
  )
}
