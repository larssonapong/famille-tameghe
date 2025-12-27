import { supabase, MEMBER_PHOTOS_BUCKET } from '../lib/supabase'

function buildFileName(originalName: string) {
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  const uuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `members/${uuid}.${extension}`
}

export async function uploadMemberPhoto(file: File) {
  const path = buildFileName(file.name)
  const { error } = await supabase.storage.from(MEMBER_PHOTOS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw error
  }

  return path
}

export function getPublicMemberPhotoUrl(path?: string | null) {
  if (!path) return undefined
  const { data } = supabase.storage.from(MEMBER_PHOTOS_BUCKET).getPublicUrl(path)
  return data.publicUrl ?? undefined
}
