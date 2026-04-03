import { ChevronDown, Cog, Plus, X } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { addDays, startOfMonth, endOfMonth } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const allMiniData = [
  { v: 200 }, { v: 150 }, { v: 180 },
  { v: 300 }, { v: 250 }, { v: 280 }, { v: 260 },
];

function MiniCard({ title, value, change, data, onRemove }: any) {
  const isPositive = change?.startsWith("+");

  return (
    <div className="rounded-2xl border border-gray-200 p-5 transition relative">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
        >
          <X />
        </button>
      )}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <span className="text-xs text-gray-400">7j</span>
      </div>

      <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </h3>

      <div className="h-[70px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data || allMiniData}>
            <Tooltip
              contentStyle={{ background: "#111", border: "none", borderRadius: "8px", color: "#fff" }}
              labelStyle={{ display: "none" }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke="#635BFF"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className={`text-xs mt-3 font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>
        {change} vs période précédente
      </p>
    </div>
  );
}

export default function ReportsOverview() {
  const today = new Date();
  const [range, setRange] = useState<{ from: Date; to: Date }>({ from: addDays(today, -7), to: today });
  const [showModal, setShowModal] = useState(false);
  const [activeGraphs, setActiveGraphs] = useState<string[]>(["Paiements", "Volume brut", "Volume net"]);
  const [editMode, setEditMode] = useState(false);
  const [tempSelectedGraphs, setTempSelectedGraphs] = useState<string[]>([...activeGraphs]);

  const allGraph = [
    { title: "Paiements", value: "0 FCFA", change: "0%", data: allMiniData },
    { title: "Volume brut", value: "0 FCFA", change: "0%", data: allMiniData },
    { title: "Volume net", value: "0 FCFA", change: "0%", data: allMiniData },
    { title: "Nouveaux clients", value: "0", change: "0%", data: allMiniData },
    { title: "Échecs de paiement", value: "0 FCFA", change: "0%", data: allMiniData },
  ];

  const presets = [
    { label: "Aujourd'hui", getRange: () => ({ from: today, to: today }) },
    { label: "7 derniers jours", getRange: () => ({ from: addDays(today, -7), to: today }) },
    { label: "30 derniers jours", getRange: () => ({ from: addDays(today, -30), to: today }) },
    { label: "Ce mois", getRange: () => ({ from: startOfMonth(today), to: endOfMonth(today) }) },
  ];

// Fonction pour gérer le toggle des graphes
const toggleGraph = (title: string) => {
  setActiveGraphs((prev) =>
    prev.includes(title)
      ? prev.filter((g) => g !== title)
      : [...prev, title]
  );
};
  return (
    <div className="space-y-6 mb-30">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-6 font-semibold text-gray-900">Votre aperçu</h2>

        <div className="flex justify-between gap-2 border-b border-gray-200 pb-4">
          <div className="flex gap-2">
            {/* Plage de dates */}
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-full border text-sm flex items-center gap-1">
                <div className="border-r-2 border-gray-300 px-2">Plage de dates</div>
                <div className="px-2 text-blue-500 flex items-center gap-1">
                  {range.from.toLocaleDateString()} - {range.to.toLocaleDateString()}
                  <ChevronDown className="w-4" />
                </div>
              </button>
              <div className="absolute hidden group-hover:flex mt-2 bg-white border rounded-xl shadow-lg p-4 gap-4 z-50">
                {/* Presets */}
                <div className="space-y-2 text-sm border-r pr-3">
                  {presets.map((p) => (
                    <div
                      key={p.label}
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-35"
                      onClick={() => setRange(p.getRange())}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>

                {/* Calendars */}
                <div>
                  <div className="flex justify-start gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <label htmlFor="debut">Début</label>
                      <input
                        id="debut"
                        type="text"
                        value={range.from.toLocaleDateString()}
                        readOnly
                        className="border rounded-lg px-2 py-1 w-full text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor="fin">Fin</label>
                      <input
                        id="fin"
                        type="text"
                        value={range.to.toLocaleDateString()}
                        readOnly
                        className="border rounded-lg px-2 py-1 w-full text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={(r: any) => r && setRange(r)}
                      className="mr-2"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setRange({ from: today, to: today })}
                      className="flex items-center text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-gray-500 hover:bg-gray-100"
                    > Effacer
                    </button>
                    <button className="flex items-center text-white text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-blue-500 hover:bg-blue-900">
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Par jour / heure */}
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-full border text-sm flex items-center gap-1">
                Par jour <ChevronDown className="w-4" />
              </button>
              <div className="absolute hidden group-hover:flex mt-2 bg-white border rounded-xl shadow-lg p-4 gap-4 z-50 w-40">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Par heure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>Par jour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ajouter / Modifier Graph */}
          <div className="flex gap-2">
            <button
              onClick={() => { setTempSelectedGraphs([...activeGraphs]); setShowModal(true); setEditMode(false); }}
              className="flex items-center text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-gray-500"
            >
              <Plus className="w-6 h-4" /> Actions
            </button>
          </div>
        </div>
      </div>

      {/* Graphes affichés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {allGraph
    .filter((g) => activeGraphs.includes(g.title))
    .map((g) => (
      <MiniCard
        key={g.title}
        title={g.title}
        value={g.value}
        change={g.change}
        data={g.data}
      />
    ))}
</div>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-9999 p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Ajouter / Sélectionner des Graphes</h2>
        <button
          onClick={() => setShowModal(false)}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <X />
        </button>
      </div>

      {/* Body : scrollable */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allGraph.map((g, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 flex flex-col bg-gray-50 hover:bg-gray-100 transition"
            >
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={activeGraphs.includes(g.title)}
                  onChange={() => toggleGraph(g.title)}
                />
                <span className="font-medium">{g.title}</span>
              </label>

              {/* Mini aperçu du graphe */}
              <div className="flex-1">
                <MiniCard
                  title={g.title}
                  value={g.value}
                  change={g.change}
                  data={g.data}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-500 text-white hover:bg-gray-700"
        >
          Annuler
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-blue-500 text-white hover:bg-blue-700"
        >
          Appliquer
        </button>
      </div>
    </div>
  </div>
)}
    {/* Bottom section (like Stripe empty states) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-50">
        <div className="rounded-2xl border border-gray-200 p-6 h-74">
            <h1 className="text-sm text-gray-500 font-medium mb-4">Échecs de paiement</h1>
            <div className="rounded-2xl border-2 h-55 flex justify-center items-center border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                <span className="bg-gray-200 p-4 rounded-xl">Aucune donnée</span> 
            </div>
        </div>
        

        <div className="rounded-2xl border border-gray-200 p-6">
          <div className="flex justify-between mb-6">
            <h1 className="text-sm text-gray-500 mb-3">
                Meilleurs clients par montant dépensé
            </h1>
            <div className="text-sm text-gray-900 mb-3">Toutes les périodes</div>
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