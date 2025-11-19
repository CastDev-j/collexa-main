'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Plus } from 'lucide-react'
import Link from 'next/link'

interface Item {
  id: number
  title: string
  created_at: string
  cover_image_url: string | null
}

export function RecentItems({ items }: { items: Item[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Items Recientes</h2>
        <Link href="/dashboard/items/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No hay items aún</p>
          <Link href="/dashboard/items/new">
            <Button variant="outline" className="mt-4">
              Agregar tu primer item
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/items/${item.id}`}
              className="flex items-center gap-3 p-3 rounded-sm hover:bg-slate-50 transition-colors"
            >
              <div className="h-12 w-12 bg-slate-200 rounded-sm flex items-center justify-center flex-shrink-0">
                {item.cover_image_url ? (
                  <img
                    src={item.cover_image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover rounded-sm"
                  />
                ) : (
                  <Package className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">
                  {item.title}
                </p>
                <p className="text-sm text-slate-600">
                  {new Date(item.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}
