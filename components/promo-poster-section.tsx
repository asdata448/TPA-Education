import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoPosterSection() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[#F8FBFF] shadow-xl">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div className="p-6 lg:p-10 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#0F2A44] px-4 py-2 text-sm font-medium text-white mb-4">
                <Sparkles className="h-4 w-4 text-[#D8B76A]" aria-hidden="true" />
                Thông tin nổi bật từ TPA+
              </div>
              <h2 className="text-2xl lg:text-4xl font-bold text-[#0F2A44] leading-tight text-balance mb-4">
                Học phí rõ ràng, lộ trình cá nhân hóa, đồng hành cùng học sinh mỗi ngày
              </h2>
              <p className="text-base lg:text-lg text-[#6B7280] leading-relaxed mb-6 text-pretty">
                Phụ huynh có thể xem nhanh chương trình đào tạo, nhóm môn học và các cam kết nổi bật của trung tâm ngay từ poster giới thiệu này.
              </p>
              <div className="grid gap-3 sm:grid-cols-3 mb-6">
                <div className="rounded-2xl bg-white p-4 border border-[#E5E7EB]"><p className="font-semibold text-[#0F2A44]">Giáo trình riêng</p></div>
                <div className="rounded-2xl bg-white p-4 border border-[#E5E7EB]"><p className="font-semibold text-[#0F2A44]">Đánh giá định kỳ</p></div>
                <div className="rounded-2xl bg-white p-4 border border-[#E5E7EB]"><p className="font-semibold text-[#0F2A44]">Cam kết tiến bộ</p></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-[#D8B76A] text-[#0F2A44] hover:bg-[#c9a555] font-semibold px-6 py-6 shadow-lg shadow-[#D8B76A]/20">
                  <Link href="#contact" className="flex items-center justify-center">
                    Nhận tư vấn miễn phí
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-[#0F2A44] text-[#0F2A44] hover:bg-[#0F2A44] hover:text-white px-6 py-6 font-semibold bg-transparent">
                  <Link href="#tutors">Xem đội ngũ gia sư</Link>
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 p-3 lg:p-4">
              <div className="overflow-hidden rounded-[1.5rem] border-4 border-white shadow-2xl bg-white">
                <Image
                  src="/qc1.jpg"
                  alt="Poster quảng cáo TPA+ với thông tin học phí, môn học và cam kết đào tạo"
                  width={1029}
                  height={768}
                  className="h-auto w-full"
                  quality={95}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
