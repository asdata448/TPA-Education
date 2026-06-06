import { Check } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const benefits = [
  "Đội ngũ gia sư từ Đại học Bách Khoa, KHTN",
  "Phương pháp giảng dạy cá nhân hóa",
  "Linh hoạt học Online hoặc Offline",
  "Báo cáo tiến độ cho phụ huynh hàng tuần",
  "Hỗ trợ giải đáp ngoài giờ học",
  "Cam kết hoàn tiền nếu không tiến bộ",
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F8F5EC]/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <ScrollReveal direction="up" delay={0}>
              <div>
                <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
                  Về chúng tôi
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-6 text-balance">
                  TPA+ - Trung Tâm Gia Sư Chất Lượng Cao
                </h2>
                <p className="text-[#6B7280] text-lg leading-relaxed">
                  Được thành lập bởi đội ngũ sinh viên xuất sắc từ các trường Đại học hàng đầu tại TP.HCM,
                  TPA+ mang đến giải pháp học tập toàn diện cho học sinh THCS và THPT.
                  Chúng tôi tin rằng mỗi học sinh đều có tiềm năng, chỉ cần phương pháp đúng đắn.
                </p>
              </div>
            </ScrollReveal>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} direction="right" delay={100 + index * 50}>
                  <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-6 h-6 bg-[#D8B76A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                      <Check className="w-4 h-4 text-[#0F2A44]" />
                    </div>
                    <p className="text-[#1F2937] font-medium group-hover:text-[#0F2A44] transition-colors">
                      {benefit}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Card */}
          <ScrollReveal direction="left" delay={200}>
            <div className="relative group">
              <div className="bg-[#0F2A44] rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#D8B76A]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D8B76A]/10 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-[#D8B76A]/20 px-4 py-2 rounded-full hover:bg-[#D8B76A]/30 transition-colors duration-300">
                    <span className="w-2 h-2 bg-[#D8B76A] rounded-full animate-pulse" />
                    <span className="text-[#D8B76A] text-sm font-medium">Slogan của chúng tôi</span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold leading-tight">
                    &ldquo;Học vững gốc
                    <span className="text-[#D8B76A]"> - Tăng điểm - </span>
                    Ôn thi hiệu quả&rdquo;
                  </h3>

                  <p className="text-white/70 leading-relaxed">
                    Tận tâm - Phương pháp - A+
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                    {[
                      { value: "95%", label: "Học sinh tiến bộ" },
                      { value: "4.9", label: "Đánh giá" },
                      { value: "2+", label: "Năm kinh nghiệm" },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="text-center group/stat cursor-pointer"
                      >
                        <p className="text-3xl font-bold text-[#D8B76A] group-hover/stat:scale-125 transition-transform duration-300">
                          {stat.value}
                        </p>
                        <p className="text-sm text-white/70">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#D8B76A]/20 rounded-2xl group-hover:rotate-12 group-hover:-translate-x-2 transition-all duration-500" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#0F2A44]/10 rounded-2xl group-hover:-rotate-12 group-hover:translate-x-2 transition-all duration-500" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
