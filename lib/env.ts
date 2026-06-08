type PublicEnvKey = "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
type ServerEnvKey = PublicEnvKey | "SUPABASE_SERVICE_ROLE_KEY" | "BOOTSTRAP_ADMIN_EMAIL" | "CLOUDFLARE_ACCOUNT_ID" | "CLOUDFLARE_R2_BUCKET" | "R2_ACCESS_KEY_ID" | "R2_SECRET_ACCESS_KEY" | "R2_ENDPOINT"

function readEnv(key: ServerEnvKey) {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

export function requiredPublicEnv(key: PublicEnvKey) {
  return readEnv(key)
}

export function requiredServerEnv(key: ServerEnvKey) {
  return readEnv(key)
}
