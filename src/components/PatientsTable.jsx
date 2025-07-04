import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAuth } from "../hooks/useAuth";
import { usePatientContext } from "../hooks/usePatientContext";

export default function PatientsTable({ data }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { isOperator, user } = useAuth();
  const { updatePatient, assignRoomToPatient, assignRoomAndGetFirstAvailable } =
    usePatientContext();

  const handleSendLink = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const handleAssignToDoctor = (patient) => {
    const firstAvailableRoom = assignRoomAndGetFirstAvailable();

    if (!firstAvailableRoom) {
      alert("No hay salas disponibles.");
      return;
    }
    const updatedPatient = {
      ...patient,
      assignedTo: user.email,
      attendAt: new Date().toLocaleString(),
      room: firstAvailableRoom,
    };
    assignRoomToPatient(firstAvailableRoom);
    updatePatient(updatedPatient);
  };

  const handleFinishConsultation = (patient) => {
    const updatedPatient = {
      ...patient,
      status: "Finalizado",
      room: "",
    };

    updatePatient(updatedPatient);
  };

  const columns = [
    ...(isOperator
      ? [
          {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => (
              <button
                onClick={() => handleSendLink(row.original)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Enviar Link
              </button>
            ),
          },
        ]
      : []),
    { header: "Nombre", accessorKey: "name" },
    { header: "DNI", accessorKey: "dni" },
    { header: "Edad", accessorKey: "age" },
    { header: "Sexo", accessorKey: "gender" },
    { header: "Whatsapp", accessorKey: "whatsapp" },
    { header: "Diagnóstico", accessorKey: "diagnosis" },
    { header: "Asignado a", accessorKey: "assignedTo" },
    { header: "Sala", accessorKey: "room" },
    { header: "Fecha y Hora de Inicio", accessorKey: "createdAt" },
    { header: "Fecha y Hora de Atencion", accessorKey: "attendedAt" },
    { header: "Estado", accessorKey: "status" },
    ...(user?.role === "doctor"
      ? [
          {
            id: "assign",
            header: "Asignar",
            cell: ({ row }) => {
              const patient = row.original;

              const canAssign =
                !patient.assignedTo && patient.status === "Activo";

              return canAssign ? (
                <button
                  onClick={() => handleAssignToDoctor(row.original)}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Asignarme
                </button>
              ) : null;
            },
          },
        ]
      : []),
    ...(user?.role === "doctor"
      ? [
          {
            id: "finish",
            header: "Finalizar",
            cell: ({ row }) => {
              const patient = row.original;
              const isAssignedToMe = patient.assignedTo === user.email;

              return isAssignedToMe && patient.status === "Activo" ? (
                <button
                  onClick={() => handleFinishConsultation(patient)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Finalizar Consulta
                </button>
              ) : null;
            },
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmación</h3>
            <p className="mb-4">
              ¿Está seguro que desea enviar el link al paciente{" "}
              <strong>{selectedPatient?.name}</strong> a su teléfono WhatsApp:{" "}
              <strong>{selectedPatient?.whatsapp}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
