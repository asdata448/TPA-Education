'use client'

import { useState } from 'react'
import { toPng } from 'html-to-image'
import { ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function DownloadButton({ studentName, month }: { studentName: string; month: string }) {
  const [downloading, setDownloading] = useState(false)

  const downloadPng = async () => {
    const node = document.getElementById('report-card')
    if (!node) {
      toast.error('Không tìm thấy phiếu báo cáo để tải.')
      return
    }

    setDownloading(true)
    try {
      // Wait a moment for R2 image and assets to stabilize
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2, // High resolution output
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: node.offsetWidth + 'px',
          height: node.offsetHeight + 'px'
        }
      })
      
      const link = document.createElement('a')
      const formattedName = studentName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '_')
      link.download = `Bao_Cao_TPA_${formattedName}_${month}.png`
      link.href = dataUrl
      link.click()
      toast.success('Đã tải ảnh báo cáo PNG thành công!')
    } catch (error) {
      console.error('Error exporting PNG:', error)
      toast.error('Lỗi khi tải ảnh báo cáo. Vui lòng thử lại.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={downloadPng}
      disabled={downloading}
      className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50 border-0"
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Đang xuất ảnh...
        </>
      ) : (
        <>
          <ImageIcon className="h-4 w-4" /> Tải về ảnh báo cáo (PNG)
        </>
      )}
    </button>
  )
}
