import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Package, Users, Heart, TrendingUp } from 'lucide-react'

export async function StatsCards() {
  const supabase = await createClient()

  const { count: itemsCount } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })

  const { count: loansCount } = await supabase
    .from('loans')
    .select('*', { count: 'exact', head: true })
    .eq('is_returned', false)

  const { count: wishlistCount } = await supabase
    .from('wishlist')
    .select('*', { count: 'exact', head: true })

  const { data: items } = await supabase
    .from('items')
    .select('purchase_price')
    .not('purchase_price', 'is', null)

  const totalValue = items?.reduce(
    (acc, item) => acc + (Number(item.purchase_price) || 0),
    0
  )

  const stats = [
    {
      label: 'Total Items',
      value: itemsCount || 0,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-orange-50',
    },
    {
      label: 'Préstamos Activos',
      value: loansCount || 0,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-orange-50',
    },
    {
      label: 'Lista de Deseos',
      value: wishlistCount || 0,
      icon: Heart,
      color: 'text-primary',
      bg: 'bg-orange-50',
    },
    {
      label: 'Valor Total',
      value: `$${(totalValue || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div className={cn('p-3 rounded-sm', stat.bg)}>
                <Icon className={cn('h-6 w-6', stat.color)} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
