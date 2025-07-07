import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAuth } from "../hooks/useAuth";
import { usePatientContext } from "../hooks/usePatientContext";
import { PatientTableMobile } from "./PatientTableMobile";

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
      attendedAt: new Date().toLocaleString(),
      status: "Asignado",
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

              return isAssignedToMe && patient.status === "Asignado" ? (
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
      <div className="hidden md:block overflow-x-auto">
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
      </div>

      <div className="block md:hidden space-y-4">
        <PatientTableMobile table={table}></PatientTableMobile>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 ease-in-out">
            <div className="border-b border-gray-200 pb-3 pt-4 px-6 flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-gray-900">
                Confirmación
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Cerrar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">
              <p className="text-base text-gray-700 mb-4">
                ¿Está seguro que desea enviar el link al paciente{" "}
                <strong className="text-gray-900">
                  {selectedPatient?.name}
                </strong>{" "}
                a su teléfono WhatsApp:{" "}
                <strong className="text-green-600">
                  {selectedPatient?.whatsapp}
                </strong>
                ?
              </p>
            </div>

            <div className="flex justify-end space-x-3 px-6 pb-6">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
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
