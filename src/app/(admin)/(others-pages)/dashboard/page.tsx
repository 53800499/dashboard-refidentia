"use client";

import MainChart from "@/components/dashboard/MainChart";
import ReportsOverview from "@/components/dashboard/MiniCard";
import SideStats from "@/components/dashboard/SideStats";
import { DASHBOARD } from "@/constants/wording";

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b-2 pb-4 border-gray-200">
        <h1 className="text-2xl font-semibold">{DASHBOARD.TITLE}</h1>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 p-6 rounded-xl border border-gray-200">
          <MainChart />
        </div>

        <div className="p-6 rounded-xl border border-gray-200">
          <SideStats />
        </div>
      </div>

      {/* REPORTS */}
      <ReportsOverview />
    </div>
  );
}