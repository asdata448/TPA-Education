import { packages } from "@/lib/data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Laptop, MapPin } from "lucide-react"
import Link from "next/link"

export function PackagesSection() {
  return (
    <section id="packages" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
            Gói học
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            Chọn gói học phù hợp
          </h2>
          <p className="text-[#6B7280] text-lg">
            Đa dạng gói học đáp ứng mọi nhu cầu và mục tiêu học tập
          </p>
        </div>

        {/* Package Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {packages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                pkg.popular
                  ? "border-2 border-[#D8B76A] shadow-lg"
                  : "border border-[#E5E7EB]"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-[#D8B76A] text-[#0F2A44] text-center py-2 text-sm font-semibold">
                  Phổ biến nhất
                </div>
              )}

              <CardHeader className={pkg.popular ? "pt-12" : ""}>
                <h3 className="text-xl font-bold text-[#0F2A44]">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#D8B76A]">{pkg.duration}</span>
                  <span className="text-sm text-[#6B7280]">• {pkg.sessions}</span>
                </div>
                <p className="text-sm text-[#6B7280] mt-3">{pkg.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 bg-[#D8B76A]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#D8B76A]" />
                      </div>
                      <span className="text-[#6B7280]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    pkg.popular
                      ? "bg-[#D8B76A] text-[#0F2A44] hover:bg-[#c9a555]"
                      : "bg-[#0F2A44] text-white hover:bg-[#1a3a5c]"
                  }`}
                  asChild
                >
                  <Link href="#contact">
                    Đăng ký ngay
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Format Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] border-0 overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Laptop className="w-10 h-10 text-[#D8B76A]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Học Online</h3>
                <p className="text-white/70 text-sm mb-3">
                  Học qua Zoom/Google Meet, linh hoạt thời gian, tiết kiệm di chuyển
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white border-0">Zoom</Badge>
                  <Badge className="bg-white/20 text-white border-0">Google Meet</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#D8B76A] to-[#c9a555] border-0 overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-10 h-10 text-[#0F2A44]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0F2A44] mb-2">Học Offline</h3>
                <p className="text-[#0F2A44]/70 text-sm mb-3">
                  Dạy tại nhà học sinh hoặc địa điểm thỏa thuận trong khu vực
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#0F2A44]/20 text-[#0F2A44] border-0">Dĩ An</Badge>
                  <Badge className="bg-[#0F2A44]/20 text-[#0F2A44] border-0">Thủ Đức</Badge>
                  <Badge className="bg-[#0F2A44]/20 text-[#0F2A44] border-0">Làng ĐH</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
