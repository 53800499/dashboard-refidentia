'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Transaction } from '@/interface/transaction';
import SpinnerScreen from '@/components/ui/spinner/spinner-screen';
import ComponentCard from '@/components/common/ComponentCard';
import DataTable, { Column } from '@/components/tables/BasicTable';
import Pagination from '@/components/tables/Pagination';
import Badge from '@/components/ui/badge/Badge';
import AlertMessage from '@/components/common/AlertMessage';
import Image from 'next/image';
import useCustomer from '@/hooks/useCustomer';
import { Customer } from '../../../../../interface/Customer';
import useTransactions from '@/hooks/useTansaction';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import InvoicePreview from '@/components/Invoice/InvoicePreview';
import { Modal } from '@/components/ui/modal';
import type { Invoice } from '@/interface/Invoice';
import Button from '@/components/ui/button/Button';

export default function CustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = Number(params.id);

  // --- Hooks déclarés en haut ---
  const { allCustomers, loading, error } = useCustomer();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const {allTransactions} = useTransactions();
  const [cusError, setCustomerError] = useState(false);

  const { settings } = useCompanySettings();
  const [invoiceModalTx, setInvoiceModalTx] = useState<Transaction | null>(null);

  // --- Effect pour initialiser le client et ses transactions ---
  useEffect(() => {
    // Récupération client
    const c = allCustomers.find(c => c.id === customerId) || null;
    setCustomer(c);
console.log("Customer trouvé:", c);
    // Récupération des transactions
    const clientTx = allTransactions.filter(tx => tx.id === customerId);
    console.log("Transactions trouvées:", clientTx);
    setTransactions(clientTx);

    // Redirection si client non trouvé
    if (!c) {
      router.replace('/gestion-clients');
    }
  }, [allCustomers, customerId, router]);

  // --- Pagination ---
  const totalPages = Math.ceil(transactions.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return transactions.slice(start, start + pageSize);
  }, [transactions, currentPage, pageSize]);

  if (loading) return <SpinnerScreen />;
  if (!customer) return <SpinnerScreen />;

  // --- Colonnes tableau ---
  const columns: Column<Transaction>[] = [
    {
      header: "Montant",
      accessor: "amount",
      render: (amount) => <span>{Number(amount)} FCFA</span>,
    },
    { header: "Date", accessor: "date" },
    { header: "Moyen de paiement", accessor: "method" },
    {
      header: "Facture",
      accessor: "id",
      render: (_, row) => (
        <button
          className="text-blue-500 underline"
          onClick={() => setInvoiceModalTx(row)}
        >
          PDF
        </button>
      ),
    },
    { header: "Statut", accessor: "status", render: (status) => (
      <Badge size="sm" color={status === "Completed" ? "success" : "warning"}>{status === "Completed"
                      ? "Effectué"
                      : status === "Pending"
                      ? "En attente"
                      : "Annulé"}</Badge>
    )},
  ];

  return (
    <div className="space-y-6">
      <button className="text-blue-500 underline" onClick={() => router.push("/gestion-clients")}>
        ← Retour aux clients
      </button>

      <ComponentCard title={`Fiche client: ${customer.name}`}>
        <div className="flex items-center gap-4 mb-4">
          <Image src={customer.avatar || "/images/user/user-01.jpg"} width={60} height={60} alt={customer.name} className="rounded-full" />
          <div className='flex gap-8 items-center'>
            <div>
                <div className="font-semibold">{customer.name}</div>
                <div className="text-sm text-gray-500">{customer.phone}</div>
                <div className="text-sm text-gray-500">{customer.email}</div>
            </div>
            <div className=''>
                <div className="text-sm mt-1">
              Statut: <Badge size="sm" color={
                customer.status === "VIP" ? "success" :
                customer.status === "Active" ? "warning" : "error"
              }>{customer.status}</Badge>
            </div>
            <div className="text-sm text-gray-500">Points fidélité: {customer.loyaltyPoints}</div>
            <div className="text-sm text-gray-500">Total dépensé: {customer.totalSpent} FCFA</div>
            </div>
          </div>
        </div>

        <h4 className="text-lg font-semibold mb-2">Historique des transactions</h4>
        <AlertMessage
          type="error"
          message={error ?? ""}
          isOpen={cusError}
          onClose={() => setCustomerError(false)}
        />

        <DataTable data={paginatedData} columns={columns} getRowId={(row) => row.id} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </ComponentCard>

      <Modal
        isOpen={invoiceModalTx !== null}
        onClose={() => setInvoiceModalTx(null)}
        className="max-w-[900px] m-4"
        showCloseButton
      >
        {invoiceModalTx ? (
          (() => {
            const tx = invoiceModalTx;
            const tvaRate = 18;
            const amount = Number(tx.amount) || 0;
            const totalHT = amount;
            const totalTVA = amount * (tvaRate / 100);
            const totalTTC = totalHT + totalTVA;

            const createdAt = (() => {
              const d = new Date(tx.date);
              if (Number.isNaN(d.getTime())) return new Date().toISOString();
              return d.toISOString();
            })();

            const year = new Date(createdAt).getFullYear();
            const invoiceNumber = `FAC-${year}-${tx.id}`;

            const invoice: Invoice = {
              id: tx.id,
              invoiceNumber,
              customerId: tx.id,
              items: [
                {
                  id: `item-${tx.id}-1`,
                  description: "Paiement",
                  quantity: 1,
                  unitPrice: amount,
                  tva: tvaRate,
                  totalHT,
                  totalTVA,
                  totalTTC,
                },
              ],
              totalHT,
              totalTVA,
              totalTTC,
              status:
                tx.status === "Completed"
                  ? "Paid"
                  : tx.status === "Pending"
                  ? "Pending"
                  : "Rejected",
              createdAt,
              qrCode: `https://emecef.fake/${invoiceNumber}`,
            };

            return (
              <div className="space-y-4 p-2">
                <InvoicePreview invoice={invoice} settings={settings} />
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="bg-white"
                  >
                    Télécharger (PDF via impression)
                  </Button>
                  <Button onClick={() => setInvoiceModalTx(null)}>Fermer</Button>
                </div>
              </div>
            );
          })()
        ) : null}
      </Modal>
    </div>
  );
}