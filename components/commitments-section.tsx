import { commitments } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  FileText,
  HeadphonesIcon,
  Route,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

const icons: Record<string, typeof TrendingUp> = {
  TrendingUp,
  FileText,
  HeadphonesIcon,
  Route,
  GraduationCap,
  RefreshCw,
}

export function CommitmentsSection() {
  return (
    <section id="commitments" className="py-20 lg:py-28 bg-[#0F2A44] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8B76A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D8B76A]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#D8B76A]/20 px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-5 h-5 text-[#D8B76A]" />
            <span className="text-[#D8B76A] font-medium">Cam kết từ TPA+</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
            6 cam kết đồng hành cùng bạn
          </h2>
          <p className="text-white/70 text-lg">
            Chúng tôi không chỉ dạy học, mà đồng hành cùng bạn trên hành trình chinh phục tri thức
          </p>
        </div>

        {/* Commitment Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {commitments.map((commitment, index) => {
            const Icon = icons[commitment.icon] || TrendingUp
            return (
              <Card
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
              >
                <CardContent className="p-6 lg:p-8">
                  <div className="w-14 h-14 bg-[#D8B76A]/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-[#D8B76A]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {commitment.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {commitment.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Highlight Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#D8B76A] to-[#e5c988] rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-[#0F2A44] mb-4">
            Cam kết hoàn tiền 100%
          </h3>
          <p className="text-[#0F2A44]/80 max-w-2xl mx-auto mb-6">
            Nếu sau 4 tuần học sinh không có tiến bộ rõ rệt, chúng tôi hoàn trả 100% học phí. 
            Đây là cam kết của TPA+ về chất lượng giảng dạy.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#0F2A44] rounded-full" />
              <span className="text-[#0F2A44] font-medium">Không rủi ro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#0F2A44] rounded-full" />
              <span className="text-[#0F2A44] font-medium">Minh bạch</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#0F2A44] rounded-full" />
              <span className="text-[#0F2A44] font-medium">Uy tín</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
