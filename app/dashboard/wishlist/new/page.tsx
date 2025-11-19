import { WishlistForm } from '@/components/wishlist/wishlist-form'
import { createClient } from '@/lib/supabase/server'

export default async function NewWishlistPage() {
  const supabase = await createClient()

  const [{ data: itemTypes }, { data: platforms }] = await Promise.all([
    supabase.from('item_types').select('*').order('name'),
    supabase.from('platforms').select('*').order('name'),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Agregar a Lista de Deseos
        </h1>
        <p className="text-slate-600 mt-2">
          Registra un item que te gustaría conseguir
        </p>
      </div>

      <WishlistForm itemTypes={itemTypes || []} platforms={platforms || []} />
    </div>
  )
}
