import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ItemDetails } from '@/components/items/item-details'

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  if (id === 'new') {
    redirect('/dashboard/items/new')
  }

  const supabase = await createClient()

  const { data: item } = await supabase
    .from('items')
    .select(`
      *,
      item_types(name),
      platforms(name),
      conditions(name),
      locations(name),
      publishers(name)
    `)
    .eq('id', id)
    .single()

  if (!item) {
    notFound()
  }

  const { data: itemCreators } = await supabase
    .from('item_creators')
    .select('*, creators(name)')
    .eq('item_id', id)

  const { data: itemGenres } = await supabase
    .from('item_genres')
    .select('*, genres(name)')
    .eq('item_id', id)

  const { data: itemTags } = await supabase
    .from('item_tags')
    .select('*, tags(name, color_hex)')
    .eq('item_id', id)

  return (
    <ItemDetails
      item={item}
      creators={itemCreators || []}
      genres={itemGenres || []}
      tags={itemTags || []}
    />
  )
}
