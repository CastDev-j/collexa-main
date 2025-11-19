import { LoanForm } from '@/components/loans/loan-form'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditLoanPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: loan } = await supabase
    .from('loans')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!loan) {
    notFound()
  }

  const { data: items } = await supabase
    .from('items')
    .select('id, title')
    .order('title')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Editar Préstamo</h1>
        <p className="text-slate-600 mt-2">Actualiza los detalles del préstamo</p>
      </div>

      <LoanForm loan={loan} items={items || []} />
    </div>
  )
}
