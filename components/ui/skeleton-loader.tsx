"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  variant?: "text" | "circular" | "rectangular" | "rounded"
}

export function Skeleton({
  className = "",
  width = "100%",
  height = "20px",
  variant = "rectangular",
}: SkeletonProps) {
  const variants = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  }

  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${variants[variant]} ${className}`}
      style={{ width, height }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      aria-hidden="true"
    />
  )
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <Skeleton
        variant="circular"
        width="60px"
        height="60px"
        className="mb-4"
      />
      <Skeleton variant="text" height="24px" className="mb-2" />
      <Skeleton variant="text" height="16px" className="w-2/3 mb-4" />
      <Skeleton variant="text" height="14px" />
      <Skeleton variant="text" height="14px" className="w-4/5 mt-2" />
    </div>
  )

// Profile card skeleton
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200">
      <Skeleton variant="circular" width="80px" height="80px" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height="24px" className="w-1/3" />
        <Skeleton variant="text" height="16px" className="w-1/2" />
        <Skeleton variant="text" height="14px" className="w-2/3" />
      </div>
    </div>
  )
}

// List skeleton
export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height="16px" className="w-1/3" />
            <Skeleton variant="text" height="14px" className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton variant="text" height="16px" width="80px" />
        <Skeleton variant="rectangular" height="48px" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" height="16px" width="60px" />
        <Skeleton variant="rectangular" height="48px" />
      </div>
      <Skeleton variant="rounded" height="48px" width="120px" />
    </div>
  )
}

// Full page loading skeleton
export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton variant="text" height="32px" className="w-1/3 mb-2" />
        <Skeleton variant="text" height="48px" className="w-2/3 mb-4" />
        <Skeleton variant="text" height="20px" className="w-full" />
        <Skeleton variant="text" height="20px" className="w-4/5" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
