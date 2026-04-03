'use client'

import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import DataTable, { Column } from "../tables/BasicTable";
import Pagination from "../tables/Pagination";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AlertMessage from "../common/AlertMessage";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import TransactionForm from "./form";
import { Transaction, TransactionFormData } from "@/interface/transaction";
import useTransactions from "@/hooks/useTansaction";
import { Factory, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { TRANSACTIONS_COMPONENT_INDEX_TABLE } from "@/constants/wording";

export const Transactions = () => {
  const router = useRouter();
  const {
    transactions,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions({ initialPageSize: 10 });

  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<TransactionFormData>({
    name: "",
    email: "",
    amount: 0,
    method: "Card",
    status: "Pending",
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorOpenDelete, setErrorOpenDelete] = useState(false);
  const [message, setMessage] = useState("");

  // ---- Handlers ----
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const resetForm = () => {
    setEditingTransaction(null);
    setForm({
      name: "",
      email: "",
      amount: 0,
      method: "Card",
      status: "Pending",
    });
  };

  const handleCreate = () => {
    resetForm();
    openModal();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setForm({
      name: transaction.customer.name,
      email: transaction.email,
      amount: transaction.amount/* .toString() */,
      method: transaction.method,
      status: transaction.status,
    });
    openModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTransaction) {
        const updatedTransaction: Transaction = {
          ...editingTransaction,
          customer: { ...editingTransaction.customer, name: form.name },
          email: form.email,
          amount: Number(form.amount),
          method: form.method as any,
          status: form.status as any,
        };

        await updateTransaction(updatedTransaction);
        setMessage("Transaction mise à jour avec succès 🎉");
      } else {
        console.log("entrer")
        const newTransaction: Transaction = {
          id: Date.now(),
          customer: { avatar: "/images/user/user-01.jpg", name: form.name },
          email: form.email,
          amount: Number(form.amount),
          method: form.method as any,
          status: form.status as any,
          date: new Date().toLocaleDateString(),
        };

        await addTransaction(newTransaction);
        setMessage("Transaction ajoutée avec succès 🎉");
      }

      setSuccessOpen(true);
      resetForm();
      closeModal();
    } catch {
      console.log("erreur cool");
      setErrorOpen(true);
      setMessage("Une erreur est survenue, veuillez réessayer.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;
    try {
      await deleteTransaction(deleteId);
      setMessage("Transaction supprimée");
      setSuccessOpen(true);
      setDeleteId(null);
      setErrorOpenDelete(false);
    }catch {
      setErrorOpenDelete(true);
    }
  };

  // ---- Table Columns ----
  const [openRow, setOpenRow] = useState<number | null>(null);
  const toggleRow = (id: number) => setOpenRow(prev => (prev === id ? null : id));

  const columns: Column<Transaction>[] = [
    {
  header: TRANSACTIONS_COMPONENT_INDEX_TABLE.HEADERS,
  accessor: "customer",
  render: (customer) => {
        // Vérifie que c'est bien un objet avec avatar et name
        if (typeof customer === "object" && customer !== null && "avatar" in customer && "name" in customer) {
          return (
            <div className="flex items-center gap-3">
              <Image
                src={customer.avatar}
                width={40}
                height={40}
                alt={customer.name}
                className="rounded-full"
              />
              <div className="font-medium">{customer.name}</div>
            </div>
          );
        }

        // Sinon, fallback si c'est juste une string ou number
        return <div className="font-medium">{customer}</div>;
      },
    },
    { header: TRANSACTIONS_COMPONENT_INDEX_TABLE.HEADERS_1, accessor: "email" },
    {
      header: TRANSACTIONS_COMPONENT_INDEX_TABLE.HEADERS_2,
      accessor: "amount",
      render: (value) => {
        if (!value) return <span>0 FCFA</span>;
        const amount = typeof value === "number" ? value : Number(value) || 0;
        return <span>{amount.toLocaleString()} FCFA</span>;
      },
    },
    { header: TRANSACTIONS_COMPONENT_INDEX_TABLE.HEADERS_3, accessor: "method" },
    {
      header: TRANSACTIONS_COMPONENT_INDEX_TABLE.HEADERS_4,
      accessor: "status",
      render: (status) => (
        <Badge
          size="sm"
          color={
            status === "Completed"
              ? "success"
              : status === "Pending"
              ? "warning"
              : "error"
          }
        >
          {status === "Completed"
                      ? "Payé"
                      : status === "Pending"
                      ? "En attente"
                      : "Annulé"}
        </Badge>
      ),
    },
    { header: TRANSACTIONS_COMPONENT_INDEX_TABLE.HEADERS_5, accessor: "date" },
    {
      header: TRANSACTIONS_COMPONENT_INDEX_TABLE.HEADERS_6,
      accessor: "id",
      render: (id, row) => (
        <div className="relative inline-block">
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
            onClick={() => toggleRow(id as number)}
            title="Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <Dropdown
            isOpen={openRow === id}
            onClose={() => setOpenRow(null)}
            className="w-50 p-2"
          >
            <DropdownItem
              onItemClick={() => {
                setOpenRow(null);
                handleEdit(row);
              }}
              className="flex w-full font-normal text-left text-green-700 rounded-lg hover:bg-green-100 hover:text-green-700"
            ><SquarePen className="w-4 h-4 mr-2" />
              Modifier
            </DropdownItem>
            <DropdownItem
              onItemClick={() => {
                setOpenRow(null);
                setDeleteId(id as number);
              }}
              className="flex w-full font-normal text-left text-red-700 rounded-lg hover:bg-red-100 hover:text-red-700"
            ><Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </DropdownItem>
            <DropdownItem
              onItemClick={() => {
                setOpenRow(null);
                generateInvoiceFromTransaction(row);
              }}
              className="flex w-full font-normal text-left text-blue-700 rounded-lg hover:bg-blue-100 hover:text-blue-700"
            ><Factory className="w-4 h-4 mr-2" />
              Générer une facture
            </DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  // ---- Filters UI ----
  const filters = ( 
    <>
            <input
              type="text"
              placeholder="Rechercher client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full md:w-1/3"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="Filtrer par statut"
              className="border rounded-lg px-4 py-2 w-full md:w-1/3"
            >
              <option value="All">Tous les statuts</option>
              <option value="VIP">VIP</option>
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </>
  );
  const handleExport = () => {
    window.print()
    console.log("Test");
  }

  const generateInvoiceFromTransaction = (tx: Transaction) => {
    try {
      localStorage.setItem(
        "invoicePrefill",
        JSON.stringify({
          name: tx.customer.name,
          email: tx.email,
          amount: tx.amount,
        })
      );
    } catch {
      // ignore localStorage errors
    }
    router.push("/invoice-emecef/create");
  };

  return (
    <>
      <ComponentCard
        title="Transactions"
        button={{ text: "Transaction", onClick: handleCreate }}
        filters={filters}
        exportBtn={{
          text: "Exporter",
          onClick: handleExport,
        }}
      >
        <AlertMessage
          type="success"
          message={message}
          isOpen={successOpen}
          onClose={() => setSuccessOpen(false)}
        />
        <AlertMessage
          type="error"
          message={message}
          isOpen={errorOpen}
          onClose={() => setErrorOpen(false)}
        />

        <DataTable
          data={transactions}
          columns={columns}
          getRowId={(row) => row.id}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </ComponentCard>

      <TransactionForm
        isOpen={isOpen}
        closeModal={closeModal}
        resetForm={resetForm}
        setForm={setForm}
        form={form}
        editingTransaction={editingTransaction?.id}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
        errorStatus={errorOpen}
      />

      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        error={error}
        errorStatus={errorOpenDelete}
      />
    </>
  );
};