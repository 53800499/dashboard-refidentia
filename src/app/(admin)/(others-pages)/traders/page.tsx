import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTable";
import { Metadata } from "next";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import SignUpForm from "@/components/auth/SignUpForm";
import { Traders } from "@/components/traders";

export const metadata: Metadata = {
  title: "Next.js Commerçants | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Commerçants  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function TraderPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Commerçants" />
      <Traders />
    </div>
  );
}
