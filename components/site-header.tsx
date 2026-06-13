"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Trang chủ", href: "#home" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Môn học", href: "#subjects" },
  { label: "Đội ngũ", href: "#tutors" },
  { label: "Cam kết", href: "#commitments" },
]

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [typeof window !== "undefined" && window.location.hash])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-white shadow-sm py-3"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="#home"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity rounded-lg focus:ring-2 focus:ring-[#D8B76A] focus:ring-offset-2"
            aria-label="TPA+ Trang chủ"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NLxJNyWoYzdwoFfmXDqnXTfschlJc2.png"
              alt="TPA+ Logo"
              width={56}
              height={56}
              className="rounded-full"
            />
            <div className="hidden sm:block">
              <p className={cn(
                "font-bold text-xl transition-colors",
                isScrolled ? "text-[#0F2A44]" : "text-[#0F2A44]"
              )}>
                TPA+
              </p>
              <p className={cn(
                "text-xs transition-colors",
                isScrolled ? "text-[#6B7280]" : "text-[#6B7280]"
              )}>
                Trung Tâm Gia Sư
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:bg-[#F8F5EC] hover:scale-105 cursor-pointer",
                  isScrolled ? "text-[#1F2937]" : "text-[#1F2937]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#0F2A44] text-[#0F2A44] hover:bg-[#0F2A44] hover:text-white transition-all duration-200"
              asChild
            >
              <Link href="tel:0899736669" aria-label="Gọi hotline 089 9736 669">
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                089 9736 669
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-[#D8B76A] text-[#0F2A44] hover:bg-[#c9a555] font-semibold transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="#contact">Đặt gia sư ngay</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#0F2A44] border border-[#0F2A44]/20 hover:bg-[#0F2A44] hover:text-white transition-all duration-200 font-semibold"
              asChild
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#F8F5EC] transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#0F2A44]" />
            ) : (
              <Menu className="w-6 h-6 text-[#0F2A44]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden mt-4 pb-4 border-t border-[#E5E7EB] pt-4 animate-in slide-in-from-top-2 duration-300"
            role="navigation"
            aria-label="Mobile menu"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 min-h-[44px] flex items-center text-[#1F2937] font-medium rounded-lg hover:bg-[#F8F5EC] transition-colors cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <Button
                  variant="outline"
                  className="w-full border-[#0F2A44] text-[#0F2A44] transition-all duration-200"
                  asChild
                >
                  <Link href="tel:0899736669" aria-label="Gọi hotline 0899 736 669">
                    <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                    0899 736 669
                  </Link>
                </Button>
                <Button
                  className="w-full bg-[#D8B76A] text-[#0F2A44] hover:bg-[#c9a555] font-semibold transition-all duration-200"
                  asChild
                >
                  <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                    Đặt gia sư ngay
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-[#0F2A44] border border-[#0F2A44]/20 hover:bg-[#0F2A44] hover:text-white font-semibold transition-all duration-200"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
