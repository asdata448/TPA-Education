import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createTeachingMaterialDownloadUrl } from '@/lib/r2/client'

export async function GET(_request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role,active').eq('id', user.id).single()
  if (!profile?.active) return new Response('Unauthorized', { status: 401 })

  const admin = createAdminClient()
  const { data: file, error } = await admin
    .from('teaching_material_library_files')
    .select('r2_key, teaching_material_library_items(active)')
    .eq('id', fileId)
    .single()

  if (error || !file) return new Response('Not found', { status: 404 })
  const item = Array.isArray(file.teaching_material_library_items) ? file.teaching_material_library_items[0] : file.teaching_material_library_items
  if (profile.role !== 'admin' && !item?.active) return new Response('Not found', { status: 404 })

  const url = await createTeachingMaterialDownloadUrl(file.r2_key, 300)
  redirect(url)
}
