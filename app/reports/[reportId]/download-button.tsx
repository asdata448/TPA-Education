'use client'

import { useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import { ImageIcon, Loader2, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function DownloadButton({ studentName, month }: { studentName: string; month: string }) {
  const [downloading, setDownloading] = useState(false)
  const [copying, setCopying] = useState(false)

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

  const copyPng = async () => {
    const node = document.getElementById('report-card')
    if (!node) {
      toast.error('Không tìm thấy phiếu báo cáo để sao chép.')
      return
    }

    setCopying(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const blob = await toBlob(node, {
        cacheBust: true,
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: node.offsetWidth + 'px',
          height: node.offsetHeight + 'px'
        }
      })

      if (!blob) {
        throw new Error('Không tạo được dữ liệu ảnh.')
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      toast.success('Đã sao chép ảnh báo cáo vào bộ nhớ tạm!')
    } catch (error) {
      console.error('Error copying PNG:', error)
      toast.error('Lỗi khi sao chép ảnh báo cáo. Vui lòng thử lại.')
    } finally {
      setCopying(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={downloadPng}
        disabled={downloading || copying}
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

      <button
        onClick={copyPng}
        disabled={downloading || copying}
        className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50 border-0"
      >
        {copying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Đang sao chép...
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Sao chép ảnh báo cáo
          </>
        )}
      </button>
    </div>
  )
}
