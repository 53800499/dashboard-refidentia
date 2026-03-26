'use client'

import { useState, useEffect, useMemo } from "react";
import { useApiService } from "./useApiService";
import { Invoice, InvoiceItem } from "@/interface/Invoice";
import { InvoiceData } from "@/mocks/invoice";
import { useRouter } from "next/navigation";

interface UseInvoiceOptions {
  initialPageSize?: number;
}

export default function useInvoice({ initialPageSize = 10 }: UseInvoiceOptions = {}) {
  const { fetchAll, create, update, remove, data: apiData, loading: apiLoading, error: apiError } = useApiService<Invoice[]>();

  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>(InvoiceData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Draft" | "Pending" | "Validated" | "Rejected" | "Paid"
  >("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      await fetchAll("invoices");

      if (apiData && apiData.length > 0) {
        setInvoices(apiData as Invoice[]);
      } else {
        setInvoices(InvoiceData);
      }

      setError(null);
    } catch (err: any) {
      setInvoices(InvoiceData);
      setError(err.message || "Erreur lors du chargement des factures");
      // Important: ne pas re-propager l'erreur, sinon Next affiche un overlay et casse l'UI
    } finally {
      setLoading(false);
    }
  };

  // ---------------- AUTO NUMBER ----------------
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `FAC-${year}-${String(count).padStart(5, "0")}`;
  };

  // ---------------- CREATE ----------------
  const createInvoice = async (
    customerId: number,
    items: InvoiceItem[]
  ) => {
    try {
      setLoading(true);

      const totalHT = items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      );

      const totalTVA = items.reduce(
        (acc, item) =>
          acc + item.quantity * item.unitPrice * (item.tva / 100),
        0
      );

      const totalTTC = totalHT + totalTVA;

      const newInvoice: Invoice = {
        id: Date.now(),
        invoiceNumber: generateInvoiceNumber(),
        customerId,
        items,
        totalHT,
        totalTVA,
        totalTTC,
        status: "Draft",
        createdAt: new Date().toISOString(),
      };

      await create("invoices", newInvoice);

      setInvoices(prev => [newInvoice, ...prev]);

      return newInvoice;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VALIDATION EMECEF ----------------
  const validateWithEMECEF = async (invoice: Invoice) => {
    try {
      setLoading(true);

      // Simulation API fiscale
      const updated: Invoice = {
        ...invoice,
        status: "Validated",
        emecefId: `EME-${Date.now()}`,
        qrCode: `https://emecef.fake/${invoice.invoiceNumber}`,
      };

      await update("invoices", invoice.id, updated);

      setInvoices(prev =>
        prev.map(inv => (inv.id === invoice.id ? updated : inv))
      );

      return updated;
    } catch (err: any) {
      setError("Erreur validation EMECEF");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- MARK AS PAID ----------------
  const markAsPaid = async (invoice: Invoice) => {
    try {
      const updated: Invoice = { ...invoice, status: "Paid" };

      await update("invoices", invoice.id, updated);

      setInvoices(prev =>
        prev.map(inv => (inv.id === invoice.id ? updated : inv))
      );
    } catch (err: any) {
      setError("Erreur lors du paiement");
      return null;
    }
  };

  // ---------------- DELETE ----------------
  const deleteInvoice = async (id: number) => {
    try {
      await remove("invoices", id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    } catch (err: any) {
      setError("Erreur suppression");
      return null;
    }
  };

  // ---------------- PDF (MOCK) ----------------
  const downloadPdf = (invoice: Invoice) => {
    // Remplace le mock: on ouvre la page de prévisualisation.
    // (Tu pourras ensuite brancher la génération PDF backend si besoin.)
    router.push(`/invoice-emecef/${invoice.id}`);
  };

  // ---------------- EMAIL / WHATSAPP (MOCK) ----------------
  const sendByEmail = (invoice: Invoice) => {
    console.log("Envoi email :", invoice.invoiceNumber);
  };

  const sendByWhatsapp = (invoice: Invoice) => {
    console.log("Envoi WhatsApp :", invoice.invoiceNumber);
  };

  // ---------------- FILTRAGE ----------------
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, currentPage, pageSize]);

  return {
    invoices: paginatedInvoices,
    allInvoices: invoices,
    loading: loading || apiLoading,
    error: error || apiError,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchInvoices,
    createInvoice,
    validateWithEMECEF,
    markAsPaid,
    deleteInvoice,
    downloadPdf,
    sendByEmail,
    sendByWhatsapp,
  };
}