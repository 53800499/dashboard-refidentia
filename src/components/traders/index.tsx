"use client";

import ComponentCard from "../common/ComponentCard";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import SignUpForm from "../auth/SignUpForm";
import DataTable, { Column } from "../tables/BasicTable";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useState } from "react";
import Pagination from "../tables/Pagination";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import FileInput from "../form/input/FileInput";

interface Trader {
  id: number;
  shop: {
    logo: string;
    name: string;
    category: string;
  };
  email: string;
  phone: string;
  revenue: string;
  status: "Active" | "Pending" | "Suspended";
  joinedAt: string;
}

export const Traders = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

const toggleRow = (id: number) => {
  setOpenRow((prev) => (prev === id ? null : id));
  };

  const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  category: "",
  description: "",
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Form data :", form);

  // TODO: Appel API ici
  // traderService.create(form)

  closeModal();
};
  
  
  const tableData: Trader[] = [
    {
      id: 1,
      shop: {
        logo: "/images/user/user-17.jpg",
        name: "Tech Store",
        category: "Électronique",
      },
      email: "contact@techstore.com",
      phone: "+33 6 45 78 90 12",
      revenue: "12 500€",
      status: "Active",
      joinedAt: "12 Jan 2025",
    },
    {
      id: 2,
      shop: {
        logo: "/images/user/user-18.jpg",
        name: "Fashion Hub",
        category: "Mode",
      },
      email: "hello@fashionhub.com",
      phone: "+33 6 11 22 33 44",
      revenue: "8 200€",
      status: "Pending",
      joinedAt: "03 Feb 2025",
    },
    {
      id: 3,
      shop: {
        logo: "/images/user/user-19.jpg",
        name: "Fresh Market",
        category: "Alimentation",
      },
      email: "support@freshmarket.com",
      phone: "+33 7 88 99 44 55",
      revenue: "5 600€",
      status: "Suspended",
      joinedAt: "28 Dec 2024",
    },
  ];

  const columns: Column<Trader>[] = [
    {
      header: "Commerçant",
      accessor: "shop",
      render: (shop) => (
        
            <div className="font-medium text-gray-800">eeee</div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Téléphone",
      accessor: "phone",
    },
    {
      header: "Chiffre d'affaires",
      accessor: "revenue",
    },
    {
      header: "Statut",
      accessor: "status",
      render: (status) => (
        <Badge
          size="sm"
          color={
            status === "Active"
              ? "success"
              : status === "Pending"
              ? "warning"
              : "error"
          }
        >
          {status == "Active" ? "" : "success"}
        </Badge>
      ),
    },
    {
      header: "Inscrit le",
      accessor: "joinedAt",
    },
    {
  header: "Actions",
  accessor: "id",
  render: (id, row) => (
    <div className="relative">
      <button
        onClick={() => toggleRow(id as number)}
        className="px-3 py-1 text-gray-500 hover:text-gray-700"
      >
        ⋮
      </button>

      {openRow === id && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow-lg z-10">
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => console.log("Voir", row)}
          >
            Voir
          </button>

          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => console.log("Modifier", row)}
          >
            Modifier
          </button>

          <button
            className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-50"
            onClick={() => console.log("Suspendre", row)}
          >
            Suspendre
          </button>
        </div>
      )}
    </div>
  ),
}
  ];
const totalPages = Math.ceil(tableData.length / pageSize);

const paginatedData = tableData.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);
  return (
    <>
      <div className="space-y-6">
        <ComponentCard
          title="Commerçants"
          button={{ text: "Créer un commerçant", onClick: openModal }}
        >
          <DataTable data={paginatedData} columns={columns} getRowId={(row) => row.id} />
          <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
        </ComponentCard>
      </div>

      <Modal
  isOpen={isOpen}
  onClose={closeModal}
  className="max-w-[700px] m-4"
>
  <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
    
    {/* HEADER */}
    <div className="px-2 pr-14">
      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        Ajouter un commerçant
      </h4>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Créez un nouveau commerçant dans le système.
      </p>
    </div>

    {/* FORM */}
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
        
        {/* INFORMATIONS GENERALES */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

          <div>
            <Label>Nom du commerce</Label>
            <Input
              type="text"
              // value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Ex: Boutique Soleil"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              // value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Téléphone</Label>
            <Input
              type="text"
              // value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Catégorie</Label>
            <Input
              type="text"
              // value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              placeholder="Ex: Ecommerce / Restaurant / Service"
            />
          </div>

          <div className="col-span-2">
                    <Label>Image</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
          </div>

          <div className="col-span-2">
            <Label>Description</Label>
            <textarea
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description du commerçant..."
            />
          </div>

        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Annuler
        </Button>

        <Button size="sm" /* type="submit" */>
          Ajouter
        </Button>
      </div>

    </form>
  </div>
</Modal>
    </>
  );
};