import { ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  addDays,
  startOfMonth,
  endOfMonth,
  format,
  differenceInDays,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useRef } from "react";
import { DASHBOARD_COMPONENT } from "@/constants/wording";
/* ---------- Génération dynamique des données ---------- */
const generateData = (range: { from: Date; to: Date }, granularity: "day" | "hour") => {
  const diff =
    (range.to.getTime() - range.from.getTime()) /
    (1000 * 60 * 60 * (granularity === "hour" ? 1 : 24));

  return Array.from({ length: Math.max(2, Math.floor(diff)) }).map(() => ({
    v: Math.floor(Math.random() * 300),
  }));
};

/* ---------- Mini Card ---------- */
function MiniCard({
  title,
  value,
  change,
  range,
  granularity,
  selectable = false,
  selected = false,
  onClick,
}: any) {  const data = generateData(range, granularity);
  const isPositive = change?.startsWith("+");

  return (
<div
  onClick={onClick}
  className={`
    relative rounded-2xl border p-5 bg-white transition
    ${selectable ? "cursor-pointer hover:border-blue-400" : ""}
    ${selected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}
  `}
>      {selected && (
        <div className="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
          ✓
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <span className="text-xs text-gray-400">
          {differenceInDays(range.to, range.from) || 1}{" "}j
        </span>
      </div>

      <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
      <p className="text-xs text-gray-400">{value} {DASHBOARD_COMPONENT.MINI_CARD.ITEM.PERIODE}</p>

      {/* Graph */}
      <div className="h-[70px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip
              cursor={false}
              contentStyle={{
                background: "#111",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                padding: "6px 8px",
                color: "#fff",
              }}
              labelStyle={{ display: "none" }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke="#635BFF"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Dates */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{format(range.from, "d MMM")}</span>
        <span>{format(range.to, "d MMM")}</span>
      </div>

      <div className="border-t border-gray-100 mt-2"></div>

      <p className={`text-xs mt-2 font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>
        {change} {DASHBOARD_COMPONENT.MINI_CARD.ITEM.PERIODE_}
      </p>
    </div>
  );
}

/* ---------- MAIN ---------- */
export default function ReportsOverview() {
  const today = new Date();

  const [range, setRange] = useState({
    from: addDays(today, -7),
    to: today,
  });

  const [granularity, setGranularity] = useState<"day" | "hour">("day");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGranularity, setShowGranularity] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeGraphs, setActiveGraphs] = useState([
    "Paiements",
    "Volume brut",
    "Volume net",
  ]);
  const [tempSelectedGraphs, setTempSelectedGraphs] = useState([...activeGraphs]);
const wrapperRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowDatePicker(false);
      setShowGranularity(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  const allGraph = [
    { title: "Paiements", value: "0 FCFA", change: "0%" },
    { title: "Volume brut", value: "0 FCFA", change: "0%" },
    { title: "Volume net", value: "0 FCFA", change: "0%" },
    { title: "Nouveaux clients", value: "0", change: "0%" },
    { title: "Échecs de paiement", value: "0 FCFA", change: "0%" },
  ];

  const presets = [
    { label: "Aujourd'hui", getRange: () => ({ from: today, to: today }) },
    { label: "7 derniers jours", getRange: () => ({ from: addDays(today, -7), to: today }) },
    { label: "30 derniers jours", getRange: () => ({ from: addDays(today, -30), to: today }) },
    { label: "Ce mois", getRange: () => ({ from: startOfMonth(today), to: endOfMonth(today) }) },
  ];

  return (
    <div className="space-y-6 mb-20">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl mb-6 font-semibold text-gray-900">{DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.TITLE}</h2>

        <div className="flex justify-between gap-2 border-b pb-4">
          <div ref={wrapperRef} className="flex gap-2">
            {/* DATE */}
            <div className="relative">
              <button onClick={() => {
                  setShowDatePicker((prev) => !prev);
                  setShowGranularity(false);
                }} className="px-3 py-1.5 rounded-full border text-sm flex items-center gap-1">
                <div className="border-r-2 border-gray-300 px-2">{DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.DATE}</div>
                <div className="px-2 text-blue-500 flex items-center gap-1">
                  {range.from.toLocaleDateString()} - {range.to.toLocaleDateString()}
                  <ChevronDown className="w-4" />
                </div>
              </button>


                {showDatePicker && (
    <div className="absolute mt-2 bg-white border rounded-xl shadow-lg p-4 gap-4 z-50 flex">
                <div className="space-y-2 text-sm border-r pr-3">
                  {presets.map((p) => (
                    <div
                      key={p.label}
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-30"
                      onClick={() => setRange(p.getRange())}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>

                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={(r: any) => r && setRange(r)}
                />
              </div>)}
            </div>

            {/* GRANULARITE */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowGranularity((prev) => !prev);
                  setShowDatePicker(false);
                }}
                className="px-3 py-1.5 rounded-full border text-sm text-blue-500 flex items-center gap-1"
              >
                Par {granularity === "day" ? "jour" : "heure"} <ChevronDown className="w-4" />
              </button>

              {showGranularity && (
                <div className="absolute bg-white border rounded-xl shadow-lg p-4 z-50 w-30">
                <div className="flex flex-col gap-2 text-sm">
                  <label className="flex gap-2">
                    <input
                      type="radio"
                      checked={granularity === "hour"}
                      onChange={() => setGranularity("hour")}
                    />
                    Par heure
                  </label>
                  <label className="flex gap-2">
                    <input
                      type="radio"
                      checked={granularity === "day"}
                      onChange={() => setGranularity("day")}
                    />
                    Par jour
                  </label>
                </div>
              </div>)}
            </div>
          </div>

          {/* ACTION */}
          <button
            onClick={() => {
              setTempSelectedGraphs([...activeGraphs]);
              setShowModal(true);
            }}
            className="flex items-center text-sm px-3 py-1.5 rounded-lg border"
          >
            {DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.ACTION}
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allGraph
          .filter((g) => activeGraphs.includes(g.title))
          .map((g) => (
            <MiniCard
              key={g.title}
              {...g}
              range={range}
              granularity={granularity}
            />
          ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-99 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">{DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.MODAL.TITLE}</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 py-2 max-h-[600px] overflow-y-auto">
              {allGraph.map((g) => {
                const isSelected = tempSelectedGraphs.includes(g.title);

                return (
                  <div key={g.title} className="w-[300px]">
                    <MiniCard
                      {...g}
                      range={range}
                      granularity={granularity}
                      selectable
                      selected={isSelected}
                      onClick={() => {
                        setTempSelectedGraphs((prev) =>
                          prev.includes(g.title)
                            ? prev.filter((t) => t !== g.title)
                            : [...prev, g.title]
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setShowModal(false)}>{DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.MODAL.BUTTON_CANCEL}</button>
              <button
                onClick={() => {
                  setActiveGraphs(tempSelectedGraphs);
                  setShowModal(false);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.MODAL.BUTTON_APPLY}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bottom section (like Stripe empty states) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-50">
        <div className="rounded-2xl border border-gray-200 p-6 h-74">
            <h1 className="text-sm text-gray-500 font-medium mb-4">{DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.BOTTOM_SECTION.CARD.TITLE}</h1>
            <div className="rounded-2xl border-2 h-55 flex justify-center items-center border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                <span className="bg-gray-200 p-4 rounded-xl">{DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.BOTTOM_SECTION.CARD.EMPTY}</span> 
            </div>
        </div>
        

        <div className="rounded-2xl border border-gray-200 p-6">
          <div className="flex justify-between mb-6">
            <h1 className="text-sm text-gray-500 mb-3">
                {DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.BOTTOM_SECTION.CARD_.TITLE}
            </h1>
            <div className="text-sm text-gray-900 mb-3">{DASHBOARD_COMPONENT.MINI_CARD.REPORTSOVERVIEW.BOTTOM_SECTION.CARD_.INFO}</div>
          </div>
          

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Client A</span>
              <span className="font-medium">120 000 FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Client B</span>
              <span className="font-medium">98 000 FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}