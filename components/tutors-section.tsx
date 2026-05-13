"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tutors } from "@/lib/data"
import {
  GraduationCap,
  Award,
  Phone,
  Mail,
  MessageCircle,
  Code2,
  Calculator,
  Atom,
  FlaskConical,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
          <p className="text-[#6B7280] text-lg text-pretty">
            Sinh viên xuất sắc từ Đại học Khoa học Tự nhiên ĐHQG-HCM — tận tâm, giàu thành tích, phương pháp hiện đại
          </p>
        </div>

        {/* Tutor Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <Card
              key={tutor.id}
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
            >
              <CardContent className="p-0 flex flex-col flex-1">
                {/* Header navy band */}
                <div className="bg-[#0F2A44] px-6 pt-6 pb-20 relative">
                  <div className="flex flex-wrap gap-1.5">
                    {tutor.subjects.map((subject) => {
                      const Icon = subjectIcons[subject] || Calculator
                      return (
                        <Badge
                          key={subject}
                          className="bg-[#D8B76A] text-[#0F2A44] border-0 font-semibold"
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {subject}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                {/* Avatar — real photo, face-focused */}
                <div className="flex justify-center -mt-14 relative z-10">
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[#D8B76A]">
                    <Image
                      src={tutor.avatar}
                      alt={`Ảnh gia sư ${tutor.name}`}
                      width={112}
                      height={112}
                      className={`w-full h-full object-cover ${tutor.avatarPosition}`}
                    />
                  </div>
                </div>

                {/* Name & role */}
                <div className="text-center px-6 mt-3 mb-4">
                  <h3 className="text-xl font-bold text-[#0F2A44]">{tutor.name}</h3>
                  <p className="text-[#D8B76A] font-semibold text-sm mt-0.5">{tutor.role}</p>
                  <p className="text-[#6B7280] text-xs mt-1 leading-relaxed">{tutor.education}</p>
                </div>

                {/* Tabs */}
                <div className="px-6 flex-1">
                  <Tabs defaultValue="achievements" className="w-full">
                    <TabsList className="w-full bg-[#F8F5EC] p-1 mb-4 rounded-lg">
                      <TabsTrigger
                        value="achievements"
                        className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-[#0F2A44] data-[state=active]:shadow-sm"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Thành tích
                      </TabsTrigger>
                      <TabsTrigger
                        value="method"
                        className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-[#0F2A44] data-[state=active]:shadow-sm"
                      >
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Phương pháp
                      </TabsTrigger>
                      <TabsTrigger
                        value="contact"
                        className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-[#0F2A44] data-[state=active]:shadow-sm"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Liên hệ
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="achievements" className="mt-0 min-h-[160px]">
                      <ul className="space-y-2">
                        {tutor.achievements.map((achievement, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[#374151]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#D8B76A] mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="method" className="mt-0 min-h-[160px]">
                      <p className="text-sm text-[#374151] leading-relaxed">
                        {tutor.teachingMethod}
                      </p>
                      {"languages" in tutor && tutor.languages && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-[#0F2A44] mb-2 uppercase tracking-wide">Kỹ năng</p>
                          <div className="flex flex-wrap gap-1.5">
                            {tutor.languages.map((lang) => (
                              <Badge
                                key={lang}
                                variant="outline"
                                className="text-xs border-[#D8B76A] text-[#0F2A44]"
                              >
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="contact" className="mt-0 min-h-[160px]">
                      <div className="space-y-3">
                        <a
                          href={`tel:${tutor.contact.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F5EC] hover:bg-[#f0ebe0] transition-colors"
                        >
                          <div className="w-8 h-8 bg-[#0F2A44] rounded-full flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 text-[#D8B76A]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280]">Điện thoại / Zalo</p>
                            <p className="text-sm font-semibold text-[#0F2A44]">{tutor.contact.phone}</p>
                          </div>
                        </a>
                        <a
                          href={`mailto:${tutor.contact.email}`}
                          className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F5EC] hover:bg-[#f0ebe0] transition-colors"
                        >
                          <div className="w-8 h-8 bg-[#0F2A44] rounded-full flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 text-[#D8B76A]" />
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280]">Email</p>
                            <p className="text-sm font-semibold text-[#0F2A44] break-all">{tutor.contact.email}</p>
                          </div>
                        </a>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6 mt-6">
                  <Button
                    className="w-full bg-[#0F2A44] hover:bg-[#1a3a5c] text-white font-semibold"
                    asChild
                  >
                    <Link href="#contact">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Liên hệ gia sư
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
