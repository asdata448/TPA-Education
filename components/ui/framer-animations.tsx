"use client"

import { motion } from "framer-motion"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  className?: string
}

const variants = {
  hidden: {
    opacity: 0,
    y: 0,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  }),
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 50,
  className,
}: FadeInProps) {
  const directionOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {
          opacity: 0,
          ...directionOffset[direction],
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
            delay,
            duration,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  duration?: number
  className?: string
}

export function SlideIn({
  children,
  delay = 0,
  direction = "up",
  distance = 50,
  duration = 0.5,
  className,
}: SlideInProps) {
  const directionOffset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {
          opacity: 0,
          ...directionOffset[direction],
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: {
            type: "spring",
            damping: 20,
            stiffness: 300,
            delay,
            duration,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScaleInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  from?: number
  to?: number
  className?: string
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  from = 0.8,
  to = 1,
  className,
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: from }}
      whileInView={{ opacity: 1, scale: to }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay,
        duration,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export function Stagger({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerProps) {
  const childArray = Array.isArray(children) ? children : [children]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            delay: index * staggerDelay,
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

interface TextRevealProps {
  children: string
  delay?: number
  className?: string
}

export function TextReveal({ children, delay = 0, className }: TextRevealProps) {
  const words = children.split(" ")

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            delay: delay + wordIndex * 30,
          }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

interface FloatProps {
  children: React.ReactNode
  delay?: number
  yOffset?: number
  duration?: number
  className?: string
}

export function Float({
  children,
  delay = 0,
  yOffset = -10,
  duration = 2,
  className,
}: FloatProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{
        y: [0, yOffset, 0],
        transition: {
          duration: duration * 1000,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3000,
          delay,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  return (
    <motion.div
      style={{ y: 0 }}
      whileInView={{
        y: [-50 * speed, 0, -50 * speed],
      }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 100,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
