import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Code2, Atom, FlaskConical, ArrowRight } from "lucide-react"
import Link from "next/link"

const subjects = [
  {
    icon: Calculator,
    name: "Toán học",
    description: "Đại số, Hình học, Giải tích, Xác suất thống kê",
    levels: ["THCS", "THPT"],
    bgColor: "bg-[#0F2A44]",
    iconColor: "text-[#D8B76A]",
    textColor: "text-white",
  },
  {
    icon: Code2,
    name: "Tin học Lập trình",
    description: "Python, C++, Scratch, Tư duy thuật toán",
    levels: ["THCS", "THPT"],
    bgColor: "bg-[#D8B76A]",
    iconColor: "text-[#0F2A44]",
    textColor: "text-[#0F2A44]",
  },
  {
    icon: Atom,
    name: "Vật lý",
    description: "Cơ học, Điện từ, Quang học, Nhiệt học",
    levels: ["THCS", "THPT"],
    bgColor: "bg-[#0F2A44]",
    iconColor: "text-[#D8B76A]",
    textColor: "text-white",
  },
  {
    icon: FlaskConical,
    name: "Hóa học",
    description: "Hóa vô cơ, Hóa hữu cơ, Phương trình phản ứng",
    levels: ["THCS", "THPT"],
    bgColor: "bg-[#D8B76A]",
    iconColor: "text-[#0F2A44]",
    textColor: "text-[#0F2A44]",
  },
]

export function SubjectsSection() {
  return (
    <section id="subjects" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
            Môn học
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            Các môn học tại TPA+
          </h2>
          <p className="text-[#6B7280] text-lg">
            Chuyên sâu 4 môn học chính với đội ngũ gia sư giỏi chuyên môn
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <Card
              key={index}
              className={`${subject.bgColor} border-0 overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-lg`}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <subject.icon className={`w-8 h-8 ${subject.iconColor}`} />
                </div>
                <h3 className={`text-xl font-bold ${subject.textColor} mb-3`}>
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
                      className="bg-white/20 text-white hover:bg-white/30 border-0"
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="#tutors"
            className="inline-flex items-center gap-2 text-[#0F2A44] font-semibold hover:text-[#D8B76A] transition-colors"
          >
            Xem đội ngũ gia sư
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
