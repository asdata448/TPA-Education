import { consultationProcess } from "@/lib/data"
import {
  MessageCircle,
  Phone,
  ClipboardCheck,
  BookOpen,
  CheckCircle2,
} from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const icons: Record<string, typeof MessageCircle> = {
  MessageCircle,
  Phone,
  ClipboardCheck,
  BookOpen,
  CheckCircle2,
}

export function ProcessSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
            <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
              Quy trình
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-3 sm:mb-4 text-balance">
              Quy trình tư vấn & đăng ký
            </h2>
            <p className="text-[#6B7280] text-base sm:text-lg">
              Chỉ 5 bước đơn giản để bắt đầu hành trình học tập hiệu quả cùng TPA+
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline - Desktop */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-[#E5E7EB]" />
            <div className="absolute top-16 left-0 w-1/2 h-1 bg-gradient-to-r from-[#0F2A44] to-[#D8B76A] animate-progress" />

            {/* Steps */}
            <div className="grid grid-cols-5 gap-4">
              {consultationProcess.map((step, index) => {
                const Icon = icons[step.icon] || MessageCircle
                return (
                  <ScrollReveal key={step.step} direction="up" delay={index * 100}>
                    <div className="relative group">
                      {/* Step Number & Icon */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-32 h-32 rounded-3xl flex flex-col items-center justify-center mb-6 relative z-10 transition-all duration-300 cursor-pointer ${
                            index <= 2
                              ? "bg-[#0F2A44] text-white shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2"
                              : "bg-[#F8F5EC] text-[#0F2A44] group-hover:bg-[#D8B76A]/20 group-hover:-translate-y-2"
                          }`}
                        >
                          <span
                            className={`text-sm font-bold mb-2 ${
                              index <= 2 ? "text-[#D8B76A]" : "text-[#D8B76A]"
                            }`}
                          >
                            Bước {step.step}
                          </span>
                          <Icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold text-[#0F2A44] text-center mb-2 group-hover:text-[#D8B76A] transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-[#6B7280] text-center mb-2">
                          {step.description}
                        </p>
                        <span className="text-xs text-[#D8B76A] font-medium">
                          {step.duration}
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </div>

        {/* Timeline - Mobile */}
        <div className="lg:hidden space-y-6">
          {consultationProcess.map((step, index) => {
            const Icon = icons[step.icon] || MessageCircle
            return (
              <ScrollReveal key={step.step} direction="right" delay={index * 100}>
                <div className="flex gap-4 items-start group">
                  {/* Step Number & Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 transition-all duration-300 cursor-pointer ${
                      index <= 2
                        ? "bg-[#0F2A44] text-white shadow-lg group-hover:shadow-xl group-hover:scale-110"
                        : "bg-[#F8F5EC] text-[#0F2A44] group-hover:bg-[#D8B76A]/20 group-hover:scale-110"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#D8B76A]">{step.step}</span>
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-bold text-[#0F2A44] mb-1 group-hover:text-[#D8B76A] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-1">
                      {step.description}
                    </p>
                    <span className="text-xs text-[#D8B76A] font-medium">
                      {step.duration}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
