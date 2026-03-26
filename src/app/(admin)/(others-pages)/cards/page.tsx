"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import SpinnerScreen from "@/components/ui/spinner/spinner-screen";
import useInvoice from "@/hooks/useInvoice";
import type { Invoice } from "@/interface/Invoice";
import QrCodeImage from "@/components/cards/QrCodeImage";

export default function CardsPage() {
  const { allInvoices, loading } = useInvoice({ initialPageSize: 50 });
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!selectedInvoice && allInvoices.length > 0) {
      setSelectedInvoice(allInvoices[0] as Invoice);
    }
  }, [allInvoices, selectedInvoice]);

  const qrValue = useMemo(() => {
    if (!selectedInvoice) return "";
    return (
      selectedInvoice.qrCode ||
      `https://emecef.fake/${selectedInvoice.invoiceNumber}`
    );
  }, [selectedInvoice]);

  if (loading) return <SpinnerScreen />;

  return (
    <>
      <PageBreadcrumb pageTitle="Cartes QR" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ComponentCard
          title="Facture à scanner"
          desc="Choisissez la facture à présenter au client."
        >
          <div className="space-y-3">
            {allInvoices.length === 0 ? (
              <div className="text-sm text-gray-500">
                Aucune facture disponible.
              </div>
            ) : (
              allInvoices.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv as Invoice)}
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-left transition",
                    selectedInvoice?.id === inv.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div className="font-medium text-gray-800">
                    {inv.invoiceNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    Statut: {inv.status}
                  </div>
                </button>
              ))
            )}
          </div>
        </ComponentCard>

        <ComponentCard
          title="QR Code paiement"
          desc="Le client scanne ce QR code pour effectuer le paiement."
        >
          {selectedInvoice ? (
            <div className="space-y-4">
              <QrCodeImage value={qrValue} size={320} />
              <div className="text-sm text-gray-600">
                {selectedInvoice.invoiceNumber}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Sélectionnez une facture.</div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}

