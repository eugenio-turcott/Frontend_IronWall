import React from "react";

export default function AlertComponent({ tipo, nodo, fecha, severity, device }) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow border px-4 py-3 w-full min-h-[70px]">
      {/* Icono de alerta */}
      <div className="flex items-center justify-center mr-4">
        <span className={`inline-block w-3 h-3 rounded-full ${severity === "crit" ? "bg-red-500" : "bg-yellow-400"}`}></span>
      </div>
      {/* Info principal */}
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-base text-gray-800">{tipo}</span>
          <span className="text-xs text-gray-400">{device?.hostname || nodo}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {fecha} &bull; {device?.location}
        </div>
      </div>
      {/* Estado */}
      <div className="ml-4 flex flex-col items-end">
        <span className={`text-xs font-bold ${severity === "crit" ? "text-red-500" : "text-yellow-500"}`}>{severity?.toUpperCase()}</span>
        <span className="text-xs text-gray-400 mt-1">{device?.vendor}</span>
      </div>
    </div>
  );
}

