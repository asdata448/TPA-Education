import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { requireActiveAdmin } from './data'

export type MaterialSubject = { id: string; name: string }
export type AdminLibraryItem = {
  id: string
  title: string
  subjectName: string | null
  gradeLevel: string | null
  description: string | null
  active: boolean
  files: Array<{ id: string; fileName: string; mimeType: string | null; sizeBytes: number | null }>
}

export async function getAdminMaterialData() {
  await requireActiveAdmin()
  const admin = createAdminClient()
  const [{ data: subjects, error: subjectsError }, { data: items, error: itemsError }] = await Promise.all([
    admin.from('subjects').select('id,name').eq('active', true).order('name'),
    admin
      .from('teaching_material_library_items')
      .select('id,title,subject_name,grade_level,description,active,teaching_material_library_files(id,file_name,mime_type,size_bytes)')
      .order('created_at', { ascending: false }),
  ])

  if (subjectsError || itemsError) {
    throw new Error(subjectsError?.message || itemsError?.message || 'Unable to load material library data')
  }

  return {
    subjects: (subjects ?? []) as MaterialSubject[],
    items: (items ?? []).map((item: any) => ({
      id: item.id,
      title: item.title,
      subjectName: item.subject_name,
      gradeLevel: item.grade_level,
      description: item.description,
      active: item.active,
      files: (item.teaching_material_library_files ?? []).map((file: any) => ({
        id: file.id,
        fileName: file.file_name,
        mimeType: file.mime_type,
        sizeBytes: file.size_bytes,
      })),
    })) as AdminLibraryItem[],
  }
}

export async function getTutorMaterialLibrary() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role,active').eq('id', user.id).single()
  if (!profile?.active) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('teaching_material_library_items')
    .select('id,title,subject_name,grade_level,description,active,teaching_material_library_files(id,file_name,mime_type,size_bytes)')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    subjectName: item.subject_name,
    gradeLevel: item.grade_level,
    description: item.description,
    active: item.active,
    files: (item.teaching_material_library_files ?? []).map((file: any) => ({
      id: file.id,
      fileName: file.file_name,
      mimeType: file.mime_type,
      sizeBytes: file.size_bytes,
    })),
  })) as AdminLibraryItem[]
}
