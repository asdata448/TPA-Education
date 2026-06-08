"use client"

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
}

export function TextReveal({
  text,
  className = "",
  delay = 0,
  duration = 0.05,
  stagger = 0.03,
}: TextRevealProps) {
  const words = text.split(" ")

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
  }

  return (
    <motion.div
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="mr-2 inline-block"
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Character-by-character reveal
export function CharReveal({
  text,
  className = "",
  delay = 0,
  duration = 0.03,
}: {
  text: string
  className?: string
  delay?: number
  duration?: number
}) {
  const letters = Array.from(text)

  return (
    <div className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: delay + index * duration,
            duration: 0.1,
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  )
}

// Word reveal with blur effect
export function BlurReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(" ")

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{
            delay: delay + index * 0.1,
            duration: 0.5,
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}
export function FadeInText({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.p>
  )
}
