import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import formatBytes from "@/utils/formatBytes";

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
            ? "http://ec2-54-159-226-76.compute-1.amazonaws.com/ports/total-consumption-internet"
            : "http://ec2-54-159-226-76.compute-1.amazonaws.com/ports/total-consumption-nonInternet";
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

  // Colores para cada parte del pie
  const pieColors = ["#4f46e5", "#22c55e", "#f59e42"];
  // Preparar datos para PieChart
  const pieChartData = consumoData
    ? [
        { name: "Entrada ", value: consumoData.total_in_gb },
        { name: "Salida ", value: consumoData.total_out_gb },
        { name: "Combinado ", value: consumoData.total_combined_gb },
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
        <div className="w-full h-[420px] flex flex-col items-center justify-center mt-4">
          {loading ? (
            <div className="text-gray-500">Cargando datos...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : consumoData ? (
            <>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={pieChartData}
                    cx="50%"
                    cy="54%"
                    outerRadius={140}
                    innerRadius={60}
                    label={({ name, value }) => `${name}: ${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} GB`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} GB`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full flex justify-center mt-8">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded-full" style={{ background: pieColors[0] }}></span>
                    <span className="text-sm">Entrada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded-full" style={{ background: pieColors[1] }}></span>
                    <span className="text-sm">Salida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded-full" style={{ background: pieColors[2] }}></span>
                    <span className="text-sm">Combinado</span>
                  </div>
                </div>
              </div>
            </>
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
            <h4 className="text-sm font-medium">Entrada</h4>
            <p className="text-2xl font-bold">
              {consumoData ? `${(consumoData.total_in_gb / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} GB` : "-"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Salida</h4>
            <p className="text-2xl font-bold">
              {consumoData ? `${(consumoData.total_out_gb / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} GB` : "-"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Combinado</h4>
            <p className="text-2xl font-bold">
              {consumoData ? `${(consumoData.total_combined_gb / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} GB` : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
