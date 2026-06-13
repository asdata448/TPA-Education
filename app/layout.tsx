import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { Toaster } from 'sonner'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans"
})

// Editorial serif for headings (Notion-warm aesthetic)
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tpaeducation.io.vn'),
  title: 'Trung Tâm Gia Sư TPA+ | Gia sư Toán/Tin - Lý - Hóa THCS, THPT',
  description: 'TPA+ - Trung tâm gia sư chất lượng cao chuyên Toán, Tin học lập trình, Vật lý, Hóa học cho học sinh THCS & THPT. Dạy kèm 1:1, lộ trình cá nhân hóa, cam kết tiến bộ.',
  keywords: 'gia sư Toán, gia sư Lý, gia sư Hóa, gia sư Tin học, gia sư lập trình, gia sư THCS, gia sư THPT, Dĩ An, Thủ Đức, Làng Đại học',
  openGraph: {
    title: 'Trung Tâm Gia Sư TPA+ | Toán - Lý - Hóa - Tin học',
    description: 'Đội ngũ gia sư tận tâm, phương pháp hiệu quả, cam kết tiến bộ. Đặt lịch học thử ngay!',
    images: [
      {
        url: '/qc2_2.jpg',
        width: 2752,
        height: 1536,
        alt: 'Trung tâm gia sư TPA+ - Chương trình ưu đãi',
      },
    ],
    type: 'website',
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="bg-background" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${newsreader.variable} font-sans antialiased`}>
        <ScrollProgress />
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Bỏ qua đến nội dung chính
        </a>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <Toaster position="top-right" richColors closeButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
