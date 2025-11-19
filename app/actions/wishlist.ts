'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWishlistItem(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const wishlistData = {
    user_id: user.id,
    title: formData.get('title'),
    item_type_id: formData.get('item_type_id') || null,
    platform_id: formData.get('platform_id') || null,
    estimated_price: formData.get('estimated_price') || null,
    priority: formData.get('priority') || 'Medium',
    url_link: formData.get('url_link') || null,
  }

  const { error } = await supabase.from('wishlist').insert(wishlistData)

  if (error) throw error

  revalidatePath('/dashboard/wishlist')
  revalidatePath('/dashboard')
}

export async function updateWishlistItem(id: number, formData: FormData) {
  const supabase = await createClient()

  const wishlistData = {
    title: formData.get('title'),
    item_type_id: formData.get('item_type_id') || null,
    platform_id: formData.get('platform_id') || null,
    estimated_price: formData.get('estimated_price') || null,
    priority: formData.get('priority') || 'Medium',
    url_link: formData.get('url_link') || null,
  }

  const { error } = await supabase
    .from('wishlist')
    .update(wishlistData)
    .eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard/wishlist')
  revalidatePath('/dashboard')
}

export async function deleteWishlistItem(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from('wishlist').delete().eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard/wishlist')
  revalidatePath('/dashboard')
}
