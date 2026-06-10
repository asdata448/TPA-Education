'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { uploadTeachingMaterialFile, createTeachingMaterialDownloadUrl, deleteTeachingMaterialFile } from '@/lib/r2/client'
import { requireTutorId } from '../classes-data'

export type BankSettingsState = { error?: string; success?: string }

const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp'])
const MAX_QR_SIZE = 5 * 1024 * 1024 // 5MB

export async function getTutorBankDetails() {
  try {
    const tutorId = await requireTutorId()
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('tutors')
      .select('bank_name, bank_account_no, bank_account_name, bank_qr_key')
      .eq('id', tutorId)
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Unable to load bank details.')
    }

    let qrUrl = null
    if (data.bank_qr_key) {
      try {
        qrUrl = await createTeachingMaterialDownloadUrl(data.bank_qr_key, 600) // Presigned URL for 10 min
      } catch (e) {
        console.error('Failed to sign QR code URL:', e)
      }
    }

    return {
      bankName: data.bank_name || '',
      bankAccountNo: data.bank_account_no || '',
      bankAccountName: data.bank_account_name || '',
      bankQrKey: data.bank_qr_key || '',
      qrUrl,
    }
  } catch (error) {
    console.error('Error fetching tutor bank details:', error)
    return null
  }
}

export async function updateTutorBankSettings(_: BankSettingsState, formData: FormData): Promise<BankSettingsState> {
  const bankName = String(formData.get('bankName') ?? '').trim()
  const bankAccountNo = String(formData.get('bankAccountNo') ?? '').trim()
  const bankAccountName = String(formData.get('bankAccountName') ?? '').trim()
  const file = formData.get('qrFile') as File | null

  if (!bankName || !bankAccountNo || !bankAccountName) {
    return { error: 'All fields are required.' }
  }

  try {
    const tutorId = await requireTutorId()
    const admin = createAdminClient()

    let bankQrKey: string | undefined = undefined

    if (file && file.size > 0) {
      if (file.size > MAX_QR_SIZE) {
        return { error: 'QR Code image must be smaller than 5MB.' }
      }
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return { error: 'Invalid file type. Supported types: PNG, JPEG, WEBP.' }
      }

      // Format: tutors/{tutorId}/bank-qr.{ext}
      const extension = file.type.split('/')[1] || 'jpg'
      const key = `tutors/${tutorId}/bank-qr.${extension}`
      const buffer = Buffer.from(await file.arrayBuffer())

      await uploadTeachingMaterialFile({
        key,
        body: buffer,
        contentType: file.type,
      })
      bankQrKey = key
    }

    // Prepare update object
    const updateData: Record<string, any> = {
      bank_name: bankName,
      bank_account_no: bankAccountNo,
      bank_account_name: bankAccountName,
    }

    if (bankQrKey !== undefined) {
      updateData.bank_qr_key = bankQrKey
    }

    const { error: updateError } = await admin
      .from('tutors')
      .update(updateData)
      .eq('id', tutorId)

    if (updateError) {
      return { error: updateError.message }
    }

    revalidatePath('/dashboard/tutor/bank-settings')
    return { success: 'Bank settings and QR Code updated successfully.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to update bank settings.' }
  }
}
