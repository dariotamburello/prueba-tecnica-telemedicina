import React, { useState } from "react";
import PatientsTable from "../components/PatientsTable";
import { useNavigate } from "react-router-dom";
import { usePatientContext } from "../hooks/usePatientContext";
import DragDropArea from "../components/DragAndDropArea";
import PatientFormModal from "../components/PatientFormModal";
import { initialPatientData } from "../data/initialData";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { state, addPatient } = usePatientContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { isOperator } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleFileUpload = (file) => {
    console.log("Archivo subido:", file);
    setShowModal(true);
  };

  const handleSave = (data) => {
    addPatient(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 right-0 left-0 z-30 bg-white shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl lg:text-3xl font-extrabold text-gray-900">
            Telemedicina
          </h1>
          <button
            onClick={handleLogout}
            className="ml-auto p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <p className="lg:hidden">X</p>
            <span className="hidden lg:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Gestión de Pacientes
        </h2>

        {isOperator && <DragDropArea onFileUpload={handleFileUpload} />}
        <PatientsTable data={state.patients} />
        <PatientFormModal
          isOpen={showModal}
          initialData={initialPatientData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
