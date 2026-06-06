"use client"

import { useRef, useState, MouseEvent } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface Card3DProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function Card3D({ children, className = "", intensity = 20 }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct * intensity)
    y.set(yPct * intensity)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative transform-style-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: useSpring(useMotionValue(0), { stiffness: 300, damping: 30 }),
        rotateY: useSpring(useMotionValue(0), { stiffness: 300, damping: 30 }),
      }}
      whileHover={{
        scale: 1.02,
        rotateX: -mouseYSpring.get(),
        rotateY: mouseXSpring.get(),
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
      {/* Shine effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}
