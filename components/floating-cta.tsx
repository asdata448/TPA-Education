"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Facebook, MessageCircle, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function FloatingCta() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" role="complementary" aria-label="Liên hệ nhanh">
      {/* Expanded Contact Options */}
      <div
        className={cn(
          "flex flex-col gap-2 transition-all duration-300",
          isExpanded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-hidden={!isExpanded}
      >
        <Link
          href="tel:0899736669"
          className="flex items-center gap-3 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          aria-label="Gọi điện thoại: 0899736669"
        >
          <Phone className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium hidden sm:block">0899736669</span>
        </Link>

        <Link
          href="https://www.facebook.com/profile.php?id=61568038735619"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Mở Facebook TPA+"
        >
          <Facebook className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium hidden sm:block">Facebook</span>
        </Link>

        <Link
          href="https://zalo.me/0899736669"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Mở Zalo: 0899736669"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium hidden sm:block">Zalo</span>
        </Link>
      </div>

      {/* Main Toggle Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        size="lg"
        aria-label={isExpanded ? "Đóng menu liên hệ" : "Mở menu liên hệ"}
        aria-expanded={isExpanded}
        className={cn(
          "rounded-full w-14 h-14 shadow-xl transition-all duration-300 hover:scale-110",
          isExpanded
            ? "bg-[#0F2A44] hover:bg-[#1a3a5c]"
            : "bg-[#D8B76A] hover:bg-[#c9a555]"
        )}
      >
        {isExpanded ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className={cn("w-6 h-6", isExpanded ? "text-white" : "text-[#0F2A44]")} />
        )}
      </Button>

      {/* CTA to Contact Section (Desktop only) */}
      <Link
        href="#contact"
        className="hidden lg:flex items-center gap-2 bg-[#D8B76A] text-[#0F2A44] px-6 py-3 rounded-full shadow-lg hover:bg-[#c9a555] hover:scale-105 transition-all duration-200 font-semibold cursor-pointer focus:ring-2 focus:ring-[#D8B76A] focus:ring-offset-2"
        aria-label="Đặt lịch tư vấn gia sư"
      >
        Đặt gia sư ngay
      </Link>
    </div>
  )
}
