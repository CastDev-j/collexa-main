'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface ItemType {
  id: number
  name: string
}

export function ItemsFilters({ itemTypes }: { itemTypes: ItemType[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.push(`/dashboard/items?${params.toString()}`)
  }

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value !== 'all') {
      params.set('type', value)
    } else {
      params.delete('type')
    }
    router.push(`/dashboard/items?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    router.push('/dashboard/items')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 flex gap-2">
        <Input
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Select
        value={searchParams.get('type') || 'all'}
        onValueChange={handleTypeChange}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Tipo de item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          {itemTypes.map((type) => (
            <SelectItem key={type.id} value={type.id.toString()}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(searchParams.get('search') || searchParams.get('type')) && (
        <Button variant="outline" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      )}
    </div>
  )
}
