'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from '../data'

export type ConsultantActionState = { error?: string; success?: string }

export async function getConsultantRequests() {
  try {
    await requireActiveAdmin()
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('consultant_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return (data || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      grade: r.grade,
      subjects: r.subjects || [],
      goals: r.goals || [],
      format: r.format,
      message: r.message,
      status: r.status,
      adminNotes: r.admin_notes,
      createdAt: r.created_at,
    }))
  } catch (error) {
    console.error('Error fetching consultant requests:', error)
    return []
  }
}

export async function updateConsultantRequest(
  id: string,
  status: string,
  adminNotes: string
): Promise<ConsultantActionState> {
  try {
    await requireActiveAdmin()
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('consultant_requests')
      .update({
        status,
        admin_notes: adminNotes.trim() || null,
      })
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/admin/consultants')
    return { success: 'Đã cập nhật yêu cầu tư vấn thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Không thể cập nhật yêu cầu.' }
  }
}

export async function deleteConsultantRequest(id: string): Promise<ConsultantActionState> {
  try {
    await requireActiveAdmin()
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('consultant_requests')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/admin/consultants')
    return { success: 'Đã xóa yêu cầu tư vấn thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Không thể xóa yêu cầu.' }
  }
}
