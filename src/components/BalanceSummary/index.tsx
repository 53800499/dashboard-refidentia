import { BALANCE_SUMMARY_COMPONENT } from "@/constants/wording";
import { Plus, ChevronDown, ArrowUpDown, FileText } from "lucide-react";

function BalanceSummary() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">
          {BALANCE_SUMMARY_COMPONENT.HEADER.TITLE} <span className="font-normal">000 FCFA</span>
        </h1>

        <div className="flex gap-2 justify-start flex-wrap">
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
            {BALANCE_SUMMARY_COMPONENT.HEADER.BUTTON} <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SUMMARY */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {BALANCE_SUMMARY_COMPONENT.SUMMARY.TITLE}
            </h2>

            {/* Bar */}
            <div className="h-3 rounded-full bg-gray-200 mb-4 overflow-hidden">
              <div className="h-full w-0 bg-indigo-500"></div>
            </div>

            {/* Table */}
            <div className="text-sm">
              <div className="flex justify-between text-gray-500 pb-2 border-b">
                <span>{BALANCE_SUMMARY_COMPONENT.SUMMARY.TYPE}</span>
                <span>{BALANCE_SUMMARY_COMPONENT.SUMMARY.AMOUNT}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                  En attente
                </div>
                <span>000 FCFA</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                  Disponible
                </div>
                <span>000 FCFA</span>
              </div>
            </div>
          </div>

          {/* ACTIVITY */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {BALANCE_SUMMARY_COMPONENT.ACTIVITY.TITLE}
            </h2>

            {/* Tabs */}
            <div className="flex gap-6 border-b mb-4 text-sm">
              <button className="pb-2 border-b-2 border-indigo-600 text-indigo-600">
                {BALANCE_SUMMARY_COMPONENT.ACTIVITY.BUTTON_TEXT}
              </button>
              <button className="pb-2 text-gray-500 hover:text-gray-700">
                {BALANCE_SUMMARY_COMPONENT.ACTIVITY.BUTTON_TEXT_}
              </button>
            </div>

            {/* Empty state */}
            <div className="border-3 border-dashed rounded-xl p-10 text-center text-sm text-gray-500">
              {BALANCE_SUMMARY_COMPONENT.ACTIVITY.EMPTY}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{BALANCE_SUMMARY_COMPONENT.RIGHT_SIDEBAR.TITLE}</h2>

          <div className="space-y-3">
            {/* Report item */}
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {BALANCE_SUMMARY_COMPONENT.RIGHT_SIDEBAR.ITEM.TITLE}
                </p>
                <p className="text-xs text-gray-500">
                  févr. 2026
                </p>
              </div>
            </div>

            {/* Report item */}
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
              <div className="p-2 bg-gray-100 rounded-lg">
                <ArrowUpDown className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {BALANCE_SUMMARY_COMPONENT.RIGHT_SIDEBAR.ITEM_.TITLE}
                </p>
                <p className="text-xs text-gray-500">
                  févr. 2026
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BalanceSummary;