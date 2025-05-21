import React from "react";

export default function FocusGraph({ selectedGraph, chartComponents }) {
  if (!selectedGraph) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        Selecciona una gráfica para ver el detalle.
      </div>
    );
  }
  const Chart = chartComponents[selectedGraph];
  return (
    <div className="flex w-full h-full bg-white rounded-xl shadow border mt-8" style={{ minHeight: 220 }}>
      <div className="flex items-center justify-center w-1/5 border-r p-4">Test</div>
      <div className="flex items-center justify-center w-3/5 p-4">
        {Chart}
      </div>
      <div className="flex items-center justify-center w-1/5 border-l p-4">Test</div>
    </div>
  );
}
