import React, { useState } from "react";
import { flexRender } from "@tanstack/react-table";

export const PatientTableMobile = ({ table }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const isRowExpanded = (rowId) => expandedRows[rowId];
  return (
    <>
      {table.getRowModel().rows.map((row) => {
        const patientName = row.original.name;
        const patientStatus = row.original.status;

        return (
          <div
            key={row.id}
            className={`border rounded-lg shadow-sm bg-white overflow-hidden ${
              isRowExpanded(row.id) ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div
              onClick={() =>
                setExpandedRows({
                  ...expandedRows,
                  [row.id]: !isRowExpanded(row.id),
                })
              }
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="font-bold text-gray-800">{patientName}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  patientStatus === "Activo"
                    ? "bg-green-100 text-green-800"
                    : patientStatus === "Asignado"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {patientStatus}
              </span>
            </div>

            {isRowExpanded(row.id) && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {row.getAllCells().map((cell) => {
                    return (
                      <div key={cell.id} className="flex flex-col">
                        <span className="text-gray-500 text-xs capitalize">
                          {typeof cell.column.columnDef.header === "function"
                            ? cell.column.columnDef.header?.()
                            : cell.column.columnDef.header}
                        </span>
                        <span className="font-medium text-gray-800">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
