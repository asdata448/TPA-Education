'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createLibraryObjectKey, uploadTeachingMaterialFile } from '@/lib/r2/client'
import { requireActiveAdmin } from './data'

export type MaterialActionState = { error?: string; success?: string }

export async function createMaterialItem(_: MaterialActionState, formData: FormData): Promise<MaterialActionState> {
  const title = String(formData.get('title') ?? '').trim()
  const subjectName = String(formData.get('subjectName') ?? '').trim() || null
  const gradeLevel = String(formData.get('gradeLevel') ?? '').trim() || null
  const description = String(formData.get('description') ?? '').trim() || null
  const active = formData.get('active') === 'on'
  const files = formData.getAll('files').filter((value): value is File => value instanceof File && value.size > 0)

  if (!title) return { error: 'Material title is required.' }
  if (files.length === 0) return { error: 'Attach at least one file.' }

  try {
    const adminProfile = await requireActiveAdmin()
    const admin = createAdminClient()
    const { data: item, error: itemError } = await admin
      .from('teaching_material_library_items')
      .insert({ title, subject_name: subjectName, grade_level: gradeLevel, description, active, created_by_profile_id: adminProfile.id })
      .select('id')
      .single()

    if (itemError || !item) return { error: itemError?.message || 'Unable to create material item.' }

    for (const file of files) {
      const key = createLibraryObjectKey(item.id, file.name)
      const buffer = Buffer.from(await file.arrayBuffer())
      await uploadTeachingMaterialFile({ key, body: buffer, contentType: file.type || undefined })
      const { error: fileError } = await admin.from('teaching_material_library_files').insert({
        library_item_id: item.id,
        r2_key: key,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
        uploaded_by_profile_id: adminProfile.id,
      })
      if (fileError) return { error: fileError.message }
    }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/tutor/library')
    return { success: 'Teaching material uploaded.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to upload teaching material.' }
  }
}
