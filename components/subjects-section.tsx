import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Code2, Atom, FlaskConical, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const subjects = [
  {
    icon: Calculator,
    name: "Toán học",
    description: "Đại số, Hình học, Giải tích, Xác suất thống kê",
    levels: ["THCS", "THPT"],
    bgColor: "bg-[#0F2A44]",
    iconColor: "text-[#D8B76A]",
    textColor: "text-white",
    hoverBg: "hover:bg-[#1a3a5c]",
  },
  {
    icon: Code2,
    name: "Tin học Lập trình",
    description: "Python, C++, Scratch, Tư duy thuật toán",
    levels: ["THCS", "THPT"],
    bgColor: "bg-[#D8B76A]",
    iconColor: "text-[#0F2A44]",
    textColor: "text-[#0F2A44]",
    hoverBg: "hover:bg-[#c9a555]",
  },
  {
    icon: Atom,
    name: "Vật lý",
    description: "Cơ học, Điện từ, Quang học, Nhiệt học",
    levels: ["THCS", "THPT"],
    bgColor: "bg-[#0F2A44]",
    iconColor: "text-[#D8B76A]",
    textColor: "text-white",
    hoverBg: "hover:bg-[#1a3a5c]",
  },
  {
    icon: FlaskConical,
    name: "Hóa học",
    description: "Hóa vô cơ, H hóa hữu cơ, Phương trình phản ứng",
    levels: ["THCS", "THPT"],
    bgColor: "bg-[#D8B76A]",
    iconColor: "text-[#0F2A44]",
    textColor: "text-[#0F2A44]",
    hoverBg: "hover:bg-[#c9a555]",
  },
]

export function SubjectsSection() {
  return (
    <section id="subjects" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
              Môn học
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
              Các môn học tại TPA+
            </h2>
            <p className="text-[#6B7280] text-lg">
              Chuyên sâu 6 môn học chính với đội ngũ gia sư giỏi chuyên môn
            </p>
          </div>
        </ScrollReveal>

        {/* Subject Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100}>
              <Card
                className={`${subject.bgColor} ${subject.hoverBg} border-0 overflow-hidden group transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 cursor-pointer`}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <subject.icon className={`w-8 h-8 ${subject.iconColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold ${subject.textColor} mb-3 group-hover:opacity-90 transition-opacity`}>
                    {subject.name}
                  </h3>
                  <p className={`${subject.textColor} opacity-80 text-sm mb-4 leading-relaxed`}>
                    {subject.description}
                  </p>
                  <div className="flex gap-2">
                    {subject.levels.map((level) => (
                      <Badge
                        key={level}
                        variant="secondary"
                        className="bg-white/20 text-white hover:bg-white/30 border-0 transition-colors"
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal direction="up" delay={400}>
          <div className="text-center mt-12">
            <Link
              href="#tutors"
              className="inline-flex items-center gap-2 text-[#0F2A44] font-semibold hover:text-[#D8B76A] transition-colors group"
            >
              Xem đội ngũ gia sư
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
