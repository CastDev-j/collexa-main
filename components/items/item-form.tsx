'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { createItem, updateItem } from '@/app/actions/items'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface ItemFormProps {
  item?: any
  itemTypes: any[]
  platforms: any[]
  conditions: any[]
  locations: any[]
  publishers: any[]
  creators: any[]
  genres: any[]
}

export function ItemForm({
  item,
  itemTypes,
  platforms,
  conditions,
  locations,
  publishers,
}: ItemFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (item) {
        await updateItem(item.id, formData)
      } else {
        await createItem(formData)
      }
      router.push('/dashboard/items')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={item?.title}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item_type_id">Tipo *</Label>
            <Select
              name="item_type_id"
              defaultValue={item?.item_type_id?.toString()}
              required
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform_id">Plataforma</Label>
            <Select
              name="platform_id"
              defaultValue={item?.platform_id?.toString()}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una plataforma" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id.toString()}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition_id">Condición</Label>
            <Select
              name="condition_id"
              defaultValue={item?.condition_id?.toString()}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una condición" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition.id} value={condition.id.toString()}>
                    {condition.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_id">Ubicación</Label>
            <Select
              name="location_id"
              defaultValue={item?.location_id?.toString()}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una ubicación" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher_id">Editorial/Desarrollador</Label>
            <Select
              name="publisher_id"
              defaultValue={item?.publisher_id?.toString()}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un publisher" />
              </SelectTrigger>
              <SelectContent>
                {publishers.map((publisher) => (
                  <SelectItem key={publisher.id} value={publisher.id.toString()}>
                    {publisher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="release_year">Año de Lanzamiento</Label>
            <Input
              id="release_year"
              name="release_year"
              type="number"
              defaultValue={item?.release_year}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_date">Fecha de Compra</Label>
            <Input
              id="purchase_date"
              name="purchase_date"
              type="date"
              defaultValue={item?.purchase_date}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_price">Precio de Compra</Label>
            <Input
              id="purchase_price"
              name="purchase_price"
              type="number"
              step="0.01"
              defaultValue={item?.purchase_price}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal_rating">Calificación Personal</Label>
            <Select
              name="personal_rating"
              defaultValue={item?.personal_rating?.toString()}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Califica del 1 al 5" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {'★'.repeat(rating)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url">URL de Portada</Label>
            <Input
              id="cover_image_url"
              name="cover_image_url"
              type="url"
              defaultValue={item?.cover_image_url}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={item?.description}
            disabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {loading ? 'Guardando...' : item ? 'Actualizar' : 'Crear Item'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </Card>
    </form>
  )
}
