"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tutors } from "@/lib/data"
import {
  GraduationCap,
  Award,
  Clock,
  Users,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Code2,
  Calculator,
  Atom,
  FlaskConical,
} from "lucide-react"
import Link from "next/link"

const subjectIcons: Record<string, typeof Calculator> = {
  "Toán học": Calculator,
  "Tin học lập trình": Code2,
  "Vật lý": Atom,
  "Hóa học": FlaskConical,
}

export function TutorsSection() {
  return (
    <section id="tutors" className="py-20 lg:py-28 bg-[#F8F5EC]/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
            Đội ngũ
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            Gặp gỡ đội ngũ gia sư TPA+
          </h2>
          <p className="text-[#6B7280] text-lg">
            Sinh viên xuất sắc từ các trường Đại học hàng đầu, tận tâm và giàu kinh nghiệm
          </p>
        </div>

        {/* Tutor Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <Card
              key={tutor.id}
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <CardContent className="p-0">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#0F2A44] to-[#1a3a5c] p-6 pb-16 relative">
                  <div className="flex items-center gap-2 mb-3">
                    {tutor.subjects.map((subject) => {
                      const Icon = subjectIcons[subject] || Calculator
                      return (
                        <Badge
                          key={subject}
                          className="bg-[#D8B76A] text-[#0F2A44] border-0"
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {subject}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex justify-center -mt-12 relative z-10">
                  <div className="w-24 h-24 bg-[#D8B76A] rounded-full flex items-center justify-center text-[#0F2A44] text-3xl font-bold border-4 border-white shadow-lg">
                    {tutor.name.charAt(tutor.name.lastIndexOf(" ") + 1)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-[#0F2A44]">{tutor.name}</h3>
                    <p className="text-[#6B7280] text-sm">{tutor.role}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-[#E5E7EB]">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-[#D8B76A]" />
                        <span className="font-bold text-[#0F2A44]">{tutor.experience}</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">Kinh nghiệm</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-[#D8B76A]" />
                        <span className="font-bold text-[#0F2A44]">{tutor.students}</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">Học sinh</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-[#D8B76A]" />
                        <span className="font-bold text-[#0F2A44]">{tutor.rating}</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">Đánh giá</p>
                    </div>
                  </div>

                  {/* Tabs for detailed info */}
                  <Tabs defaultValue="achievements" className="w-full">
                    <TabsList className="w-full bg-[#F8F5EC] p-1 mb-4">
                      <TabsTrigger
                        value="achievements"
                        className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-[#0F2A44]"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Thành tích
                      </TabsTrigger>
                      <TabsTrigger
                        value="method"
                        className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-[#0F2A44]"
                      >
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Phương pháp
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="achievements" className="mt-0">
                      <ul className="space-y-2">
                        {tutor.achievements.map((achievement, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[#6B7280]"
                          >
                            <span className="w-1.5 h-1.5 bg-[#D8B76A] rounded-full mt-2 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="method" className="mt-0">
                      <p className="text-sm text-[#6B7280] leading-relaxed">
                        {tutor.teachingMethod}
                      </p>
                      {tutor.languages && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {tutor.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {/* Contact CTA */}
                  <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                    <Button
                      className="w-full bg-[#0F2A44] hover:bg-[#1a3a5c] text-white"
                      asChild
                    >
                      <Link href="#contact">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Liên hệ gia sư
                      </Link>
                    </Button>
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
