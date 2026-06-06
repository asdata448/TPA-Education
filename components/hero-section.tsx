import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Target, GraduationCap, ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F8F5EC]/30 to-white" aria-hidden="true" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#D8B76A]/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0F2A44]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0F2A44] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="w-4 h-4 text-[#D8B76A]" aria-hidden="true" />
              Trung tâm gia sư chất lượng cao
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2A44] leading-tight text-balance">
                Học vững gốc
                <span className="block text-[#D8B76A]">Tăng điểm nhanh</span>
                Tự tin thi cử
              </h1>
              <p className="text-lg lg:text-xl text-[#6B7280] max-w-xl text-pretty leading-relaxed">
                TPA+ đồng hành cùng học sinh THCS & THPT với đội ngũ gia sư từ các trường Đại học hàng đầu.
                Phương pháp cá nhân hóa, cam kết tiến bộ rõ rệt.
              </p>
            </div>

            {/* Highlight Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-[#F8F5EC] text-[#0F2A44] border border-[#E5E7EB] hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <Users className="w-4 h-4 mr-2 text-[#D8B76A]" aria-hidden="true" />
                Dạy kèm 1:1
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-[#F8F5EC] text-[#0F2A44] border border-[#E5E7EB] hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 mr-2 text-[#D8B76A]" aria-hidden="true" />
                Online & Offline
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-[#F8F5EC] text-[#0F2A44] border border-[#E5E7EB] hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <Target className="w-4 h-4 mr-2 text-[#D8B76A]" aria-hidden="true" />
                Lộ trình cá nhân
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-[#F8F5EC] text-[#0F2A44] border border-[#E5E7EB] hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 mr-2 text-[#D8B76A]" aria-hidden="true" />
                THCS - THPT
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#D8B76A] text-[#0F2A44] hover:bg-[#c9a555] hover:scale-105 font-semibold text-base px-8 py-6 shadow-lg shadow-[#D8B76A]/25 transition-all duration-200"
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
                className="border-2 border-[#0F2A44] text-[#0F2A44] hover:bg-[#0F2A44] hover:text-white font-semibold text-base px-8 py-6 transition-all duration-200"
                asChild
              >
                <Link href="#about">Tìm hiểu thêm</Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Banner Image */}
          <div className="relative fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative z-10">
              {/* Main Banner Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:shadow-3xl transition-shadow duration-300">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7F1LGHwUVdrkFWcqGrYs8GCRBYxQqW.png"
                  alt="TPA+ Trung Tâm Gia Sư - Đội ngũ gia sư chất lượng cao đồng hành cùng học sinh"
                  width={600}
                  height={350}
                  className="w-full h-auto"
                  priority
                />
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-[#E5E7EB] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D8B76A]/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#D8B76A]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F2A44]" aria-label="95 học sinh">95+</p>
                    <p className="text-sm text-[#6B7280]">Học sinh tin tưởng</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-[#0F2A44] text-white rounded-2xl shadow-xl px-5 py-3 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <p className="text-sm font-medium">Cam kết</p>
                <p className="text-xl font-bold text-[#D8B76A]">100%</p>
                <p className="text-xs">Tiến bộ</p>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-10 -right-10 w-20 h-20 bg-[#D8B76A]/20 rounded-full blur-xl" aria-hidden="true" />
            <div className="absolute -bottom-10 right-20 w-32 h-32 bg-[#0F2A44]/10 rounded-full blur-xl" aria-hidden="true" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 lg:mt-24 fade-in" style={{ animationDelay: "400ms" }}>
          <div className="bg-[#0F2A44] rounded-2xl lg:rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-[#D8B76A]">3+</p>
                <p className="text-white/80 mt-1 text-sm lg:text-base">Gia sư chuyên môn</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-[#D8B76A]">4</p>
                <p className="text-white/80 mt-1 text-sm lg:text-base">Môn học chính</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-[#D8B76A]">1:1</p>
                <p className="text-white/80 mt-1 text-sm lg:text-base">Dạy kèm cá nhân</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-[#D8B76A]">100%</p>
                <p className="text-white/80 mt-1 text-sm lg:text-base">Cam kết tiến bộ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
