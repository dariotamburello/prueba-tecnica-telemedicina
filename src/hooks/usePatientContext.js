import { useContext } from "react";
import { PatientContext } from "../context/PatientContext";

export function usePatientContext() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error(
      "usePatientContext debe usarse dentro de un PatientProvider"
    );
  }
  return context;
}
