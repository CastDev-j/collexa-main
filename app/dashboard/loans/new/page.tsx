import { LoanForm } from '@/components/loans/loan-form'
import { createClient } from '@/lib/supabase/server'

export default async function NewLoanPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('items')
    .select('id, title')
    .order('title')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nuevo Préstamo</h1>
        <p className="text-slate-600 mt-2">
          Registra un item que vas a prestar
        </p>
      </div>

      <LoanForm items={items || []} />
    </div>
  )
}
