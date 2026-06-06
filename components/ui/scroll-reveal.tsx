"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade"
  duration?: number
  threshold?: number
  distance?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 600,
  threshold = 0.1,
  distance = 40,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasRevealed = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasRevealed.current) return
          hasRevealed.current = true
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        } else if (!once) {
          setIsVisible(false)
          hasRevealed.current = false
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [delay, threshold, once])

  const directionStyles = {
    up: `translate-y-${distance / 4}`,
    down: `-translate-y-${distance / 4}`,
    left: `translate-x-${distance / 4}`,
    right: `-translate-x-${distance / 4}`,
    scale: "scale-95",
    fade: "",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible
          ? "opacity-100 translate-0 scale-100"
          : `opacity-0 ${directionStyles[direction]}`,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Stagger children animation wrapper
export function StaggerChildren({
  children,
  className,
  staggerDelay = 100,
  direction = "up",
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  direction?: "up" | "down" | "left" | "right"
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const childrenArray = Array.isArray(children) ? children : [children]

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <ScrollReveal key={index} delay={index * staggerDelay} direction={direction}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  )
}

// Parallax effect component
export function Parallax({
  children,
  className,
  speed = 0.5,
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.scrollY
        const rate = (rect.top + scrolled) * speed
        setOffset(rate * speed * 0.1)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  )
}

// Magnetic button effect
export function Magnetic({
  children,
  className,
  strength = 20,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    setPosition({
      x: x * (strength / 100),
      y: y * (strength / 100),
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.3s ease-out",
      }}
    >
      {children}
    </div>
  )
}

// Counter animation for stats
export function CountUp({
  end,
  duration = 2000,
  className,
  prefix = "",
  suffix = "",
}: {
  end: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
