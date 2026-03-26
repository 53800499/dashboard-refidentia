import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Customers } from '@/components/gestion-clients'
import React from 'react'

export default function Page() {
  return (
      <>
        <PageBreadcrumb pageTitle="Gestion des clients" />

      <Customers />
    </>
  )
}
    