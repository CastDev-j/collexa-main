'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Edit, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteWishlistItem } from '@/app/actions/wishlist'

interface WishlistItem {
  id: number
  title: string
  estimated_price: number | null
  priority: string | null
  url_link: string | null
  item_types: { name: string } | null
  platforms: { name: string } | null
}

const priorityColors = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200',
}

const priorityLabels = {
  High: 'Alta',
  Medium: 'Media',
  Low: 'Baja',
}

export function WishlistGrid({ items }: { items: WishlistItem[] }) {
  const router = useRouter()

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este item?')) {
      await deleteWishlistItem(id)
      router.refresh()
    }
  }

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">Tu lista de deseos está vacía</p>
        <Link href="/dashboard/wishlist/new">
          <Button className="mt-4">Agregar tu primer deseo</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-lg">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600">
                {item.item_types?.name || 'Sin tipo'}
                {item.platforms?.name && ` • ${item.platforms.name}`}
              </p>
            </div>
            {item.priority && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-sm border ${
                  priorityColors[item.priority as keyof typeof priorityColors]
                }`}
              >
                {priorityLabels[item.priority as keyof typeof priorityLabels]}
              </span>
            )}
          </div>

          {item.estimated_price && (
            <p className="text-lg font-semibold text-orange-600">
              ${Number(item.estimated_price).toFixed(2)}
            </p>
          )}

          <div className="flex gap-2">
            {item.url_link && (
              <a
                href={item.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Link
                </Button>
              </a>
            )}
            <Link href={`/dashboard/wishlist/${item.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
