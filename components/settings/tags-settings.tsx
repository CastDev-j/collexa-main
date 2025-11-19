'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { createTag, deleteTag } from '@/app/actions/settings'
import { useRouter } from 'next/navigation'

export function TagsSettings({ tags }: { tags: any[] }) {
  const router = useRouter()
  const [newTag, setNewTag] = useState('')
  const [newColor, setNewColor] = useState('#EA580C')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTag.trim()) return

    setLoading(true)
    try {
      await createTag(newTag, newColor)
      setNewTag('')
      setNewColor('#EA580C')
      router.refresh()
    } catch (error) {
      alert('Error al crear la etiqueta')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro? Esta etiqueta se eliminará de todos los items.')) {
      setDeletingId(id)
      try {
        await deleteTag(id)
        router.refresh()
      } catch (error) {
        alert('Error al eliminar la etiqueta')
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          placeholder="Nueva etiqueta..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          disabled={loading}
          className="flex-1"
        />
        <Input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-16"
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
        {tags.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-8">
            No hay etiquetas creadas
          </p>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color_hex }}
                />
                <span className="font-medium text-slate-900">{tag.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(tag.id)}
                disabled={deletingId === tag.id}
              >
                {deletingId === tag.id ? (
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
