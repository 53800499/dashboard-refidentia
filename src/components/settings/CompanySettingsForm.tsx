"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import { useCompanySettings, type CompanySettings } from "@/hooks/useCompanySettings";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"));
    reader.readAsDataURL(file);
  });
}

export default function CompanySettingsForm() {
  const { settings, loading, error, enterpriseId, saveSettings } = useCompanySettings();

  const [form, setForm] = useState<CompanySettings>(settings);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleLogoChange = async (file: File | undefined) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setForm((prev) => ({ ...prev, logo: dataUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    await saveSettings(form);
    setSuccess("Configuration enregistrée avec succès.");
  };

  return (
    <ComponentCard
      title="Configuration entreprise"
      desc={`Paramètres propres à votre entreprise (ID: ${enterpriseId})`}
      className="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-xl border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                {form.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-gray-500">Aucun logo</span>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <Label>Logo (affiché sur les factures)</Label>
                <FileInput onChange={(e) => handleLogoChange(e.target.files?.[0])} />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setForm((prev) => ({ ...prev, logo: "" }))}
                    disabled={loading}
                    className="bg-white"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Nom de l&apos;entreprise</Label>
            <Input
              value={form.companyName}
              onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
              placeholder="Ex: Rivael System"
              disabled={loading}
            />
          </div>

          <div>
            <Label>IFU</Label>
            <Input
              value={form.ifu}
              onChange={(e) => setForm((prev) => ({ ...prev, ifu: e.target.value }))}
              placeholder="Ex: 12345678X"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Adresse</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Ex: Abidjan, Côte d&apos;Ivoire"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Téléphone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Ex: +225 ..."
              disabled={loading}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Ex: contact@entreprise.com"
              disabled={loading}
              type="email"
            />
          </div>

          <div>
            <Label>Site web</Label>
            <Input
              value={form.website}
              onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
              placeholder="Ex: https://..."
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
          <Button type="submit" loading={loading} disabled={loading} className="min-w-44">
            Enregistrer
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}

