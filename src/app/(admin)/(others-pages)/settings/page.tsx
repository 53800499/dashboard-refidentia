import React from "react";
import { Metadata } from "next";
import CompanySettingsForm from "@/components/settings/CompanySettingsForm";

export const metadata: Metadata = {
  title: "Configurations",
  description: "Configuration de votre entreprise (logo, IFU et autres).",
};

export default function SettingsPage() {
  return <CompanySettingsForm />;
}

