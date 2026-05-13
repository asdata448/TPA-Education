import { Card, CardContent } from "@/components/ui/card"
import { FileText, Bell, BarChart3, MessageSquare } from "lucide-react"

const reportFeatures = [
  {
    icon: FileText,
    title: "Báo cáo hàng tuần",
    description: "Nhận báo cáo chi tiết qua Zalo/Email mỗi tuần",
  },
  {
    icon: BarChart3,
    title: "Theo dõi tiến độ",
    description: "Biểu đồ trực quan về điểm số và năng lực",
  },
  {
    icon: Bell,
    title: "Thông báo kịp thời",
    description: "Cập nhật ngay khi có vấn đề cần quan tâm",
  },
  {
    icon: MessageSquare,
    title: "Trao đổi trực tiếp",
    description: "Liên hệ gia sư bất cứ lúc nào qua Zalo",
  },
]

export function ParentReportSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
                Dành cho phụ huynh
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-6 text-balance">
                Phụ huynh luôn được cập nhật tiến độ
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                Chúng tôi hiểu phụ huynh luôn muốn biết con em mình đang học như thế nào. 
                Hệ thống báo cáo định kỳ giúp phụ huynh nắm bắt tình hình và đồng hành cùng con.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {reportFeatures.map((feature, index) => (
                <Card key={index} className="border border-[#E5E7EB] hover:border-[#D8B76A]/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 bg-[#F8F5EC] rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-[#D8B76A]" />
                    </div>
                    <h3 className="font-bold text-[#0F2A44] mb-1">{feature.title}</h3>
                    <p className="text-sm text-[#6B7280]">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Content - Sample Report Preview */}
          <div className="relative">
            <div className="bg-[#F8F5EC] rounded-3xl p-6 lg:p-8">
              {/* Mock Report Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6B7280]">Báo cáo tuần</p>
                    <h4 className="text-lg font-bold text-[#0F2A44]">Tuần 3 - Tháng 5</h4>
                  </div>
                  <div className="w-12 h-12 bg-[#D8B76A]/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#D8B76A]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#6B7280]">Toán học</span>
                      <span className="font-bold text-[#0F2A44]">85%</span>
                    </div>
                    <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-[#0F2A44] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#6B7280]">Vật lý</span>
                      <span className="font-bold text-[#0F2A44]">72%</span>
                    </div>
                    <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full w-[72%] bg-[#D8B76A] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#6B7280]">Bài tập hoàn thành</span>
                      <span className="font-bold text-[#0F2A44]">12/15</span>
                    </div>
                    <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full w-[80%] bg-green-500 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB]">
                  <p className="text-sm text-[#6B7280]">
                    <span className="font-medium text-[#0F2A44]">Nhận xét:</span> Em đã tiến bộ rõ rệt trong tuần này, đặc biệt ở phần giải phương trình...
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#D8B76A]/20 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#0F2A44]/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
