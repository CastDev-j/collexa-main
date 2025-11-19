'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { createLocation, deleteLocation } from '@/app/actions/settings'
import { useRouter } from 'next/navigation'

export function LocationsSettings({ locations }: { locations: any[] }) {
  const router = useRouter()
  const [newLocation, setNewLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLocation.trim()) return

    setLoading(true)
    try {
      await createLocation(newLocation)
      setNewLocation('')
      router.refresh()
    } catch (error) {
      alert('Error al crear la ubicación')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro? Esta ubicación se eliminará de todos los items.')) {
      setDeletingId(id)
      try {
        await deleteLocation(id)
        router.refresh()
      } catch (error) {
        alert('Error al eliminar la ubicación')
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          placeholder="Nueva ubicación..."
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Agregar
        </Button>
      </form>

      <div className="space-y-2">
        {locations.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-8">
            No hay ubicaciones creadas
          </p>
        ) : (
          locations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-sm"
            >
              <span className="font-medium text-slate-900">{location.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(location.id)}
                disabled={deletingId === location.id}
              >
                {deletingId === location.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
