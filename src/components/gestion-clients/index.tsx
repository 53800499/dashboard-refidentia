'use client'

import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { useModal } from "@/hooks/useModal";
import DataTable, { Column } from "../tables/BasicTable";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Pagination from "../tables/Pagination";
import AlertMessage from "../common/AlertMessage";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import CustomerForm from "./form";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import useCustomer from "@/hooks/useCustomer";
import { Customer, CustomerFormData } from "../../interface/Customer";
import { useRouter } from "next/navigation";
export const Customers = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const {
    customers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomer();

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<CustomerFormData>({
    name: "",
    phone: "",
    email: "",
    status: "Active",
    loyaltyPoints: 0,
  });
  const [message, setMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);
  const router = useRouter()
  const [errorOpenDelete, setErrorOpenDelete] = useState(false);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        const updated = { ...editingCustomer, ...form, status: form.status as "VIP" | "Active" | "Inactive" };
        await updateCustomer(updated);
        setMessage("Client mis à jour avec succès");
      } else {
        const newCustomer: Customer = {
          id: Date.now(),
          totalSpent: 0,
          totalTransactions: 0,
          lastPurchaseDate: "-",
          avatar: "/images/user/user-01.jpg",
          ...form,
          status: form.status as "VIP" | "Active" | "Inactive"
        };
        await addCustomer(newCustomer);
        setMessage("Client ajouté avec succès");
      }
      setSuccessOpen(true);
      resetForm();
      closeModal();
    } catch {
      setErrorOpen(true);
      setMessage("Une erreur est survenue");
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      status: customer.status,
      loyaltyPoints: customer.loyaltyPoints,
    });
    openModal();
  };

  const handleView = (id: number) => {
    setViewId(id);
    router.push(`/gestion-clients/${id}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteCustomer(deleteId);
      setMessage("Client supprimé");
      setSuccessOpen(true);
      setDeleteId(null);
      setErrorOpenDelete(false);
    } catch {
      setErrorOpen(true);
      setMessage("Erreur lors de la suppression");
      setErrorOpenDelete(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      status: "Active",
      loyaltyPoints: 0,
    });
  };

  // ---------------- TABLE ----------------
  const columns: Column<Customer>[] = [
    {
      header: "Client",
      accessor: "name",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Image
            src={row.avatar || "/images/user/user-01.jpg"}
            width={40}
            height={40}
            alt={row.name}
            className="rounded-full"
          />
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-xs text-gray-500">{row.phone}</div>
          </div>
        </div>
      ),
    },
    { header: "Email", accessor: "email" },
    {
      header: "Total dépensé",
      accessor: "totalSpent",
      render: (value) => <span>{value} FCFA</span>,
    },
    { header: "Achats", accessor: "totalTransactions" },
    { header: "Points", accessor: "loyaltyPoints" },
    {
      header: "Statut",
      accessor: "status",
      render: (status) => (
        <Badge
          size="sm"
          color={
            status === "VIP"
              ? "success"
              : status === "Active"
              ? "warning"
              : "error"
          }
        >
          {status}
        </Badge>
      ),
    },
    { header: "Dernier achat", accessor: "lastPurchaseDate" },
    {
      header: "Actions",
      accessor: "id",
      render: (id, row) => (
        <div className="flex gap-1">
          <button
            className="p-2 rounded hover:bg-green-100 transition-colors text-green-500"
            onClick={() => handleView(id as number)}
            title="Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded hover:bg-blue-100 transition-colors text-blue-500"
            onClick={() => handleEdit(row)}
            title="Modifier"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded hover:bg-red-100 transition-colors text-red-500"
            onClick={() => setDeleteId(id as number)}
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ComponentCard
        title="Gestion des Clients (CRM)"
        button={{ text: "Nouveau client", onClick: openModal }}
        filters={
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
              className="border rounded-lg px-4 py-2 w-full md:w-1/3"
            >
              <option value="All">Tous les statuts</option>
              <option value="VIP">VIP</option>
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </>
        }
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
          data={customers}
          columns={columns}
          getRowId={(row) => row.id}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </ComponentCard>

      <CustomerForm
        isOpen={isOpen}
        closeModal={closeModal}
        resetForm={resetForm}
        setForm={setForm}
        form={form}
        editingCustomer={editingCustomer?.id ? Number(editingCustomer.id) : null}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
        errorStatus={errorOpen}

      />

      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        error={error}
        errorStatus={errorOpenDelete}
      />
    </>
  );
};