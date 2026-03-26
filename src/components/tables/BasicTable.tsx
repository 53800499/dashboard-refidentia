"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export interface Column<T, K extends keyof T = keyof T> {
  header: string;
  accessor: K;
  render?: (value: T[K], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string | number;
}

export default function DataTable<T>({
  data,
  columns,
  getRowId,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((col, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs"
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((col, index) => (
                    <TableCell
                      key={index}
                      className="px-5 py-4 text-theme-sm text-gray-500"
                    >
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : (row[col.accessor] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}