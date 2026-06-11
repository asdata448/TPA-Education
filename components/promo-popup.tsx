"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkPopup = () => {
      const shownThisSession = sessionStorage.getItem("tpa_promo_popup_shown")
      if (!shownThisSession) {
        setIsOpen(true)
      }
    }
    const timer = setTimeout(checkPopup, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("tpa_promo_popup_shown", "true")
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative animate-in zoom-in-95 duration-200"
        style={{ width: "min(90vw, 90vh * 1.78)" }} // 1.78 = 16/9 landscape ratio — đổi nếu ảnh dọc
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 hover:scale-110 transition-all duration-200 shadow-lg"
          aria-label="Đóng popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/qc2.jpeg"
            alt="Chương trình ưu đãi TPA+"
            width={1600}
            height={900}   // ← đổi đúng chiều cao thật của ảnh
            className="w-full h-auto block"
            priority
          />
        </div>
      </div>
    </div>
  )
}