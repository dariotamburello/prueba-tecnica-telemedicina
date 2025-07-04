export const loadPatients = () => {
  const data = localStorage.getItem("patients");
  if (data === "undefined" || data === null) {
    return [];
  }
  return data ? JSON.parse(data) : [];
};

export const savePatients = (patients) => {
  localStorage.setItem("patients", JSON.stringify(patients));
};
