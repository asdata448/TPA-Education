"use client"

import { motion } from "framer-motion"
import { ReactNode, useState } from "react"
import { Award, Star, Trophy, CheckCircle } from "lucide-react"

interface AnimatedBadgeProps {
  icon?: "award" | "star" | "trophy" | "check" | "custom"
  customIcon?: ReactNode
  children: ReactNode
  className?: string
  trigger?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "gold" | "silver" | "bronze" | "blue" | "green"
}

const sizes = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
}

const variants = {
  gold: "from-yellow-400 to-yellow-600",
  silver: "from-gray-300 to-gray-500",
  bronze: "from-orange-400 to-orange-600",
  blue: "from-blue-400 to-blue-600",
  green: "from-green-400 to-green-600",
}

const icons = {
  award: Award,
  star: Star,
  trophy: Trophy,
  check: CheckCircle,
}

export function AnimatedBadge({
  icon,
  customIcon,
  children,
  className = "",
  trigger = true,
  size = "md",
  variant = "gold",
}: AnimatedBadgeProps) {
  const [hasTriggered, setHasTriggered] = useState(false)

  const handleTrigger = () => {
    if (trigger && !hasTriggered) {
      setHasTriggered(true)
      // Reset after animation
      setTimeout(() => setHasTriggered(false), 2000)
    }
  }

  const IconComponent = icon ? icons[icon] : null

  return (
    <motion.div
      className={`relative inline-flex items-center gap-3 ${className}`}
      onClick={handleTrigger}
      initial={false}
      animate={hasTriggered ? "celebrate" : "idle"}
      variants={{
        idle: { scale: 1, rotate: 0 },
        celebrate: {
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.6 },
        },
      }}
    >
      {/* Icon with glow effect */}
      <motion.div
        className={`${sizes[size]} rounded-full bg-gradient-to-br ${variants[variant]} flex items-center justify-center text-white shadow-lg`}
        animate={hasTriggered ? {
          scale: [1, 1.3, 1],
          rotate: [0, 360],
        } : {}}
        transition={{ duration: 0.8 }}
      >
        {IconComponent ? <IconComponent className="w-1/2 h-1/2" /> : customIcon}
      </motion.div>

      {/* Confetti sparks */}
      {hasTriggered && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 50],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 50],
                opacity: [1, 0],
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </>
      )}

      {/* Badge content */}
      <div className="flex flex-col">
        {children}
      </div>
    </motion.div>
  )
}

// Pop animation for badges
export function PopBadge({
  children,
  className = "",
  trigger = false,
}: {
  children: ReactNode
  className?: string
  trigger?: boolean
}) {
  return (
    <motion.div
      className={className}
      animate={trigger ? "pop" : "idle"}
      variants={{
        idle: { scale: 1 },
        pop: {
          scale: [1, 1.2, 0.9, 1.1, 1],
          transition: { duration: 0.5 },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Bounce animation for achievements
export function BounceBadge({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        type: "spring",
        stiffness: 400,
        damping: 10,
      }}
    >
      {children}
    </motion.div>
  )
}
