"use client"

import { useState } from "react"
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
  Lightbulb,
  Users,
  Star,
  Clock,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const subjectIcons: Record<string, any> = {
  "Toán học": Calculator,
  "Tin học lập trình": Code2,
  "Vật lý": Atom,
  "Hóa học": FlaskConical,
  "Sinh học": Lightbulb,
}

export function TutorsSection() {
  const [selectedSubject, setSelectedSubject] = useState<string>("Tất cả")
  const [visibleCount, setVisibleCount] = useState<number>(3)

  // Find Founder (Nguyên Anh - ID 1)
  const founder = tutors.find((t) => t.id === 1)

  // Subject list extracted dynamically
  const subjectsList = ["Tất cả", "Toán học", "Vật lý", "Hóa học", "Tin học lập trình", "Sinh học"]

  // Filter tutors based on selection
  const filteredTutors = tutors.filter((tutor) => {
    if (selectedSubject === "Tất cả") return true
    return tutor.subjects.includes(selectedSubject)
  })

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject)
    setVisibleCount(3) // Reset to 3 when switching subject
  }

  const renderTutorCard = (tutor: typeof tutors[0], isFounder = false) => {
    return (
      <Card
        key={tutor.id}
        className={`bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col hover:-translate-y-2 ${
          isFounder ? "border-2 border-[#D8B76A] max-w-xl mx-auto ring-4 ring-[#D8B76A]/10" : ""
        }`}
      >
        <CardContent className="p-0 flex flex-col flex-1">
          {/* Header navy band */}
          <div className="bg-[#0F2A44] px-6 pt-6 pb-20 relative">
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Các môn dạy">
              {isFounder && (
                <Badge className="bg-[#0F2A44] text-[#D8B76A] border border-[#D8B76A] font-bold">
                  <Sparkles className="w-3 h-3 mr-1 text-[#D8B76A]" />
                  FOUNDER
                </Badge>
              )}
              {tutor.subjects.map((subject) => {
                const Icon = subjectIcons[subject] || Calculator
                return (
                  <Badge
                    key={subject}
                    className="bg-[#D8B76A] text-[#0F2A44] border-0 font-semibold"
                  >
                    <Icon className="w-3 h-3 mr-1" aria-hidden="true" />
                    {subject}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center -mt-14 relative z-10">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[#D8B76A] group-hover:scale-105 transition-transform duration-300">
              {tutor.avatar.startsWith("http") ? (
                <Image
                  src={tutor.avatar}
                  alt={`Gia sư ${tutor.name}`}
                  width={112}
                  height={112}
                  className={`w-full h-full object-cover ${tutor.avatarPosition}`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] flex items-center justify-center text-white font-bold text-2xl">
                  {tutor.name.split(" ").pop()?.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Name & role */}
          <div className="text-center px-6 mt-3 mb-2">
            <h3 className="text-xl font-bold text-[#0F2A44]">{tutor.name}</h3>
            <p className="text-[#D8B76A] font-semibold text-sm mt-0.5">{tutor.role}</p>
            <p className="text-[#6B7280] text-xs mt-1 leading-relaxed">{tutor.education}</p>
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-6 px-6 py-3 border-y border-[#F3F4F6] mx-6 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Clock className="w-3.5 h-3.5 text-[#D8B76A]" aria-hidden="true" />
              <span>{tutor.experience}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Users className="w-3.5 h-3.5 text-[#D8B76A]" aria-hidden="true" />
              <span>{tutor.students} học sinh</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Star className="w-3.5 h-3.5 text-[#D8B76A]" aria-hidden="true" />
              <span>{tutor.rating}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 flex-1">
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="w-full bg-[#F8F5EC] p-1 mb-4 rounded-lg">
                <TabsTrigger
                  value="story"
                  className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-[#0F2A44] data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <Award className="w-3 h-3 mr-1" aria-hidden="true" />
                  Hành trình
                </TabsTrigger>
                <TabsTrigger
                  value="approach"
                  className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-[#0F2A44] data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <Lightbulb className="w-3 h-3 mr-1" aria-hidden="true" />
                  Phương pháp
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:text-[#0F2A44] data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <Phone className="w-3 h-3 mr-1" aria-hidden="true" />
                  Liên hệ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="mt-0 min-h-[180px]">
                <p className="text-sm text-[#374151] leading-relaxed mb-4">
                  {tutor.narrative}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.keyHighlights.map((highlight, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-[10px] border-[#E5E7EB] text-[#6B7280] font-normal"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="approach" className="mt-0 min-h-[180px]">
                <p className="text-sm text-[#374151] leading-relaxed">
                  {tutor.approach}
                </p>
                {"languages" in tutor && tutor.languages && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[#0F2A44] mb-2 uppercase tracking-wide">
                      Ngôn ngữ & Công nghệ
                    </p>
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

              <TabsContent value="contact" className="mt-0 min-h-[180px]">
                <div className="space-y-3">
                  <a
                    href={`tel:${tutor.contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F5EC] hover:bg-[#f0ebe0] hover:shadow-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-[#D8B76A] focus:ring-offset-2"
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
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F5EC] hover:bg-[#f0ebe0] hover:shadow-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-[#D8B76A] focus:ring-offset-2"
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
              className="w-full bg-[#0F2A44] hover:bg-[#1a3a5c] text-white font-semibold transition-all duration-200 hover:scale-[1.02]"
              asChild
            >
              <Link href="#contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Đặt lịch tư vấn
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section id="tutors" className="py-20 lg:py-28 bg-[#F8F5EC]/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
            Đội ngũ gia sư
          </p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            Những người sẽ đồng hành cùng các em học sinh
          </h2>
          <p className="text-[#6B7280] text-lg text-pretty">
            Mỗi gia sư tại TPA+ là một sinh viên xuất sắc từ các trường Đại học hàng đầu, mang theo câu chuyện riêng và phương pháp giảng dạy độc đáo.
          </p>
        </div>

        {/* 1. Founder Row */}
        {founder && (
          <div className="mb-20 text-center space-y-6">
            <h3 className="font-heading text-2xl font-bold text-[#0F2A44] relative inline-block pb-2 border-b-2 border-[#D8B76A]">
              Founder TPA+
            </h3>
            <div className="max-w-md mx-auto">
              {renderTutorCard(founder, true)}
            </div>
          </div>
        )}

        {/* 2. Subject Filter Tabs */}
        <div className="text-center mb-10">
          <h3 className="text-xl font-bold text-[#0F2A44] mb-4">Đội ngũ Gia sư theo Bộ môn</h3>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {subjectsList.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                className={`text-sm rounded-full px-5 py-1.5 transition-all duration-200 ${
                  selectedSubject === subject
                    ? "bg-[#0F2A44] text-white hover:bg-[#1a3a5c]"
                    : "border-[#0F2A44]/20 text-[#0F2A44] hover:bg-[#0F2A44]/5"
                }`}
                onClick={() => handleSubjectChange(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>

        {/* 3. Tutors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {filteredTutors.slice(0, visibleCount).map((tutor) => renderTutorCard(tutor, false))}
        </div>

        {/* 4. Show More Button */}
        {filteredTutors.length > visibleCount && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setVisibleCount(filteredTutors.length)}
              className="bg-[#0F2A44] hover:bg-[#1a3a5c] text-white font-semibold px-8 py-5 rounded-full shadow-md transition-all duration-200"
            >
              Xem thêm gia sư <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
