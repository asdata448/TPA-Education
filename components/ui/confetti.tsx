"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiProps {
  trigger: boolean
  duration?: number
  particleCount?: number
}

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocity: {
    x: number
    y: number
  }
}

export function Confetti({
  trigger,
  duration = 3000,
  particleCount = 50,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)

      // Generate particles
      const colors = ["#D8B76A", "#0F2A44", "#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]
      const newParticles: Particle[] = []

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          velocity: {
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 1) * 15 - 5,
          },
        })
      }

      setParticles(newParticles)

      // Reset after duration
      setTimeout(() => {
        setIsActive(false)
        setParticles([])
      }, duration)
    }
  }, [trigger, isActive, duration, particleCount])

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            x: particle.x + particle.velocity.x * 50,
            y: particle.y + particle.velocity.y * 50,
            rotate: particle.rotation,
            opacity: 0,
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
