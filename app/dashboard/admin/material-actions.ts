'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteTeachingMaterialFile, createLibraryObjectKey, uploadTeachingMaterialFile } from '@/lib/r2/client'
import { requireActiveAdmin } from './data'

export type MaterialActionState = { error?: string; success?: string }
const ALLOWED_TYPES = new Set(['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','image/png','image/jpeg','image/webp','text/plain'])
const MAX_FILE_SIZE = 25 * 1024 * 1024

function validateFiles(files: File[], options: { requireAtLeastOne?: boolean } = {}) {
  if (options.requireAtLeastOne && files.length === 0) return 'Attach at least one file.'
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) return `${file.name} exceeds the 25MB limit.`
    if (file.type && !ALLOWED_TYPES.has(file.type)) return `${file.name} has an unsupported file type.`
  }
  return null
}

export async function createMaterialItem(_: MaterialActionState, formData: FormData): Promise<MaterialActionState> {
  const title = String(formData.get('title') ?? '').trim()
  const subjectName = String(formData.get('subjectName') ?? '').trim() || null
  const gradeLevel = String(formData.get('gradeLevel') ?? '').trim() || null
  const description = String(formData.get('description') ?? '').trim() || null
  const active = formData.get('active') === 'on'
  const files = formData.getAll('files').filter((value): value is File => value instanceof File && value.size > 0)

  if (!title) return { error: 'Material title is required.' }
  const fileValidationError = validateFiles(files, { requireAtLeastOne: true })
  if (fileValidationError) return { error: fileValidationError }

  try {
    const adminProfile = await requireActiveAdmin()
    const admin = createAdminClient()
    const { data: item, error: itemError } = await admin
      .from('teaching_material_library_items')
      .insert({ title, subject_name: subjectName, grade_level: gradeLevel, description, active, created_by_profile_id: adminProfile.id })
      .select('id')
      .single()

    if (itemError || !item) return { error: itemError?.message || 'Unable to create material item.' }

    const uploadedKeys: string[] = []
    try {
      for (const file of files) {
        const key = createLibraryObjectKey(item.id, file.name)
        const buffer = Buffer.from(await file.arrayBuffer())
        await uploadTeachingMaterialFile({ key, body: buffer, contentType: file.type || undefined })
        uploadedKeys.push(key)
        const { error: fileError } = await admin.from('teaching_material_library_files').insert({
          library_item_id: item.id,
          r2_key: key,
          file_name: file.name,
          mime_type: file.type || null,
          size_bytes: file.size,
          uploaded_by_profile_id: adminProfile.id,
        })
        if (fileError) throw new Error(fileError.message)
      }
    } catch (error) {
      await Promise.all(uploadedKeys.map((key) => deleteTeachingMaterialFile(key).catch(() => undefined)))
      await admin.from('teaching_material_library_items').delete().eq('id', item.id)
      throw error
    }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/tutor/library')
    return { success: 'Teaching material uploaded.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to upload teaching material.' }
  }
}
export async function updateMaterialItem(_: MaterialActionState, formData: FormData): Promise<MaterialActionState> {
  const itemId = String(formData.get('itemId') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const subjectName = String(formData.get('subjectName') ?? '').trim() || null
  const gradeLevel = String(formData.get('gradeLevel') ?? '').trim() || null
  const description = String(formData.get('description') ?? '').trim() || null
  const active = formData.get('active') === 'on'
  const files = formData.getAll('files').filter((value): value is File => value instanceof File && value.size > 0)
  if (!itemId || !title) return { error: 'Material title is required.' }
  const fileValidationError = validateFiles(files)
  if (fileValidationError) return { error: fileValidationError }
  try {
    const adminProfile = await requireActiveAdmin()
    const admin = createAdminClient()
    const { error } = await admin.from('teaching_material_library_items').update({ title, subject_name: subjectName, grade_level: gradeLevel, description, active }).eq('id', itemId)
    if (error) return { error: error.message }
    for (const file of files) {
      const key = createLibraryObjectKey(itemId, file.name)
      const buffer = Buffer.from(await file.arrayBuffer())
      await uploadTeachingMaterialFile({ key, body: buffer, contentType: file.type || undefined })
      const { error: fileError } = await admin.from('teaching_material_library_files').insert({
        library_item_id: itemId,
        r2_key: key,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
        uploaded_by_profile_id: adminProfile.id,
      })
      if (fileError) {
        await deleteTeachingMaterialFile(key).catch(() => undefined)
        return { error: fileError.message }
      }
    }
    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/tutor/library')
    return { success: 'Material updated.' }
  } catch (error) { return { error: error instanceof Error ? error.message : 'Unable to update material.' } }
}

export async function deleteMaterialItem(_: MaterialActionState, formData: FormData): Promise<MaterialActionState> {
  const itemId = String(formData.get('itemId') ?? '').trim()
  if (!itemId) return { error: 'Material item not found.' }
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()
    const { data: files, error: fileLoadError } = await admin.from('teaching_material_library_files').select('id,r2_key').eq('library_item_id', itemId)
    if (fileLoadError) return { error: fileLoadError.message }
    const { error } = await admin.from('teaching_material_library_items').delete().eq('id', itemId)
    if (error) return { error: error.message }
    await Promise.all((files ?? []).map((file) => deleteTeachingMaterialFile(file.r2_key).catch(() => undefined)))
    revalidatePath('/dashboard/admin'); revalidatePath('/dashboard/tutor/library')
    return { success: 'Material deleted.' }
  } catch (error) { return { error: error instanceof Error ? error.message : 'Unable to delete material.' } }
}

export async function deleteMaterialFile(_: MaterialActionState, formData: FormData): Promise<MaterialActionState> {
  const fileId = String(formData.get('fileId') ?? '').trim()
  const itemId = String(formData.get('itemId') ?? '').trim()
  if (!fileId || !itemId) return { error: 'File not found.' }
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()
    const { data: file, error: fileError } = await admin.from('teaching_material_library_files').select('r2_key').eq('id', fileId).single()
    if (fileError || !file) return { error: fileError?.message || 'File not found.' }
    const { error } = await admin.from('teaching_material_library_files').delete().eq('id', fileId)
    if (error) return { error: error.message }
    await deleteTeachingMaterialFile(file.r2_key).catch(() => undefined)
    revalidatePath('/dashboard/admin'); revalidatePath('/dashboard/tutor/library')
    return { success: 'File deleted.' }
  } catch (error) { return { error: error instanceof Error ? error.message : 'Unable to delete file.' } }
}
