'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export type SubmitConsultantState = {
  error?: string
  success?: string
}

export async function submitConsultantRequest(
  _previousState: SubmitConsultantState,
  formData: FormData
): Promise<SubmitConsultantState> {
  const name = String(formData.get('name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim() || null
  const grade = String(formData.get('grade') ?? '').trim()
  const format = String(formData.get('format') ?? '').trim() || null
  const message = String(formData.get('message') ?? '').trim() || null
  
  // Parse arrays
  const subjects = formData.getAll('subjects').map(String)
  const goals = formData.getAll('goals').map(String)

  if (!name || !phone || !grade || subjects.length === 0) {
    return { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc (Họ tên, Số điện thoại, Lớp, Môn học).' }
  }

  // Basic phone validation
  const VN_PHONE_REGEX = /^(03|05|07|08|09)\d{8}$/
  if (!VN_PHONE_REGEX.test(phone.replace(/\s+/g, ''))) {
    return { error: 'Số điện thoại không hợp lệ (phải gồm 10 chữ số tại Việt Nam).' }
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('consultant_requests').insert({
      name,
      phone,
      email,
      grade,
      subjects,
      goals,
      format,
      message,
      status: 'pending',
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: 'Đã gửi yêu cầu tư vấn thành công!' }
  } catch (err: any) {
    console.error('Error submitting consultant request:', err)
    return { error: err.message || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại.' }
  }
}
