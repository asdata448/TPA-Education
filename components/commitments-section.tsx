"use client"

import { Shield, Clock, Users, BookOpen, HeartHandshake, RefreshCcw } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const commitments = [
  {
    icon: Shield,
    title: "Gia sư chất lượng",
    description: "Đội ngũ gia sư được tuyển chọn kỹ lưỡng, có thành tích học tập xuất sắc và kinh nghiệm giảng dạy thực tế.",
  },
  {
    icon: Clock,
    title: "Lịch học linh hoạt",
    description: "Chủ động sắp xếp thời gian học phù hợp với lịch trình của học sinh, kể cả buổi tối và cuối tuần.",
  },
  {
    icon: Users,
    title: "Học 1:1 cá nhân hóa",
    description: "Mỗi học sinh có lộ trình riêng, được thiết kế dựa trên năng lực và mục tiêu cụ thể.",
  },
  {
    icon: BookOpen,
    title: "Giáo trình bài bản",
    description: "Tài liệu được biên soạn kỹ lưỡng, bám sát chương trình và cập nhật theo xu hướng đề thi mới nhất.",
  },
  {
    icon: HeartHandshake,
    title: "Đồng hành cùng phụ huynh",
    description: "Báo cáo tiến độ định kỳ, phụ huynh luôn nắm được tình hình học tập của con em mình.",
  },
  {
    icon: RefreshCcw,
    title: "Đổi gia sư miễn phí",
    description: "Nếu học sinh không phù hợp với gia sư hiện tại, TPA+ sẽ hỗ trợ đổi gia sư miễn phí trong 2 tuần đầu.",
  },
]

export function CommitmentsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#F8F5EC]">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#D8B76A]/20 text-[#0F2A44] rounded-full text-sm font-medium mb-4 hover:bg-[#D8B76A]/30 transition-colors cursor-pointer">
              Cam kết của TPA+
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F2A44] mb-6 text-balance">
              Những giá trị chúng tôi mang lại
            </h2>
            <p className="text-lg text-[#0F2A44]/70 max-w-2xl mx-auto text-pretty">
              TPA+ cam kết đồng hành cùng học sinh và phụ huynh trên hành trình chinh phục kiến thức
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {commitments.map((commitment, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100}>
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 cursor-pointer">
                <div className="w-14 h-14 bg-[#0F2A44] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D8B76A] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <commitment.icon className="w-7 h-7 text-white group-hover:text-[#0F2A44] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#0F2A44] mb-3 group-hover:text-[#D8B76A] transition-colors">
                  {commitment.title}
                </h3>
                <p className="text-[#0F2A44]/70 leading-relaxed">
                  {commitment.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={600}>
          <div className="mt-16 bg-gradient-to-r from-[#0F2A44] to-[#1a3a5c] rounded-2xl p-8 md:p-12 text-center hover:shadow-2xl transition-all duration-300 group">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#D8B76A]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-[#D8B76A]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Cam kết hoàn tiền 100%
              </h3>
            </div>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Nếu sau 2 buổi học đầu tiên, phụ huynh và học sinh không hài lòng với chất lượng giảng dạy,
              TPA+ cam kết hoàn lại 100% học phí đã đóng.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
