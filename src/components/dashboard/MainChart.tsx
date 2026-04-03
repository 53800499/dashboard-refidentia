"use client";

import { useMemo, useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { format, isSameDay } from "date-fns";
import { ChevronDown } from "lucide-react";

const data = [
  { date: "2026-03-31T00:30:00", value: 200 },
  { date: "2026-03-31T01:10:00", value: 900 },
];

export default function MainChart() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [now, setNow] = useState(new Date());

  //  update temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isToday = isSameDay(selectedDate, now);
  const currentHour = now.getHours();

  // 24h FIXE (Stripe garde toujours toute la journée)
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0") + ":00"
  );

  // FILTRAGE
const filteredData = data.filter((item) =>
  isSameDay(new Date(item.date), selectedDate)
);

// AGRÉGATION
const groupedData: Record<string, number> = {};

hours.forEach((h) => (groupedData[h] = 0));

filteredData.forEach((item) => {
  const hour =
    new Date(item.date).getHours().toString().padStart(2, "0") + ":00";

  groupedData[hour] += item.value;
});

  // LOGIQUE STRIPE (past / future)
  const chartData = useMemo(() => {
    return hours.map((h, index) => {
        const value = groupedData[h];
        if (!isToday) return { time: h, past: value, future: null };
        return {
        time: h,
        past: index <= currentHour ? value : null,
        future: index >= currentHour ? value : null,
        };
    });
  }, [JSON.stringify(groupedData), isToday, currentHour]);

  const total = filteredData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Volume brut</p>
          <h2 className="text-2xl font-semibold">
            {total.toLocaleString()} FCFA
          </h2>
          <p className="text-xs text-gray-400">
            {format(now, "HH:mm")}
          </p>
        </div>

        {/* DATE PICKER */}
        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="text-gray-500 text-sm flex items-center gap-1"
          >
            {format(selectedDate, "dd MMM yyyy")}
            <ChevronDown className="w-4" />
          </button>

          {showCalendar && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl p-3 z-50">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) setSelectedDate(date);
                  setShowCalendar(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* GRAPH */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              interval={3}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) =>
                `${value?.toLocaleString()} FCFA`
              }
            />

            {/* PASSÉ */}
            <Line
              type="monotone"
              dataKey="past"
              stroke="#635BFF"
              strokeWidth={2}
              dot={false}
            />

            {/* FUTUR (POINTILLÉ) */}
            <Line
              type="monotone"
              dataKey="future"
              stroke="#D1D5DB"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}