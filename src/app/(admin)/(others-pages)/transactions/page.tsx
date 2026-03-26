import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Transactions } from '@/components/transactions'
import React from 'react'

export default function TransactionPage() {
  return (
      <>
                <PageBreadcrumb pageTitle="Transactions" />

      <Transactions />
    </>
  )
}
