"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxBgProps {
  children: React.ReactNode
  speed?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
}

export function ParallaxBg({
  children,
  speed = 0.5,
  className = "",
  direction = "up",
}: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [elementTop, setElementTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  const { scrollY } = useScroll()

  useEffect(() => {
    if (!ref.current) return

    const setValues = () => {
      setElementTop(ref.current?.offsetTop || 0)
      setClientHeight(window.innerHeight)
    }

    setValues()
    window.addEventListener("resize", setValues)
    return () => window.removeEventListener("resize", setValues)
  }, [])

  const y = useTransform(scrollY, [0, 1], [0, direction === "up" ? speed * -100 : speed * 100])

  return (
    <motion.div
      ref={ref}
      className={`absolute ${className}`}
      style={{ y }}
    >
      {children}
    </motion.div>
  )
}

// For simpler parallax sections
export function ParallaxSection({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  )
}
