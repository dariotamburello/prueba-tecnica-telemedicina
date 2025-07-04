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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Pacientes</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>

      {isOperator && <DragDropArea onFileUpload={handleFileUpload} />}
      <PatientsTable data={state.patients} />
      <PatientFormModal
        isOpen={showModal}
        initialData={{ initialPatientData }}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
