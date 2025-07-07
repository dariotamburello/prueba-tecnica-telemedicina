import React, { useState } from "react";

export default function DragDropArea({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed p-8 text-center mb-6 rounded-lg transition-colors duration-200 ease-in-out ${
        isDragging
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <p className="text-gray-600">
        Arrastra un archivo aquí para cargar un nuevo paciente
      </p>
    </div>
  );
}
