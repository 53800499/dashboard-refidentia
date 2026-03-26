'use client'

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import DataTable, { Column } from "@/components/tables/BasicTable";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import AlertMessage from "@/components/common/AlertMessage";
import { Eye, Trash2, FileText, Send, CheckCircle, Download, Mail, MessageCircleCheck } from "lucide-react";
import useInvoice from "@/hooks/useInvoice";
import type { Invoice } from "@/interface/Invoice";
import { useRouter } from "next/navigation";

export default function Invoice() {
  const {
    invoices,
    allInvoices,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    validateWithEMECEF,
    markAsPaid,
    deleteInvoice,
    downloadPdf,
    sendByEmail,
    sendByWhatsapp,
  } = useInvoice();

  const [erro, setErro] = useState(false);

  // ---------------- KPI ----------------
  const totalFactures = allInvoices.length;
  const totalMois = allInvoices.reduce((acc, inv) => acc + inv.totalTTC, 0);
  const totalPayees = allInvoices.filter(inv => inv.status === "Paid").length;
  const totalEnAttente = allInvoices.filter(inv => inv.status === "Pending").length;

  // ---------------- Colonnes ----------------
  const columns: Column<Invoice>[] = [
    { header: "Numéro", accessor: "invoiceNumber" },
    {
      header: "Total TTC",
      accessor: "totalTTC",
      render: (value ) => {
      const amount = typeof value === "number" ? value : Number(value) || 0;
        return <span>{amount.toLocaleString()} FCFA</span>;
      },
    },
    {
      header: "Statut",
      accessor: "status",
      render: (status) => (
        <Badge
          size="sm"
          color={
            status === "Paid"
              ? "success"
              : status === "Validated"
              ? "primary"
              : status === "Pending"
              ? "warning"
              : status === "Rejected"
              ? "error"
              : "light"
          }
        >
          {status === "Paid"
                      ? "Payé"
                      : status === "Pending"
                      ? "En attente"
                      : "Annulé"}
        </Badge>
      ),
    },
    { header: "Date", accessor: "createdAt" },
    {
      header: "Actions",
      accessor: "id",
      render: (_, row) => (
        <div className="flex gap-2">

          {/* Validation EMECEF */}
          {row.status === "Draft" && (
            <button
              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
              onClick={() => validateWithEMECEF(row)}
              title="Valider EMECEF"
            >
              <CheckCircle size={16} />
            </button>
          )}

          {/* Marquer payé */}
          {row.status !== "Paid" && (
            <button
              className="p-2 text-green-600 hover:bg-green-100 rounded"
              onClick={() => markAsPaid(row)}
              title="Marquer comme payé"
            >
              <CheckCircle size={16} />
            </button>
          )}

          {/* Télécharger PDF */}
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => downloadPdf(row)}
            title="Télécharger PDF"
          ><Download size={16} />
          </button>

          {/* Email */}
          <button
            className="p-2 text-purple-600 hover:bg-purple-100 rounded"
            onClick={() => sendByEmail(row)}
            title="Envoyer Email"
          ><Mail size={16} />
          </button>

          {/* WhatsApp */}
          <button
            className="p-2 text-green-700 hover:bg-green-100 rounded"
            onClick={() => sendByWhatsapp(row)}
            title="Envoyer WhatsApp"
          ><MessageCircleCheck size={16} />
          </button>

          {/* Supprimer */}
          <button
            className="p-2 text-red-600 hover:bg-red-100 rounded"
            onClick={() => deleteInvoice(row.id)}
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>

        </div>
      ),
    },
  ];

  const router = useRouter();
  const handleAdd= () => {
    router.push("/invoice-emecef/create");
  }

  return (
    <div className="space-y-6">

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ComponentCard title="Total factures">
          <p className="text-2xl font-semibold">{totalFactures}</p>
        </ComponentCard>

        <ComponentCard title="Total facturé">
          <p className="text-2xl font-semibold">
            {totalMois.toLocaleString()} FCFA
          </p>
        </ComponentCard>

        <ComponentCard title="Factures payées">
          <p className="text-2xl font-semibold text-green-600">
            {totalPayees}
          </p>
        </ComponentCard>

        <ComponentCard title="En attente">
          <p className="text-2xl font-semibold text-yellow-600">
            {totalEnAttente}
          </p>
        </ComponentCard>
      </div>

      {/* Tableau */}
      <ComponentCard
        title="Facturation Normalisée (EMECEF)"
        button={{ text: "Nouvelle facture", onClick: handleAdd }}
        filters={
          <>
            <input
              type="text"
              placeholder="Rechercher numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full md:w-1/3"
            />
            <select
              aria-label="Filtrer par statut"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border rounded-lg px-4 py-2 w-full md:w-1/3"
            >
              <option value="All">Tous les statuts</option>
              <option value="Draft">Brouillon</option>
              <option value="Pending">En attente</option>
              <option value="Validated">Validée</option>
              <option value="Paid">Payée</option>
              <option value="Rejected">Rejetée</option>
            </select>
          </>
        }
      >

          <AlertMessage
            type="error"
            message={error || "Erreur lors de la récupération des factures"}
            isOpen={erro}
            onClose={() => {setErro(false)}}
          />

        <DataTable
          data={invoices}
          columns={columns}
          getRowId={(row) => row.id}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </ComponentCard>
    </div>
  );
}