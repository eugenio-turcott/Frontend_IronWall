import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export default function ConsumoTotal({ selectedGraph, onClose }) {
  const [tipoConsumo, setTipoConsumo] = useState("externo");
  const [consumoData, setConsumoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedGraph !== "consumo_total") return;
    const fetchConsumo = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
          tipoConsumo === "externo"
            ? "http://ec2-44-202-12-128.compute-1.amazonaws.com/ports/total-consumption-internet"
            : "http://ec2-44-202-12-128.compute-1.amazonaws.com/ports/total-consumption-nonInternet";
        const response = await fetch(endpoint);
        const data = await response.json();
        setConsumoData(data);
      } catch (err) {
        setError("Error al obtener datos de la API: " + err.message);
        setConsumoData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchConsumo();
  }, [selectedGraph, tipoConsumo]);

  if (selectedGraph !== "consumo_total") return null;

  // Preparar datos para PieChart
  const pieChartData = consumoData
    ? [
        { name: "Entrada (GB)", value: consumoData.total_in_gb },
        { name: "Salida (GB)", value: consumoData.total_out_gb },
        { name: "Combinado (GB)", value: consumoData.total_combined_gb },
      ]
    : [];

  return (
    <div className="flex w-full h-full bg-white rounded-xl shadow mt-4 border relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      {/* Panel de filtros */}
      <div className="flex flex-col w-1/5 border-r p-4 space-y-4 bg">
        <h3 className="font-semibold text-lg">Filtros</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Consumo</label>
          <div className="flex gap-2">
            <Button
              variant={tipoConsumo === "externo" ? "default" : "outline"}
              className="flex-1 cursor-pointer"
              onClick={() => setTipoConsumo("externo")}
            >
              Externo
            </Button>
            <Button
              variant={tipoConsumo === "interno" ? "default" : "outline"}
              className="flex-1 cursor-pointer"
              onClick={() => setTipoConsumo("interno")}
            >
              Interno
            </Button>
          </div>
        </div>
      </div>
      {/* Gráfica principal */}
      <div className="flex flex-col w-3/5 p-4 items-center">
        <h2 className="text-xl font-bold mb-4 justify-center">
          Consumo Total ({tipoConsumo === "externo" ? "Externo" : "Interno"})
        </h2>
        <div className="w-full h-[350px] flex items-center justify-center">
          {loading ? (
            <div className="text-gray-500">Cargando datos...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : consumoData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip
                  formatter={(value) => `${value?.toLocaleString()} GB`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-500">No hay datos disponibles</div>
          )}
        </div>
      </div>
      {/* Panel de detalles */}
      <div className="flex flex-col w-1/5 border-l p-4">
        <h3 className="font-semibold text-lg">Detalles</h3>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium">Entrada (GB)</h4>
            <p className="text-2xl font-bold">
              {consumoData
                ? consumoData.total_in_gb.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : "-"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Salida (GB)</h4>
            <p className="text-2xl font-bold">
              {consumoData
                ? consumoData.total_out_gb.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : "-"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Combinado (GB)</h4>
            <p className="text-2xl font-bold">
              {consumoData
                ? consumoData.total_combined_gb.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
