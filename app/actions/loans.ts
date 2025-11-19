'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLoan(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const loanData = {
    item_id: formData.get('item_id'),
    borrower_name: formData.get('borrower_name'),
    borrower_contact: formData.get('borrower_contact') || null,
    loan_date: formData.get('loan_date'),
    due_date: formData.get('due_date') || null,
    notes: formData.get('notes') || null,
    is_returned: false,
  }

  const { error } = await supabase.from('loans').insert(loanData)

  if (error) throw error

  revalidatePath('/dashboard/loans')
  revalidatePath('/dashboard')
}

export async function updateLoan(id: number, formData: FormData) {
  const supabase = await createClient()

  const loanData = {
    item_id: formData.get('item_id'),
    borrower_name: formData.get('borrower_name'),
    borrower_contact: formData.get('borrower_contact') || null,
    loan_date: formData.get('loan_date'),
    due_date: formData.get('due_date') || null,
    notes: formData.get('notes') || null,
  }

  const { error } = await supabase.from('loans').update(loanData).eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard/loans')
  revalidatePath('/dashboard')
}

export async function markLoanAsReturned(id: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('loans')
    .update({
      is_returned: true,
      return_date: new Date().toISOString().split('T')[0],
    })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard/loans')
  revalidatePath('/dashboard')
}
