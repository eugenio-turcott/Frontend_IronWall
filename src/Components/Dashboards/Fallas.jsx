import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FallasTop({ selectedGraph, onClose }) {
  const [failuresData, setFailuresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(failuresData)
  useEffect(() => {
  const fetchFailures = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/ports/failures");
      if (!response.ok) throw new Error("Error fetching failures data");

      const data = await response.json();
      setFailuresData(data);
    //   console.log(failuresData)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchFailures();
}, [selectedGraph]);

  if (selectedGraph !== "fallas") return null;

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

      <div className="flex flex-col w-3/5 p-4">
        <h2 className="text-xl font-bold mb-4">Top 5 Fallas por IP</h2>

        {loading ? (
          <div className="h-full flex items-center justify-center">Cargando datos...</div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-red-500">
            Error: {error}
          </div>
        ) : failuresData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={failuresData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
   
            <XAxis
            type="number"
            label={{ value: "Failures", position: "insideBottom", offset: -5 }}
            tickFormatter={(value) => value.toLocaleString()}
            />
               <YAxis
            dataKey="device"
            type="category"
            label={{ value: "Device", angle: -90, position: "insideLeft" }}
            tick={{ fontSize: 12 }}
            />

              <Tooltip />
              <Bar dataKey="fail_count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-col w-1/5 border-l p-4">
        <h3 className="font-semibold text-lg">Detalles</h3>
        {!loading && !error && failuresData.length > 0 ? (
          <>
            <div>
              <h4 className="text-sm font-medium">Total fallas</h4>
              <p className="text-2xl font-bold">
                {failuresData.reduce((sum, item) => sum + item.fail_count, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Número de Dispositivos</h4>
              <p>{failuresData.length}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Dispositivos listadas</h4>
              <ul className="list-disc list-inside text-sm mt-2 max-h-48 overflow-auto">
                {failuresData.map((item) => (
                    <div key={item.device}>
                        {item.device}: {typeof item.fail_count === 'number' ? item.fail_count.toLocaleString() : '0'}
                    </div>
                    ))
                    }
              </ul>
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-2">No hay detalles disponibles</p>
        )}
      </div>
    </div>
  );
}
