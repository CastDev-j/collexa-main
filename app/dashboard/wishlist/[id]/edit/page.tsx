import { WishlistForm } from '@/components/wishlist/wishlist-form'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditWishlistPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('wishlist')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!item) {
    notFound()
  }

  const [{ data: itemTypes }, { data: platforms }] = await Promise.all([
    supabase.from('item_types').select('*').order('name'),
    supabase.from('platforms').select('*').order('name'),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Editar Item de Lista de Deseos
        </h1>
        <p className="text-slate-600 mt-2">Actualiza los detalles del item</p>
      </div>

      <WishlistForm
        item={item}
        itemTypes={itemTypes || []}
        platforms={platforms || []}
      />
    </div>
  )
}
