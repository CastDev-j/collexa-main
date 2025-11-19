'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const profileData = {
    username: formData.get('username'),
    full_name: formData.get('full_name'),
    bio: formData.get('bio'),
    website: formData.get('website'),
    avatar_url: formData.get('avatar_url'),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id)

  if (error) throw error

  revalidatePath('/dashboard/settings')
}
