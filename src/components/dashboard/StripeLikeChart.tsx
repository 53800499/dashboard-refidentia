"use client";

import { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isSameDay } from "date-fns";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const rawData = [
  { date: "2026-03-30T10:00:00", revenue: 200 },
  { date: "2026-03-30T14:00:00", revenue: 300 },
  { date: "2026-03-27T12:00:00", revenue: 150 },
];

export default function StripeChartWithCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [showCalendar, setShowCalendar] = useState(false);

  // 🎯 Filtrage par date sélectionnée
  const filteredData = useMemo(() => {
    if (!selectedDate) return rawData;

    return rawData.filter((item) =>
      isSameDay(new Date(item.date), selectedDate)
    );
  }, [selectedDate]);

  const chartData = filteredData.map((item) => ({
    time: new Date(item.date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: item.revenue,
  }));

  const total = filteredData.reduce((acc, item) => acc + item.revenue, 0);

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        
        <div>
          <p className="text-gray-500 text-sm">Volume brut</p>
          <h2 className="text-2xl font-semibold">
            {total.toLocaleString()} $CA
          </h2>
        </div>

        {/* DATE PICKER BUTTON */}
        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="text-gray-500 text-sm border px-3 py-1 rounded-lg hover:bg-gray-100"
          >
            {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Choisir une date"}
          </button>

          {/* CALENDAR */}
          {showCalendar && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl p-3 z-50">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* GRAPH */}
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#635BFF"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}