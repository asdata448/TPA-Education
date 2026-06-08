import { learningPaths } from '@/lib/data'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Target, Trophy } from 'lucide-react'

type LearningPath = (typeof learningPaths)[number]
type LearningMilestone = LearningPath['milestones'][number]

export function LearningPathSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#F8F5EC]/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
            Lộ trình
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            Lộ trình học tập khoa học
          </h2>
          <p className="text-[#6B7280] text-lg">
            Chọn lộ trình phù hợp với mục tiêu và thời gian của bạn
          </p>
        </div>

        {/* Learning Path Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {learningPaths.map((path: LearningPath, index: number) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                index === 1
                  ? "border-[#D8B76A] shadow-lg"
                  : "border-transparent hover:border-[#E5E7EB]"
              }`}
            >
              {index === 1 && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#D8B76A] text-[#0F2A44]">
                    Phổ biến nhất
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0F2A44] rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#D8B76A]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#D8B76A]">{path.duration}</p>
                    <p className="text-sm text-[#6B7280]">{path.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#D8B76A]" />
                  <span className="text-sm font-medium text-[#0F2A44]">{path.target}</span>
                </div>
              </CardHeader>

              <CardContent>
                {/* Milestones */}
                <div className="space-y-4 mb-6">
                  {path.milestones.map((milestone: LearningMilestone, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-[#F8F5EC]/50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-[#0F2A44] rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#D8B76A]">
                          {typeof milestone.week === "number"
                            ? `T${milestone.week}`
                            : `T${milestone.week}`}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280] pt-1">{milestone.content}</p>
                    </div>
                  ))}
                </div>

                {/* Outcome */}
                <div className="p-4 bg-[#0F2A44] rounded-xl">
                  <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-[#D8B76A] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-[#D8B76A] uppercase mb-1">
                        Kết quả mong đợi
                      </p>
                      <p className="text-sm text-white">{path.outcome}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
