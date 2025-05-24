import React from "react";

export default function AlertComponent({
  type,
  severity,
  status,
  recovered,
  device,
  last_ok,
}) {
  // Función para formatear el timestamp de last_ok
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="flex items-center bg-white rounded-lg shadow border px-4 py-3 w-full min-h-[70px]">
      {/* Icono de alerta */}
      <div className="flex items-center justify-center mr-4">
        <span
          className={`inline-block w-3 h-3 rounded-full ${
            severity === "crit"
              ? "bg-red-500"
              : severity === "warn"
              ? "bg-yellow-400"
              : "bg-blue-400"
          }`}
        ></span>
      </div>

      {/* Info principal */}
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-base text-gray-800">
            {type || "Alerta"}
          </span>
          <span className="text-xs text-gray-400">
            {device?.hostname || "Nodo desconocido"}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {formatDate(last_ok)} &bull;{" "}
          {device?.location || "Ubicación desconocida"}
        </div>
      </div>

      {/* Estado */}
      <div className="ml-4 flex flex-col items-end">
        <span
          className={`text-xs font-bold ${
            severity === "crit"
              ? "text-red-500"
              : severity === "warn"
              ? "text-yellow-500"
              : "text-blue-500"
          }`}
        >
          {severity?.toUpperCase() || "UNKNOWN"}
        </span>
        <span className="text-xs text-gray-400 mt-1">
          {status === "OK" ? "Resuelto" : "Activo"}
        </span>
      </div>
    </div>
  );
}
