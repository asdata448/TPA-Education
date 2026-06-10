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

    // Delay showing the popup slightly for better UX
    const timer = setTimeout(checkPopup, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("tpa_promo_popup_shown", "true")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div 
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white max-w-lg w-full max-h-[90vh] flex flex-col transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 hover:scale-110 transition-all duration-200 cursor-pointer"
          aria-label="Đóng popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Image */}
        <div className="relative w-full overflow-y-auto">
          <Image
            src="/qc2.jpg"
            alt="Chương trình ưu đãi TPA+"
            width={600}
            height={850}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
