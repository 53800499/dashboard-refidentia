"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SpinnerScreen from "@/components/ui/spinner/spinner-screen";
import InvoicePreview from "@/components/Invoice/InvoicePreview";
import { useApiService } from "@/hooks/useApiService";
import type { Invoice } from "@/interface/Invoice";
import { useCompanySettings } from "@/hooks/useCompanySettings";

export default function InvoicePreviewPage() {
  const params = useParams<{ id: string }>();

  const invoiceId = useMemo(() => {
    const raw = (params?.id ?? "") as string;
    const asNumber = Number(raw);
    return Number.isNaN(asNumber) ? raw : asNumber;
  }, [params]);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const {
    fetchById,
    loading: apiLoading,
    error: apiError,
  } = useApiService<Invoice>();

  const { settings } = useCompanySettings();

  const fetchByIdRef = useRef(fetchById);
  useEffect(() => {
    fetchByIdRef.current = fetchById;
  }, [fetchById]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingInvoice(true);
      try {
        const res = await fetchByIdRef.current("invoices", invoiceId);
        if (!cancelled) setInvoice(res as Invoice);
      } catch {
        if (!cancelled) setInvoice(null);
      } finally {
        if (!cancelled) setLoadingInvoice(false);
      }
    };

    if (invoiceId) load();
    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  const isLoading = loadingInvoice || apiLoading;

  if (isLoading) return <SpinnerScreen />;

  return (
    <div className="space-y-4">
      <Link href="/invoice-emecef" className="text-blue-500 underline">
        ← Retour à la liste des factures
      </Link>

      {apiError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {!invoice ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
          Facture introuvable.
        </div>
      ) : (
        <InvoicePreview invoice={invoice} settings={settings} />
      )}
    </div>
  );
}

