'use client'
import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Statistique",
  description: "Page d'accueil admin — vue d'ensemble des transactions, revenus, commerçants et alertes",
};

export default function Statistical(){
  
  return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Left column: metrics & charts */}
        <div className="col-span-12 space-y-6 xl:col-span-8">
            <EcommerceMetrics />

            <StatisticsChart />
        </div>

        {/* Right column: targets, merchants, alerts */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <MonthlyTarget />
          <RecentOrders />

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
        </div>       
      </div>
  );
}

