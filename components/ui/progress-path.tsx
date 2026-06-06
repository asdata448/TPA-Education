"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ProgressPathProps {
  steps: number
  currentStep: number
  className?: string
  color?: string
}

export function ProgressPath({
  steps,
  currentStep,
  className = "",
  color = "#D8B76A",
}: ProgressPathProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculatedProgress = (currentStep / (steps - 1)) * 100
    setProgress(calculatedProgress)
  }, [currentStep, steps])

  return (
    <div className={`relative w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Animated glow effect */}
      <motion.div
        className="absolute top-0 h-full w-20 blur-lg rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          left: `${progress}%`,
          transform: "translateX(-50%)",
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// Circular progress
export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  className = "",
  color = "#D8B76A",
}: {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-[#0F2A44]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  )
}

// Step progress with animations
export function StepProgress({
  steps,
  currentStep,
  className = "",
}: {
  steps: string[]
  currentStep: number
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex items-center">
          {/* Step circle */}
          <motion.div
            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              index <= currentStep
                ? "bg-[#D8B76A] border-[#D8B76A] text-white"
                : "bg-white border-gray-300 text-gray-400"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
          >
            {index + 1}
          </motion.div>

          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 mx-2 bg-gray-200 rounded overflow-hidden">
              <motion.div
                className="h-full bg-[#D8B76A]"
                initial={{ width: 0 }}
                animate={{
                  width: index < currentStep ? "100%" : index === currentStep ? "50%" : "0%",
                }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Animated milestone path
export function MilestonePath({
  milestones,
  className = "",
}: {
  milestones: { label: string; completed: boolean }[]
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Progress fill */}
      <motion.div
        className="absolute left-4 top-0 w-0.5 bg-[#D8B76A]"
        initial={{ height: 0 }}
        animate={{
          height: `${(milestones.filter(m => m.completed).length / milestones.length) * 100}%`,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Milestones */}
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className="relative flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Milestone dot */}
            <motion.div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                milestone.completed
                  ? "bg-[#D8B76A] border-[#D8B76A]"
                  : "bg-white border-gray-300"
              }`}
              animate={
                milestone.completed
                  ? {
                      scale: [1, 1.2, 1],
                      transition: { delay: index * 0.1, duration: 0.4 },
                    }
                  : {}
              }
            >
              {milestone.completed && (
                <motion.span
                  className="text-white text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.div>

            {/* Milestone label */}
            <span
              className={`text-sm font-medium ${
                milestone.completed ? "text-[#0F2A44]" : "text-gray-400"
              }`}
            >
              {milestone.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
