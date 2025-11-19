import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentItems } from '@/components/dashboard/recent-items'
import { ActiveLoans } from '@/components/dashboard/active-loans'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  const { data: loans } = await supabase
    .from('loans')
    .select('*, items(title)')
    .eq('is_returned', false)
    .limit(5)

  const { data: wishlist } = await supabase
    .from('wishlist')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Resumen de tu colección personal
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentItems items={items || []} />
        <ActiveLoans loans={loans || []} />
      </div>
    </div>
  )
}
