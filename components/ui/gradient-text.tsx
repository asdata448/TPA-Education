"use client"

import { motion } from "framer-motion"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
  colors?: string[]
  duration?: number
}

export function GradientText({
  children,
  className = "",
  animate = true,
  colors = ["#D8B76A", "#0F2A44", "#D8B76A"],
  duration = 3,
}: GradientTextProps) {
  const gradientStyle = {
    background: `linear-gradient(to right, ${colors.join(", ")})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }

  if (animate) {
    return (
      <motion.span
        className={`inline-block ${className}`}
        style={gradientStyle}
        animate={{
          backgroundPosition: ["0%", "100%", "0%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
      </motion.span>
    )
  }

  return (
    <span className={`inline-block ${className}`} style={gradientStyle}>
      {children}
    </span>
  )
}
