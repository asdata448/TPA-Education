"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Confetti } from "@/components/ui/confetti"

import { submitConsultantRequest } from "./contact-actions"

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

// Vietnamese phone regex
const VN_PHONE_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/

export function ContactSection() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current)
      }
    }
  }, [])

  const handleSubjectChange = useCallback((subjectId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects(prev => [...prev, subjectId])
    } else {
      setSelectedSubjects(prev => prev.filter((id) => id !== subjectId))
    }
    // Clear error when user makes selection
    if (formError) setFormError("")
  }, [formError])

  const handleGoalChange = useCallback((goalId: string, checked: boolean) => {
    if (checked) {
      setSelectedGoals(prev => [...prev, goalId])
    } else {
      setSelectedGoals(prev => prev.filter((id) => id !== goalId))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate: At least one subject must be selected
    if (selectedSubjects.length === 0) {
      setFormError("Vui lòng chọn ít nhất một môn học")
      return
    }

    setIsSubmitting(true)
    setFormError("")

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      
      // Append array items
      selectedSubjects.forEach((sub) => formData.append("subjects", sub))
      selectedGoals.forEach((gl) => formData.append("goals", gl))

      const res = await submitConsultantRequest({}, formData)

      if (res.error) {
        setFormError(res.error)
      } else {
        setIsSubmitted(true)
        setSelectedSubjects([])
        setSelectedGoals([])
        form.reset()

        // Reset status after 3 seconds with cleanup
        submitTimeoutRef.current = setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      }
    } catch (err: any) {
      setFormError(err.message || "Đã xảy ra lỗi khi gửi yêu cầu tư vấn.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <Confetti trigger={isSubmitted} />
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#D8B76A] font-semibold text-sm uppercase tracking-wider mb-3">
            Liên hệ
          </p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#0F2A44] mb-4 text-balance">
            Đăng ký tư vấn miễn phí
          </h2>
          <p className="text-[#6B7280] text-lg">
            Để lại thông tin, chúng tôi sẽ liên hệ tư vấn trong vòng 24 giờ
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-[#E5E7EB] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 lg:p-8">
                {isSubmitted ? (
                  <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Form Error */}
                    {formError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800" role="alert">{formError}</p>
                      </div>
                    )}

                    {/* Personal Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#0F2A44] font-medium">
                          Họ và tên học sinh <span className="text-red-500" aria-label="Bắt buộc">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Nguyễn Văn A"
                          required
                          autoComplete="name"
                          className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A] transition-all duration-200"
                          aria-describedby="name-error"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[#0F2A44] font-medium">
                          Số điện thoại <span className="text-red-500" aria-label="Bắt buộc">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="0901 234 567"
                          required
                          pattern={VN_PHONE_REGEX.source}
                          autoComplete="tel"
                          className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A] transition-all duration-200"
                          aria-describedby="phone-error"
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
                          name="email"
                          type="email"
                          placeholder="email@example.com"
                          autoComplete="email"
                          className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A] transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grade" className="text-[#0F2A44] font-medium">
                          Lớp hiện tại <span className="text-red-500" aria-label="Bắt buộc">*</span>
                        </Label>
                        <Select name="grade" required>
                          <SelectTrigger className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A] transition-all duration-200">
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
                    <fieldset className="space-y-3">
                      <Legend className="text-[#0F2A44] font-medium">
                        Môn học quan tâm <span className="text-red-500" aria-label="Bắt buộc">*</span>
                      </Legend>
                      {formError && selectedSubjects.length === 0 && (
                        <p id="subjects-error" className="text-sm text-red-600" role="alert">
                          {formError}
                        </p>
                      )}
                      <div
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                        role="group"
                        aria-label="Chọn môn học"
                        aria-describedby={formError && selectedSubjects.length === 0 ? "subjects-error" : undefined}
                      >
                        {subjects.map((subject) => {
                          const isSelected = selectedSubjects.includes(subject.id)
                          return (
                            <div
                              key={subject.id}
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                isSelected
                                  ? "border-[#D8B76A] bg-[#F8F5EC] shadow-sm"
                                  : "border-[#E5E7EB] hover:border-[#D8B76A]/50 hover:shadow-sm",
                                formError && selectedSubjects.length === 0 && "border-red-300"
                              )}
                            >
                              <Checkbox
                                id={subject.id}
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleSubjectChange(subject.id, checked as boolean)
                                }
                                className="data-[state=checked]:bg-[#D8B76A] data-[state=checked]:border-[#D8B76A]"
                              />
                              <label
                                htmlFor={subject.id}
                                className="text-sm font-medium cursor-pointer select-none"
                              >
                                {subject.label}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </fieldset>

                    {/* Goal Selection */}
                    <fieldset className="space-y-3">
                      <Legend className="text-[#0F2A44] font-medium">
                        Mục tiêu học tập
                      </Legend>
                      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Chọn mục tiêu">
                        {goals.map((goal) => {
                          const isSelected = selectedGoals.includes(goal.id)
                          return (
                            <div
                              key={goal.id}
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                isSelected
                                  ? "border-[#D8B76A] bg-[#F8F5EC] shadow-sm"
                                  : "border-[#E5E7EB] hover:border-[#D8B76A]/50 hover:shadow-sm"
                              )}
                            >
                              <Checkbox
                                id={goal.id}
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleGoalChange(goal.id, checked as boolean)
                                }
                                className="data-[state=checked]:bg-[#D8B76A] data-[state=checked]:border-[#D8B76A]"
                              />
                              <label
                                htmlFor={goal.id}
                                className="text-sm font-medium cursor-pointer select-none"
                              >
                                {goal.label}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </fieldset>

                    {/* Learning Format */}
                    <div className="space-y-2">
                      <Label htmlFor="format" className="text-[#0F2A44] font-medium">
                        Hình thức học
                      </Label>
                      <Select name="format">
                        <SelectTrigger className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A] transition-all duration-200">
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
                        name="message"
                        placeholder="Ví dụ: Em muốn học thứ 3, 5, 7 lúc 19h..."
                        rows={4}
                        maxLength={500}
                        className="border-[#E5E7EB] focus:border-[#D8B76A] focus:ring-[#D8B76A] resize-none transition-all duration-200"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-[#D8B76A] text-[#0F2A44] hover:bg-[#c9a555] font-semibold text-base py-6 transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-[#0F2A44] border-t-transparent rounded-full animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Gửi yêu cầu tư vấn
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Contact Card */}
            <Card className="bg-[#0F2A44] border-0 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-white">Liên hệ nhanh</h3>

                <div className="space-y-4">
                  <Link
                    href="tel:0899736669"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 group cursor-pointer focus:ring-2 focus:ring-[#D8B76A] focus:ring-offset-2 focus:ring-offset-[#0F2A44]"
                  >
                    <div className="w-12 h-12 bg-[#D8B76A] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Phone className="w-6 h-6 text-[#0F2A44]" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Hotline</p>
                      <p className="text-white font-bold">0899 736 669</p>
                    </div>
                  </Link>

                  <Link
                    href="mailto:tpagiasu.education@gmail.com"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 group cursor-pointer focus:ring-2 focus:ring-[#D8B76A] focus:ring-offset-2 focus:ring-offset-[#0F2A44]"
                  >
                    <div className="w-12 h-12 bg-[#D8B76A] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Mail className="w-6 h-6 text-[#0F2A44]" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Email</p>
                      <p className="text-white font-bold break-all">tpagiasu.education@gmail.com</p>
                    </div>
                  </Link>

                  <Link
                    href="https://facebook.com/tpatutor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 group cursor-pointer focus:ring-2 focus:ring-[#D8B76A] focus:ring-offset-2 focus:ring-offset-[#0F2A44]"
                  >
                    <div className="w-12 h-12 bg-[#D8B76A] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 group cursor-pointer focus:ring-2 focus:ring-[#D8B76A] focus:ring-offset-2 focus:ring-offset-[#0F2A44]"
                  >
                    <div className="w-12 h-12 bg-[#D8B76A] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
            <Card className="border border-[#E5E7EB] hover:shadow-lg transition-shadow duration-300">
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

// Helper component for fieldset legend
function Legend({ className, children }: { className?: string; children: React.ReactNode }) {
  return <legend className={className}>{children}</legend>
}
