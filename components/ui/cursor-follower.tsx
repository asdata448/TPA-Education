"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CursorFollowerProps {
  className?: string
  size?: number
  color?: string
  blendMode?: string
}

export function CursorFollower({
  className = "",
  size = 20,
  color = "#D8B76A",
  blendMode = "difference",
}: CursorFollowerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <>
      {/* Main cursor follower */}
      <motion.div
        className={`fixed pointer-events-none z-[9998] rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          mixBlendMode: blendMode as any,
        }}
        animate={{
          x: mousePosition.x - size / 2,
          y: mousePosition.y - size / 2,
          scale: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Trailing cursor */}
      <motion.div
        className={`fixed pointer-events-none z-[9997] rounded-full ${className}`}
        style={{
          width: size * 2,
          height: size * 2,
          backgroundColor: color,
          mixBlendMode: blendMode as any,
        }}
        animate={{
          x: mousePosition.x - size,
          y: mousePosition.y - size,
          scale: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
    </>
  )
}

// Simple dot cursor
export function DotCursor({
  className = "",
  size = 8,
  color = "#0F2A44",
}: {
  className?: string
  size?: number
  color?: string
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.div
      className={`fixed pointer-events-none z-[9999] rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        x: position.x - size / 2,
        y: position.y - size / 2,
      }}
      transition={{
        type: "spring",
        stiffness: 1000,
        damping: 50,
      }}
    />
  )
}
