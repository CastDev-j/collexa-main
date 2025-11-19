'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import Link from 'next/link'

interface Loan {
  id: number
  borrower_name: string
  loan_date: string
  due_date: string | null
  items: { title: string } | null
}

export function ActiveLoans({ loans }: { loans: Loan[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Préstamos Activos
        </h2>
        <Link href="/dashboard/loans">
          <Button size="sm" variant="outline">
            Ver Todos
          </Button>
        </Link>
      </div>

      {loans.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No hay préstamos activos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="flex items-center justify-between p-3 rounded-sm bg-slate-50"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900">
                  {loan.items?.title || 'Item eliminado'}
                </p>
                <p className="text-sm text-slate-600">
                  Prestado a {loan.borrower_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">
                  {loan.due_date
                    ? new Date(loan.due_date).toLocaleDateString('es-ES')
                    : 'Sin fecha'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
