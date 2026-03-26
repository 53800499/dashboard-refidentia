import { useState, useEffect, useMemo } from "react";
import { useApiService } from "./useApiService";
import { Transaction } from "@/interface/transaction";
import { TransactionData } from "@/mocks/transaction";

interface UseTransactionsOptions {
  initialPageSize?: number;
}

export default function useTransactions({ initialPageSize = 10 }: UseTransactionsOptions = {}) {
  const { fetchAll, create, remove, update, data: apiData, loading: apiLoading, error: apiError } = useApiService();

  const [transactions, setTransactions] = useState<Transaction[]>(TransactionData); // <- données mock par défaut
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Completed" | "Failed">("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // --- Fetch initial transactions ---
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      await fetchAll("transactions");
      if (Array.isArray(apiData) && apiData.length > 0) {
        setTransactions(apiData as Transaction[]);
      } else {
        setTransactions(TransactionData);
      }
      setError(null);
    } catch (err: any) {
      setTransactions(TransactionData); // <- fallback
      setError(err.message || "Erreur lors du chargement");
      // Ne pas re-propager pour éviter un overlay runtime si l'API n'est pas joignable
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD et filtrage restent identiques ---
  const addTransaction = async (transaction: Transaction) => {
    try {
      setLoading(true);
      await create("transactions", transaction);
      setTransactions(prev => [transaction, ...prev]);
    } catch (err: any) {
      console.log("erredd")
      setError(err.message || "Erreur lors de l'ajout");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      setLoading(true);
      await update("transactions", transaction.id, transaction);
      setTransactions(prev => prev.map(t => (t.id === transaction.id ? transaction : t)));
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      setLoading(true);
      await remove("transactions", id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Filtrage et pagination ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch =
        t.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  return {
    transactions: paginatedData,
    allTransactions: transactions,
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
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}