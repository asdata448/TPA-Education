"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Phone,
  Mail,
  Facebook,
  MessageCircle,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

const subjects = [
  { id: "toan", label: "Toán học" },
  { id: "ly", label: "Vật lý" },
  { id: "hoa", label: "Hóa học" },
  { id: "tin", label: "Tin học Lập trình" },
]

const goals = [
  { id: "laygoc", label: "Lấy gốc kiến thức" },
  { id: "tangdiem", label: "Tăng điểm số" },
  { id: "onthi", label: "Ôn thi chuyển cấp/THPT QG" },
  { id: "laptrinh", label: "Học lập trình" },
]

export function ContactSection() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subjectId])
    } else {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId))
    }
  }

  const handleGoalChange = (goalId: string, checked: boolean) => {
    if (checked) {
      setSelectedGoals([...selectedGoals, goalId])
    } else {
      setSelectedGoals(selectedGoals.filter((id) => id !== goalId))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
            Liên hệ
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            Đăng ký tư vấn miễn phí
          </h2>
          <p className="text-[#6B7280] text-lg">
            Để lại thông tin, chúng tôi sẽ liên hệ tư vấn trong vòng 24 giờ
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-[#E5E7EB] shadow-lg">
              <CardContent className="p-6 lg:p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F2A44] mb-3">
                      Đã gửi thành công!
                    </h3>
                    <p className="text-[#6B7280]">
                      Chúng tôi sẽ liên hệ bạn trong vòng 24 giờ
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#0F2A44] font-medium">
                          Họ và tên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Nguyễn Văn A"
                          required
                          className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[#0F2A44] font-medium">
                          Số điện thoại <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="0901 234 567"
                          required
                          className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A]"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#0F2A44] font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grade" className="text-[#0F2A44] font-medium">
                          Lớp hiện tại <span className="text-red-500">*</span>
                        </Label>
                        <Select required>
                          <SelectTrigger className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A]">
                            <SelectValue placeholder="Chọn lớp" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">Lớp 6</SelectItem>
                            <SelectItem value="7">Lớp 7</SelectItem>
                            <SelectItem value="8">Lớp 8</SelectItem>
                            <SelectItem value="9">Lớp 9</SelectItem>
                            <SelectItem value="10">Lớp 10</SelectItem>
                            <SelectItem value="11">Lớp 11</SelectItem>
                            <SelectItem value="12">Lớp 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Subject Selection */}
                    <div className="space-y-3">
                      <Label className="text-[#0F2A44] font-medium">
                        Môn học quan tâm <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {subjects.map((subject) => (
                          <div
                            key={subject.id}
                            className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedSubjects.includes(subject.id)
                                ? "border-[#D8B76A] bg-[#F8F5EC]"
                                : "border-[#E5E7EB] hover:border-[#D8B76A]/50"
                            }`}
                            onClick={() =>
                              handleSubjectChange(
                                subject.id,
                                !selectedSubjects.includes(subject.id)
                              )
                            }
                          >
                            <Checkbox
                              id={subject.id}
                              checked={selectedSubjects.includes(subject.id)}
                              onCheckedChange={(checked) =>
                                handleSubjectChange(subject.id, checked as boolean)
                              }
                              className="data-[state=checked]:bg-[#D8B76A] data-[state=checked]:border-[#D8B76A]"
                            />
                            <label
                              htmlFor={subject.id}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {subject.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Goal Selection */}
                    <div className="space-y-3">
                      <Label className="text-[#0F2A44] font-medium">
                        Mục tiêu học tập
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {goals.map((goal) => (
                          <div
                            key={goal.id}
                            className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedGoals.includes(goal.id)
                                ? "border-[#D8B76A] bg-[#F8F5EC]"
                                : "border-[#E5E7EB] hover:border-[#D8B76A]/50"
                            }`}
                            onClick={() =>
                              handleGoalChange(
                                goal.id,
                                !selectedGoals.includes(goal.id)
                              )
                            }
                          >
                            <Checkbox
                              id={goal.id}
                              checked={selectedGoals.includes(goal.id)}
                              onCheckedChange={(checked) =>
                                handleGoalChange(goal.id, checked as boolean)
                              }
                              className="data-[state=checked]:bg-[#D8B76A] data-[state=checked]:border-[#D8B76A]"
                            />
                            <label
                              htmlFor={goal.id}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {goal.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Learning Format */}
                    <div className="space-y-2">
                      <Label htmlFor="format" className="text-[#0F2A44] font-medium">
                        Hình thức học
                      </Label>
                      <Select>
                        <SelectTrigger className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A]">
                          <SelectValue placeholder="Chọn hình thức" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online (Zoom/Google Meet)</SelectItem>
                          <SelectItem value="offline">Offline (Tại nhà)</SelectItem>
                          <SelectItem value="both">Cả hai hình thức</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-[#0F2A44] font-medium">
                        Ghi chú thêm
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Ví dụ: Em muốn học thứ 3, 5, 7 lúc 19h..."
                        rows={4}
                        className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A] resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#D8B76A] text-[#0F2A44] hover:bg-[#c9a555] font-semibold text-base py-6"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Gửi yêu cầu tư vấn
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Contact Card */}
            <Card className="bg-[#0F2A44] border-0">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-white">Liên hệ nhanh</h3>

                <div className="space-y-4">
                  <Link
                    href="tel:0899736669"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#D8B76A] rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#0F2A44]" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Hotline</p>
                      <p className="text-white font-bold">0899 736 669</p>
                    </div>
                  </Link>

                  <Link
                    href="mailto:tpagiasu.education@gmail.com"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#D8B76A] rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#0F2A44]" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Email</p>
                      <p className="text-white font-bold">tpagiasu.education@gmail.com</p>
                    </div>
                  </Link>

                  <Link
                    href="https://facebook.com/tpatutor"
                    target="_blank"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#D8B76A] rounded-xl flex items-center justify-center">
                      <Facebook className="w-6 h-6 text-[#0F2A44]" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Facebook</p>
                      <p className="text-white font-bold">TPA+ Gia Sư</p>
                    </div>
                  </Link>

                  <Link
                    href="https://zalo.me/0899736669"
                    target="_blank"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#D8B76A] rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-[#0F2A44]" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Zalo</p>
                      <p className="text-white font-bold">0899 736 669</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="border border-[#E5E7EB]">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F8F5EC] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#D8B76A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F2A44] mb-1">Khu vực hoạt động</h4>
                    <p className="text-sm text-[#6B7280]">
                      Dĩ An, Thủ Đức, Làng Đại học, và các khu vực lân cận
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F8F5EC] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#D8B76A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F2A44] mb-1">Giờ tư vấn</h4>
                    <p className="text-sm text-[#6B7280]">
                      8:00 - 21:00, Thứ 2 - Chủ nhật
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
