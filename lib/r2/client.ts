import 'server-only'

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { requiredServerEnv } from '@/lib/env'

const bucketName = () => requiredServerEnv('CLOUDFLARE_R2_BUCKET')

export function createR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: requiredServerEnv('R2_ENDPOINT'),
    credentials: {
      accessKeyId: requiredServerEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requiredServerEnv('R2_SECRET_ACCESS_KEY'),
    },
  })
}

export function sanitizeR2FileName(fileName: string) {
  return fileName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export function createLibraryObjectKey(libraryItemId: string, fileName: string) {
  const safeFileName = sanitizeR2FileName(fileName) || 'material-file'
  return `library/${libraryItemId}/${Date.now()}-${safeFileName}`
}

export async function uploadTeachingMaterialFile(input: {
  key: string
  body: Buffer | Uint8Array | string
  contentType?: string
}) {
  const client = createR2Client()
  await client.send(new PutObjectCommand({
    Bucket: bucketName(),
    Key: input.key,
    Body: input.body,
    ContentType: input.contentType,
  }))
}

export async function createTeachingMaterialDownloadUrl(key: string, expiresInSeconds = 300) {
  const client = createR2Client()
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucketName(), Key: key }),
    { expiresIn: expiresInSeconds }
  )
}
