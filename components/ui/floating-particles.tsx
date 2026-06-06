"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

interface FloatingParticlesProps {
  count?: number
  className?: string
  colors?: string[]
}

export function FloatingParticles({
  count = 20,
  className = "",
  colors = ["#D8B76A", "#0F2A44", "#F8F5EC"],
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    setParticles(newParticles)
  }, [count])

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
            opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Simple floating shapes
export function FloatingShapes({
  className = "",
}: {
  className?: string
}) {
  const shapes = [
    { type: "circle", size: 60, color: "bg-[#D8B76A]/10", top: "10%", left: "5%" },
    { type: "square", size: 40, color: "bg-[#0F2A44]/10", top: "20%", right: "10%" },
    { type: "circle", size: 80, color: "bg-[#D8B76A]/5", bottom: "15%", left: "15%" },
    { type: "triangle", size: 50, color: "bg-[#0F2A44]/5", top: "60%", right: "20%" },
  ]

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.color}`}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left || (shape.right && `calc(100% - ${shape.right})`),
            borderRadius: shape.type === "circle" ? "50%" : shape.type === "triangle" ? "0" : "8px",
            clipPath: shape.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
