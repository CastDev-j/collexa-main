'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createItem(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const itemData: any = {
    user_id: user.id,
    title: formData.get('title'),
    description: formData.get('description'),
    item_type_id: formData.get('item_type_id'),
    platform_id: formData.get('platform_id') || null,
    publisher_id: formData.get('publisher_id') || null,
    location_id: formData.get('location_id') || null,
    condition_id: formData.get('condition_id') || null,
    release_year: formData.get('release_year') || null,
    purchase_date: formData.get('purchase_date') || null,
    purchase_price: formData.get('purchase_price') || null,
    personal_rating: formData.get('personal_rating') || null,
    cover_image_url: formData.get('cover_image_url') || null,
  }

  const { error } = await supabase.from('items').insert(itemData)

  if (error) throw error

  revalidatePath('/dashboard/items')
  revalidatePath('/dashboard')
}

export async function updateItem(id: number, formData: FormData) {
  const supabase = await createClient()

  const itemData: any = {
    title: formData.get('title'),
    description: formData.get('description'),
    item_type_id: formData.get('item_type_id'),
    platform_id: formData.get('platform_id') || null,
    publisher_id: formData.get('publisher_id') || null,
    location_id: formData.get('location_id') || null,
    condition_id: formData.get('condition_id') || null,
    release_year: formData.get('release_year') || null,
    purchase_date: formData.get('purchase_date') || null,
    purchase_price: formData.get('purchase_price') || null,
    personal_rating: formData.get('personal_rating') || null,
    cover_image_url: formData.get('cover_image_url') || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('items').update(itemData).eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard/items')
  revalidatePath(`/dashboard/items/${id}`)
  revalidatePath('/dashboard')
}

export async function deleteItem(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from('items').delete().eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard/items')
  revalidatePath('/dashboard')
}
