'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Package } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteItem } from '@/app/actions/items'

export function ItemDetails({ item, creators, genres, tags }: any) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar este item?')) {
      await deleteItem(item.id)
      router.push('/dashboard/items')
      router.refresh()
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">{item.title}</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/items/${item.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="aspect-[3/4] bg-slate-200 rounded-lg overflow-hidden">
            {item.cover_image_url ? (
              <img
                src={item.cover_image_url || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-slate-400" />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Detalles
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-slate-600">Tipo</dt>
                <dd className="font-medium text-slate-900">
                  {item.item_types?.name || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Plataforma</dt>
                <dd className="font-medium text-slate-900">
                  {item.platforms?.name || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Condición</dt>
                <dd className="font-medium text-slate-900">
                  {item.conditions?.name || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Ubicación</dt>
                <dd className="font-medium text-slate-900">
                  {item.locations?.name || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Editorial</dt>
                <dd className="font-medium text-slate-900">
                  {item.publishers?.name || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Año</dt>
                <dd className="font-medium text-slate-900">
                  {item.release_year || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Precio</dt>
                <dd className="font-medium text-slate-900">
                  {item.purchase_price
                    ? `$${Number(item.purchase_price).toFixed(2)}`
                    : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Calificación</dt>
                <dd className="font-medium text-slate-900">
                  {item.personal_rating
                    ? '★'.repeat(item.personal_rating) +
                      '☆'.repeat(5 - item.personal_rating)
                    : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          {item.description && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Descripción</h3>
              <p className="text-slate-600">{item.description}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
