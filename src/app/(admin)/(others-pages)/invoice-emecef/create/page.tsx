import InvoiceForm from '@/components/Invoice/form'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
      <>
        <button className="text-blue-500 underline my-4">
            <Link href="/invoice-emecef">← Retour à la liste des factures
            </Link>
        </button>
        <InvoiceForm />
    </>
  )
}
