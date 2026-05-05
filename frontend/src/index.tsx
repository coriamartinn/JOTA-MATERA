// 1. Importaciones
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
// @ts-ignore
import "./styles/index.css";

// 2. Anzuelo al HTML
const container = document.getElementById("root");

if (!container) {
  throw new Error("No se encontró el div con id 'root'");
}

// 3. Crear la raíz de React
const root = createRoot(container);

// 4. Renderizado
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);