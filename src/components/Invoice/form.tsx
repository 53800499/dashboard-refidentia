/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import React, { useEffect, useState } from "react";
import useInvoice from "@/hooks/useInvoice";
import useCustomer from "@/hooks/useCustomer";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { CirclePlus } from "lucide-react";

export default function InvoiceForm() {
  const { createInvoice, loading, error } = useInvoice();
  const { customers, loading: loadingCustomers, error: errorCustomers} = useCustomer();
  const router = useRouter();
  const [errorAdd, setErrorAdd] = useState(false);
  const [loadingAddEMECEF, setLoadingAddEMECE] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [manualClientName, setManualClientName] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const [items, setItems] = useState<{
    description: string;
    quantity: number;
    unitPrice: number;
    tva: number;
  }[]>([
    { description: "", quantity: 1, unitPrice: 0, tva: 18 },
  ]);

  // Prefill depuis une génération "depuis transaction"
  useEffect(() => {
    try {
      const raw = localStorage.getItem("invoicePrefill");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        name?: string;
        email?: string;
        amount?: number;
      };

      if (parsed.amount !== undefined && parsed.amount !== null) {
        setManualClientName(parsed.name ?? "");
        setSelectedCustomerId(null);
        setItems([
          {
            description: "Paiement",
            quantity: 1,
            unitPrice: Number(parsed.amount) || 0,
            tva: 18,
          },
        ]);
      }

      localStorage.removeItem("invoicePrefill");
    } catch {
      // ignore si localStorage indisponible
    }
  }, []);

  // --- Gestion des lignes ---
  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0, tva: 18 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const copy = [...items];
    (copy[index] as any)[field] = value;
    setItems(copy);
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAdd(true);

    const customerId =
      selectedCustomerId ??
      // Si saisi manuellement, créer temporairement un ID négatif pour mock
      -Date.now();
      try {
        if (!customerId && !manualClientName) {
            alert("Veuillez sélectionner ou saisir un client");
            return;
        }

        const formattedItems = items.map(item => ({
        id: `${Date.now()}-${Math.random()}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tva: item.tva,
        totalHT: item.quantity * item.unitPrice,
        totalTVA: item.quantity * item.unitPrice * (item.tva / 100),
        totalTTC: item.quantity * item.unitPrice * (1 + item.tva / 100),
        }));

        const totalHT = formattedItems.reduce((acc, i) => acc + i.totalHT, 0);
        const totalTVA = formattedItems.reduce((acc, i) => acc + i.totalTVA, 0);
        const totalTTC = formattedItems.reduce((acc, i) => acc + i.totalTTC, 0);

        await createInvoice(customerId, formattedItems);
        setLoadingAdd(false);

        router.push("/invoice-emecef");
    }catch (error) {
        setErrorAdd(true);
        setLoadingAdd(false);
    }
    
  };
  const handleSubmitEMECEF = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoadingAddEMECE(true)
    const customerId =
      selectedCustomerId ??
      // Si saisi manuellement, créer temporairement un ID négatif pour mock
      -Date.now();
      try {
        if (!customerId && !manualClientName) {
            alert("Veuillez sélectionner ou saisir un client");
            return;
        }

        const formattedItems = items.map(item => ({
        id: `${Date.now()}-${Math.random()}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tva: item.tva,
        totalHT: item.quantity * item.unitPrice,
        totalTVA: item.quantity * item.unitPrice * (item.tva / 100),
        totalTTC: item.quantity * item.unitPrice * (1 + item.tva / 100),
        }));

        const totalHT = formattedItems.reduce((acc, i) => acc + i.totalHT, 0);
        const totalTVA = formattedItems.reduce((acc, i) => acc + i.totalTVA, 0);
        const totalTTC = formattedItems.reduce((acc, i) => acc + i.totalTTC, 0);

        await createInvoice(customerId, formattedItems);
        setLoadingAddEMECE(false);

        router.push("/invoice-emecef");
    }catch (error) {
        setErrorAdd(true);
        setLoadingAddEMECE(false);
    }
    
  };

  return (
    <form className="space-y-6 bg-white p-6 rounded-xl shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">Nouvelle Facture</h2>
      {errorAdd && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur !</strong>
                  <span className="block sm:inline">{error}</span>
                  </div>
      )}

      {/* --- Client --- */}
      <div className="grid md:grid-cols-2 gap-4">
        <select
          value={selectedCustomerId || ""}
          onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : null)}
          className="border p-2 rounded"
          title="Client"
        >
          <option value="">-- Sélectionner un client existant --</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <Input
          type="text"
          placeholder="Ou saisir le nom du client"
          value={manualClientName}
          onChange={(e) => {
            setManualClientName(e.target.value);
            setSelectedCustomerId(null);
          }}
          className="border p-2 rounded"
        />
      </div>

      {/* --- Tableau Items --- */}
      <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Qté</TableCell>
              <TableCell>PU HT</TableCell>
              <TableCell>TVA %</TableCell>
              <TableCell>Total HT</TableCell>
              <TableCell>TVA</TableCell>
              <TableCell>Total TTC</TableCell>
            </TableRow>
          </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {items.map((item, idx) => (
              <TableRow key={idx} className="border-t">
                <TableCell>
                  <input
                    className="border p-1 w-full focus:border-blue-300 focus:outline-none "
                    value={item.description}
                    title="Description"
                    placeholder="Ex: Abonnement / Service"
                    onChange={e => updateItem(idx, "description", e.target.value)}
                  />
                </TableCell>
                <TableCell className="w-32">
                  <input
                    type="number"
                    className="border text-center p-1 w-32 focus:border-blue-300 focus:outline-none "
                    value={item.quantity}
                    title="Quantité"
                    onChange={e => updateItem(idx, "quantity", Number(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-32">
                  <input
                    type="number"
                    className="border text-center p-1 w-32 focus:border-blue-300 focus:outline-none "
                    value={item.unitPrice}
                    title="Prix unitaire"
                    onChange={e => updateItem(idx, "unitPrice", Number(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-32 text-center">
                  <input
                    type="number"
                    className="border text-center p-1 w-32 focus:border-blue-300 focus:outline-none "
                    value={item.tva}
                    title="TVA %"
                    onChange={e => updateItem(idx, "tva", Number(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-32 text-center">{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                <TableCell className="w-32 text-center">{(item.quantity * item.unitPrice * item.tva / 100).toLocaleString()}</TableCell>
                <TableCell className="font-semibold w-32 text-center">
                  {(item.quantity * item.unitPrice * (1 + item.tva / 100)).toLocaleString()}
                </TableCell>
                <TableCell className="w-32 text-center">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} className="text-red-600">❌</button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <button type="button" onClick={addItem} className="bg-gray-200 px-4 py-2 rounded">+ Ajouter produit</button>

      {/* --- Totaux --- */}
      <div className="bg-gray-50 p-4 rounded w-full md:w-1/3 ml-auto space-y-2">
        <div>Total HT : {items.reduce((a, i) => a + i.quantity * i.unitPrice, 0).toLocaleString()} FCFA</div>
        <div>TVA : {items.reduce((a, i) => a + i.quantity * i.unitPrice * i.tva / 100, 0).toLocaleString()} FCFA</div>
        <div className="text-lg font-bold">
          Total TTC : {items.reduce((a, i) => a + i.quantity * i.unitPrice * (1 + i.tva / 100), 0).toLocaleString()} FCFA
        </div>
      </div>
      <div className="flex gap-4">
        <Button type="submit" loading={loadingAdd} className="bg-blue-600 text-white px-6 py-2 rounded">{loading ?"": <CirclePlus className="w-4 h-4 mr-1"/> }Enregistrer la facture</Button>
        <Button variant="secondary" onClick={handleSubmitEMECEF} loading={loadingAddEMECEF} className="bg-green-600 text-white px-6 py-2 rounded">{loading ?"": <CirclePlus className="w-4 h-4 mr-1"/> }Émettre EMECEF</Button>
      </div>

    </form>
  );
}