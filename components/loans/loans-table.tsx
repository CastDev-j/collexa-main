'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, CheckCircle, Users } from 'lucide-react'
import Link from 'next/link'
import { markLoanAsReturned } from '@/app/actions/loans'
import { useRouter } from 'next/navigation'

interface Loan {
  id: number
  borrower_name: string
  borrower_contact: string | null
  loan_date: string
  due_date: string | null
  return_date: string | null
  is_returned: boolean
  notes: string | null
  items: { title: string; cover_image_url: string | null } | null
}

export function LoansTable({ loans }: { loans: Loan[] }) {
  const router = useRouter()

  const handleMarkAsReturned = async (id: number) => {
    await markLoanAsReturned(id)
    router.refresh()
  }

  const activeLoans = loans.filter((loan) => !loan.is_returned)
  const returnedLoans = loans.filter((loan) => loan.is_returned)

  if (loans.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">No hay préstamos registrados</p>
        <Link href="/dashboard/loans/new">
          <Button className="mt-4">Crear tu primer préstamo</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {activeLoans.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Préstamos Activos ({activeLoans.length})
          </h2>
          <div className="space-y-3">
            {activeLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-sm"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {loan.items?.title || 'Item eliminado'}
                  </p>
                  <p className="text-sm text-slate-600">
                    Prestado a{' '}
                    <span className="font-medium">{loan.borrower_name}</span>
                    {loan.borrower_contact && ` (${loan.borrower_contact})`}
                  </p>
                  <p className="text-sm text-slate-600">
                    Desde: {new Date(loan.loan_date).toLocaleDateString('es-ES')}
                    {loan.due_date &&
                      ` • Vence: ${new Date(loan.due_date).toLocaleDateString('es-ES')}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/loans/${loan.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsReturned(loan.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Devuelto
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {returnedLoans.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Préstamos Devueltos ({returnedLoans.length})
          </h2>
          <div className="space-y-3">
            {returnedLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between p-4 bg-green-50 rounded-sm"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {loan.items?.title || 'Item eliminado'}
                  </p>
                  <p className="text-sm text-slate-600">
                    Prestado a{' '}
                    <span className="font-medium">{loan.borrower_name}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Devuelto el:{' '}
                    {loan.return_date
                      ? new Date(loan.return_date).toLocaleDateString('es-ES')
                      : 'N/A'}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
