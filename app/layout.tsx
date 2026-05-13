import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans"
})

export const metadata: Metadata = {
  title: 'Trung Tâm Gia Sư TPA+ | Gia sư Toán/Tin - Lý - Hóa THCS, THPT',
  description: 'TPA+ - Trung tâm gia sư chất lượng cao chuyên Toán, Tin học lập trình, Vật lý, Hóa học cho học sinh THCS & THPT. Dạy kèm 1:1, lộ trình cá nhân hóa, cam kết tiến bộ.',
  keywords: 'gia sư Toán, gia sư Lý, gia sư Hóa, gia sư Tin học, gia sư lập trình, gia sư THCS, gia sư THPT, Dĩ An, Thủ Đức, Làng Đại học',
  openGraph: {
    title: 'Trung Tâm Gia Sư TPA+ | Toán - Lý - Hóa - Tin học',
    description: 'Đội ngũ gia sư tận tâm, phương pháp hiệu quả, cam kết tiến bộ. Đặt lịch học thử ngay!',
    images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7F1LGHwUVdrkFWcqGrYs8GCRBYxQqW.png'],
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="bg-background">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
