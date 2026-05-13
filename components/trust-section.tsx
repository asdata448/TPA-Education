import { Card, CardContent } from "@/components/ui/card"
import { BookX, TrendingUp, FileCheck, Code } from "lucide-react"

const trustItems = [
  {
    icon: BookX,
    title: "Mất gốc kiến thức?",
    description: "Gia sư giúp bạn xây dựng lại nền tảng vững chắc từ đầu",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: TrendingUp,
    title: "Muốn tăng điểm?",
    description: "Phương pháp học hiệu quả, luyện đề thường xuyên",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: FileCheck,
    title: "Chuẩn bị ôn thi?",
    description: "Lộ trình ôn tập khoa học cho kỳ thi quan trọng",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Code,
    title: "Muốn học lập trình?",
    description: "Từ Scratch đến Python, C++ cho mọi cấp độ",
    color: "text-[#D8B76A]",
    bgColor: "bg-[#F8F5EC]",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
            Dành cho bạn
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            TPA+ phù hợp với bạn nếu...
          </h2>
          <p className="text-[#6B7280] text-lg">
            Dù bạn đang ở đâu trong hành trình học tập, chúng tôi đều có giải pháp phù hợp
          </p>
        </div>

        {/* Trust Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <Card
              key={index}
              className="group border-2 border-transparent hover:border-[#D8B76A]/30 transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6 lg:p-8">
                <div className={`w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-[#0F2A44] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
