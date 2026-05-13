import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function MidCtaSection() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-[#D8B76A] to-[#e5c988] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#0F2A44]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-[#0F2A44]" />
            <span className="text-[#0F2A44] font-medium text-sm">Ưu đãi đặc biệt</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            Sẵn sàng bắt đầu hành trình tiến bộ?
          </h2>
          <p className="text-[#0F2A44]/80 text-lg mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để nhận 1 buổi học thử MIỄN PHÍ và được tư vấn lộ trình học tập phù hợp
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#0F2A44] text-white hover:bg-[#1a3a5c] font-semibold text-base px-8 py-6 shadow-lg"
              asChild
            >
              <Link href="#contact">
                Đăng ký học thử miễn phí
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#0F2A44] text-[#0F2A44] hover:bg-[#0F2A44] hover:text-white font-semibold text-base px-8 py-6"
              asChild
            >
              <Link href="tel:0898232279">
                Gọi ngay: 0898 232 279
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
