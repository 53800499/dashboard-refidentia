import React from "react";
import type { CompanySettings } from "@/hooks/useCompanySettings";
import type { Invoice } from "@/interface/Invoice";

function formatDate(createdAt: string) {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return createdAt;
  return d.toLocaleDateString("fr-FR");
}

export default function InvoicePreview({
  invoice,
  settings,
}: {
  invoice: Invoice;
  settings: CompanySettings;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
              {settings.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-500">Logo</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">
                {settings.companyName || "Votre entreprise"}
              </div>
              {settings.ifu && <div className="text-sm text-gray-700">IFU: {settings.ifu}</div>}
            </div>
          </div>
          {settings.address && <div className="text-sm text-gray-700">{settings.address}</div>}
          {(settings.phone || settings.email) && (
            <div className="text-sm text-gray-700">
              {[settings.phone, settings.email].filter(Boolean).join(" • ")}
            </div>
          )}
          {settings.website && <div className="text-sm text-gray-700">{settings.website}</div>}
        </div>

        <div className="text-right space-y-1">
          <div className="text-gray-900 text-xl font-bold">Facture</div>
          <div className="text-sm text-gray-700">N°: {invoice.invoiceNumber}</div>
          <div className="text-sm text-gray-700">Date: {formatDate(invoice.createdAt)}</div>
          <div className="text-sm text-gray-700">Statut: {invoice.status}</div>
          {invoice.emecefId && <div className="text-sm text-gray-700">EMECEF: {invoice.emecefId}</div>}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="text-left py-3 px-3 border-b border-gray-200 font-medium">Description</th>
                <th className="text-center py-3 px-3 border-b border-gray-200 font-medium">Qté</th>
                <th className="text-right py-3 px-3 border-b border-gray-200 font-medium">PU HT</th>
                <th className="text-center py-3 px-3 border-b border-gray-200 font-medium">TVA %</th>
                <th className="text-right py-3 px-3 border-b border-gray-200 font-medium">Total TTC</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-900">{item.description}</td>
                  <td className="py-3 px-3 text-center text-gray-900">{item.quantity}</td>
                  <td className="py-3 px-3 text-right text-gray-900">{item.unitPrice.toLocaleString()} FCFA</td>
                  <td className="py-3 px-3 text-center text-gray-900">{item.tva}%</td>
                  <td className="py-3 px-3 text-right text-gray-900">{item.totalTTC.toLocaleString()} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div />
        <div className="md:w-[360px] ml-auto">
          <div className="space-y-2 rounded-xl border border-gray-200 bg-white px-4 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Total HT</span>
              <span className="font-medium text-gray-900">
                {invoice.totalHT.toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Total TVA</span>
              <span className="font-medium text-gray-900">
                {invoice.totalTVA.toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="text-gray-900 font-semibold">Total TTC</span>
              <span className="text-gray-900 font-semibold">
                {invoice.totalTTC.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

