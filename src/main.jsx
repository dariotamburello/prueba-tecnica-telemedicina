import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PatientProvider } from "./context/PatientContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

const user = localStorage.getItem("user");

if (window.location.pathname === "/" && user) {
  window.location.href = "/home";
}

root.render(
  <React.StrictMode>
    <PatientProvider>
      <App />
    </PatientProvider>
  </React.StrictMode>
);
