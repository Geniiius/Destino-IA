/**
 * @file main.tsx
 * @description Punto de entrada de la aplicación React
 *
 * Este archivo es el bootstrap de la aplicación.
 * NO debe contener lógica de negocio.
 *
 * Solo PDF.js + Supabase - Sin IA
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
