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
import { createLoan, updateLoan } from '@/app/actions/loans'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface LoanFormProps {
  loan?: any
  items: any[]
}

export function LoanForm({ loan, items }: LoanFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (loan) {
        await updateLoan(loan.id, formData)
      } else {
        await createLoan(formData)
      }
      router.push('/dashboard/loans')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al guardar el préstamo')
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

        <div className="space-y-2">
          <Label htmlFor="item_id">Item *</Label>
          <Select
            name="item_id"
            defaultValue={loan?.item_id?.toString()}
            required
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="borrower_name">Nombre del Prestatario *</Label>
          <Input
            id="borrower_name"
            name="borrower_name"
            defaultValue={loan?.borrower_name}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="borrower_contact">Contacto (Email o Teléfono)</Label>
          <Input
            id="borrower_contact"
            name="borrower_contact"
            defaultValue={loan?.borrower_contact}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="loan_date">Fecha de Préstamo *</Label>
            <Input
              id="loan_date"
              name="loan_date"
              type="date"
              defaultValue={
                loan?.loan_date || new Date().toISOString().split('T')[0]
              }
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Fecha de Vencimiento</Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              defaultValue={loan?.due_date}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={loan?.notes}
            disabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {loading ? 'Guardando...' : loan ? 'Actualizar' : 'Crear Préstamo'}
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
