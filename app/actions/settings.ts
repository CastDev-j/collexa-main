'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLocation(name: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const { error } = await supabase
    .from('locations')
    .insert({ user_id: user.id, name })

  if (error) throw error

  revalidatePath('/dashboard/settings')
}

export async function deleteLocation(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from('locations').delete().eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard/items')
}

export async function createTag(name: string, colorHex: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const { error } = await supabase
    .from('tags')
    .insert({ user_id: user.id, name, color_hex: colorHex })

  if (error) throw error

  revalidatePath('/dashboard/settings')
}

export async function deleteTag(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from('tags').delete().eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard/settings')
}
