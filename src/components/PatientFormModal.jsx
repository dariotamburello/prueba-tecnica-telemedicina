import React, { useState } from "react";

import { initialPatientData } from "../data/initialData";

export default function PatientFormModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(initialPatientData);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Datos del Paciente
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(initialPatientData).map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {key}
                </label>
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}
            <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-lg">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
