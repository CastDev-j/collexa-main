import { ItemForm } from '@/components/items/item-form'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'

export default async function EditItemPage({
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
    .select('*')
    .eq('id', id)
    .single()

  if (!item) {
    notFound()
  }

  const [
    { data: itemTypes },
    { data: platforms },
    { data: conditions },
    { data: locations },
    { data: publishers },
    { data: creators },
    { data: genres },
  ] = await Promise.all([
    supabase.from('item_types').select('*').order('name'),
    supabase.from('platforms').select('*').order('name'),
    supabase.from('conditions').select('*').order('name'),
    supabase.from('locations').select('*').order('name'),
    supabase.from('publishers').select('*').order('name'),
    supabase.from('creators').select('*').order('name'),
    supabase.from('genres').select('*').order('name'),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Editar Item</h1>
        <p className="text-slate-600 mt-2">Actualiza los detalles del item</p>
      </div>

      <ItemForm
        item={item}
        itemTypes={itemTypes || []}
        platforms={platforms || []}
        conditions={conditions || []}
        locations={locations || []}
        publishers={publishers || []}
        creators={creators || []}
        genres={genres || []}
      />
    </div>
  )
}
