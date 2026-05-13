import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, Facebook, MapPin } from "lucide-react"

const footerLinks = {
  subjects: [
    { label: "Toán học", href: "#subjects" },
    { label: "Vật lý", href: "#subjects" },
    { label: "Hóa học", href: "#subjects" },
    { label: "Tin học Lập trình", href: "#subjects" },
  ],
  info: [
    { label: "Về chúng tôi", href: "#about" },
    { label: "Đội ngũ gia sư", href: "#tutors" },
    { label: "Gói học & Học phí", href: "#packages" },
    { label: "Câu hỏi thường gặp", href: "#faq" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="bg-[#0F2A44] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="#home" className="flex items-center gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NLxJNyWoYzdwoFfmXDqnXTfschlJc2.png"
                alt="TPA+ Logo"
                width={56}
                height={56}
                className="rounded-full"
              />
              <div>
                <p className="font-bold text-xl text-white">TPA+</p>
                <p className="text-sm text-white/70">Trung Tâm Gia Sư</p>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Trung tâm gia sư chất lượng cao chuyên Toán, Tin học lập trình, Vật lý, Hóa học 
              cho học sinh THCS và THPT tại Dĩ An, Thủ Đức và các khu vực lân cận.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://facebook.com/tpatutor"
                target="_blank"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D8B76A] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:tpatutor@gmail.com"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D8B76A] transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Liên hệ</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D8B76A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">0898 232 279</p>
                  <p className="text-sm text-white/70">Hotline tư vấn</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D8B76A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">tpatutor@gmail.com</p>
                  <p className="text-sm text-white/70">Email liên hệ</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D8B76A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Dĩ An, Thủ Đức</p>
                  <p className="text-sm text-white/70">Khu vực hoạt động</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Môn học</h4>
            <ul className="space-y-3">
              {footerLinks.subjects.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#D8B76A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Thông tin</h4>
            <ul className="space-y-3">
              {footerLinks.info.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#D8B76A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>&copy; 2024 TPA+ Trung Tâm Gia Sư. Tất cả quyền được bảo lưu.</p>
            <p>Tận tâm - Phương pháp - A+</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
