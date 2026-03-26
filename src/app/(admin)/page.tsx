import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Tableau de bord | Admin",
  description: "Page d'accueil admin — vue d'ensemble des transactions, revenus, commerçants et alertes",
};

export default function Dashboard() {
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Tableau de bord" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Left column: metrics & charts */}
        <div className="col-span-12 space-y-6 xl:col-span-8">
            <EcommerceMetrics />

            <MonthlySalesChart />
            <StatisticsChart />
        </div>

        {/* Right column: targets, merchants, alerts */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <MonthlyTarget />

          <ComponentCard title="Commerçants actifs" desc="Nombre de commerçants ayant réalisé des transactions">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold text-gray-800 dark:text-white/90">1,248</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">(sur les 30 derniers jours)</p>
              </div>
              <div className="text-right">
                <a className="text-sm text-primary-600" href="#">Voir les commerçants →</a>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Alertes sécurité" desc="Problèmes récents détectés">
            <ul className="space-y-3">
              <li className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Connexion suspecte</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">IP inconnue détectée — 2h ago</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Urgent</span>
              </li>

              <li className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Échec d{"'"}authentification massif</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tentatives multiples — 6h ago</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">À vérifier</span>
              </li>
            </ul>
          </ComponentCard>
        </div>{/* 
        <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}


       
      </div>
      <div className="my-6">
        <RecentOrders />
      </div>
    </div>
  );
}
