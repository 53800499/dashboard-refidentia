'use client'

import { useState, useEffect, useMemo } from "react";
import { useApiService } from "./useApiService";
import { CustomerData } from "@/mocks/customer";
import { Customer } from "../interface/Customer";

interface UseCustomerOptions {
  initialPageSize?: number;
}

export default function useCustomer({ initialPageSize = 10 }: UseCustomerOptions = {}) {
  const { fetchAll, create, update, remove, data: apiData, loading: apiLoading, error: apiError } = useApiService();

  const [customers, setCustomers] = useState<Customer[]>(CustomerData); // fallback mock
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "VIP">("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // --- Fetch initial customers ---
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      await fetchAll("customers"); // récupère apiData

      // Assure-toi que apiData est un tableau
      if (Array.isArray(apiData) && apiData.length > 0) {
        setCustomers(apiData as Customer[]);
      } else {
        setCustomers(CustomerData);
      }
      setError(null);
    } catch (err: any) {
      setCustomers(CustomerData);
      setError(err.message || "Erreur lors du chargement des clients");
      // Ne pas re-propager pour éviter un overlay runtime si l'API n'est pas joignable
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD ---
  const addCustomer = async (customer: Customer) => {
    try {
      setLoading(true);
      await create("customers", customer);
      setCustomers(prev => [customer, ...prev]);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout du client");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (customer: Customer) => {
    try {
      setLoading(true);
      await update("customers", customer.id, customer);
      setCustomers(prev => prev.map(c => (c.id === customer.id ? customer : c)));
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du client");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      setLoading(true);
      await remove("customers", id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du client");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Filtrage + recherche ---
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  return {
    customers: paginatedData,
    allCustomers: customers,
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
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}