import { createClient } from '@/lib/supabase/server'
import { LoansTable } from '@/components/loans/loans-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function LoansPage() {
  const supabase = await createClient()

  const { data: loans } = await supabase
    .from('loans')
    .select('*, items(title, cover_image_url)')
    .order('loan_date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Préstamos</h1>
          <p className="text-slate-600 mt-2">
            Gestiona los items que has prestado
          </p>
        </div>
        <Link href="/dashboard/loans/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Préstamo
          </Button>
        </Link>
      </div>

      <LoansTable loans={loans || []} />
    </div>
  )
}
