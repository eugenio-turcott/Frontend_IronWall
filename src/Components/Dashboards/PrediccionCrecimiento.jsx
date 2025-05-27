import React, { useState, useEffect } from "react";
import { X, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Estilo principal
import "react-date-range/dist/theme/default.css"; // Tema por defecto
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

export default function PrediccionCrecimiento({ selectedGraph, onClose }) {
  const [predictionRange, setPredictionRange] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIP, setSelectedIP] = useState("all");
  const [availableIPs, setAvailableIPs] = useState([]);

  const predictionRangeOptions = [
    { value: "3m", label: "Próximos 3 meses" },
    { value: "6m", label: "Próximos 6 meses" },
    { value: "1y", label: "Próximo año" },
    { value: "all", label: "Todo el período" },
  ];

  // En PrediccionCrecimiento.jsx, modifica el useEffect que carga los datos:
  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/graphs/prediction");
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();

        console.log("Datos recibidos de la API:", data);

        if (!data.historical || !data.prediction) {
          throw new Error("Estructura de datos incorrecta");
        }

        const transformedData = transformPredictionData(data);
        console.log("Datos transformados:", transformedData);

        setGraphData({ ...data, transformedData });
        setFilteredData(transformedData); // <-- Aquí establecemos los datos filtrados iniciales
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedGraph) fetchPredictionData();
  }, [selectedGraph]);

  const transformPredictionData = (apiData) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    // Verificar y limpiar las IPs
    const ips = (apiData.meta.legend || [])
      .filter((ip) => ip && typeof ip === "string" && ip.trim() !== "")
      .filter((ip, index, self) => self.indexOf(ip) === index);
    setAvailableIPs(ips);

    // Procesar datos históricos
    const historicalPoints = [];
    const historicalStart = new Date(apiData.meta.historical_start * 1000);
    const step = apiData.meta.step;

    // Validar estructura de datos históricos
    const historicalData = Array.isArray(apiData.historical)
      ? apiData.historical
      : [];

    if (ips.length > 0 && historicalData.length > 0) {
      for (
        let timeIndex = 0;
        timeIndex < historicalData[0].length;
        timeIndex++
      ) {
        const currentDate = new Date(
          historicalStart.getTime() + timeIndex * step * 1000
        );
        const monthName = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();

        const ipValues = {};
        let totalValue = 0;
        let hasValidData = false;

        ips.forEach((ip, ipIndex) => {
          const val = historicalData[ipIndex]?.[timeIndex];
          let numericValue = 0;

          if (typeof val === "number") {
            numericValue = Math.max(0, val);
            hasValidData = true;
          } else if (typeof val === "string") {
            // Manejar formatos especiales como "0.0JS:0"
            const cleanVal = val.split("JS:")[0];
            numericValue = Math.max(0, parseFloat(cleanVal) || 0);
            if (numericValue > 0) hasValidData = true;
          }

          ipValues[ip] = numericValue;
          totalValue += numericValue;
        });

        if (hasValidData) {
          historicalPoints.push({
            name: `${monthName} ${year}`,
            month: `${monthName} ${year}`,
            pv: totalValue,
            timestamp: currentDate.getTime(),
            year: year.toString(),
            date: currentDate,
            ipValues,
            isPrediction: false,
          });
        }
      }
    }

    // Procesar datos de predicción
    const predictionPoints = [];
    const predictionStart = new Date(apiData.meta.prediction_start * 1000);
    const oneYearLater = new Date(predictionStart);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    // Validar estructura de datos de predicción
    const predictionData = Array.isArray(apiData.prediction)
      ? apiData.prediction
      : [];

    if (ips.length > 0 && predictionData.length > 0) {
      for (
        let timeIndex = 0;
        timeIndex < predictionData[0].length;
        timeIndex++
      ) {
        const currentDate = new Date(
          predictionStart.getTime() + timeIndex * step * 1000
        );
        if (currentDate > oneYearLater) break;

        const monthName = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();

        const ipValues = {};
        let totalValue = 0;
        let hasValidData = false;

        ips.forEach((ip, ipIndex) => {
          const val = predictionData[ipIndex]?.[timeIndex];
          const numericValue = Math.max(0, parseFloat(val) || 0);

          if (numericValue > 0) hasValidData = true;
          ipValues[ip] = numericValue;
          totalValue += numericValue;
        });

        if (hasValidData) {
          predictionPoints.push({
            name: `${monthName} ${year} (Pred)`,
            month: `${monthName} ${year}`,
            pv: totalValue,
            timestamp: currentDate.getTime(),
            year: year.toString(),
            date: currentDate,
            ipValues,
            isPrediction: true,
          });
        }
      }
    }

    return [...historicalPoints, ...predictionPoints].sort(
      (a, b) => a.timestamp - b.timestamp
    );
  };

  const applyFilters = () => {
    if (!graphData?.transformedData) return;

    let data = [...graphData.transformedData];
    const cutoffIndex = data.findIndex((item) => item.isPrediction);

    // Filtrar por rango de predicción
    if (cutoffIndex >= 0) {
      const historicalData = data.slice(0, cutoffIndex);
      let predictionData = data.slice(cutoffIndex);

      if (predictionRange !== "all") {
        const cutoffDate = new Date(data[cutoffIndex].timestamp);
        let targetDate = new Date(cutoffDate);

        switch (predictionRange) {
          case "3m":
            targetDate.setMonth(targetDate.getMonth() + 3);
            break;
          case "6m":
            targetDate.setMonth(targetDate.getMonth() + 6);
            break;
          case "1y":
            targetDate.setFullYear(targetDate.getFullYear() + 1);
            break;
        }

        predictionData = predictionData.filter(
          (item) => new Date(item.timestamp) <= targetDate
        );
      }

      data = [...historicalData, ...predictionData];
    }

    // Filtrar por IP y eliminar puntos sin datos válidos
    if (selectedIP !== "all") {
      data = data
        .map((item) => ({
          ...item,
          pv: item.ipValues[selectedIP] || 0,
        }))
        .filter((item) => item.pv > 0); // Solo mostrar puntos con valores positivos
    } else {
      // Para "Todas las IPs", asegurarnos de que al menos una IP tenga valor positivo
      data = data.filter((item) =>
        Object.values(item.ipValues).some((val) => val > 0)
      );
    }

    setFilteredData(data);
  };

  // Componentes de gráficas
  const renderChart = () => {
    const dataToUse =
      filteredData.length > 0 ? filteredData : graphData?.transformedData || [];
    const cutoffIndex = dataToUse.findIndex((item) => item.isPrediction);

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={dataToUse}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value) => {
              if (value >= 1000000000)
                return `${(value / 1000000000).toFixed(1)}B`;
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value;
            }}
          />
          <Tooltip
            formatter={(value, name, props) => [
              `${Math.max(0, Number(value)).toLocaleString()}${
                props.payload.isPrediction ? " (Pred)" : ""
              }`,
              props.payload.isPrediction ? "Predicción" : "Histórico",
            ]}
          />
          {cutoffIndex > 0 && (
            <ReferenceLine
              x={dataToUse[cutoffIndex].name}
              stroke="red"
              label="Inicio Predicción"
            />
          )}
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            strokeWidth={2}
            name="Histórico"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
          {cutoffIndex >= 0 && (
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#ff7300"
              strokeWidth={2}
              name="Predicción"
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          )}
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="flex w-full h-full bg-white rounded-xl shadow mt-4 border relative">
      {/* Botón de cerrar */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Panel de filtros */}
      <div className="flex flex-col w-1/5 border-r p-4 space-y-4">
        <h3 className="font-semibold text-lg">Filtros</h3>

        {/* Filtro de rango de predicción */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rango de Predicción</label>
          <Select onValueChange={setPredictionRange} value={predictionRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar rango" />
            </SelectTrigger>
            <SelectContent>
              {predictionRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector de rango de IPs */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Dirección IP</label>
          <Select onValueChange={setSelectedIP} value={selectedIP}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar IP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las IPs</SelectItem>
              {availableIPs.map((ip) => (
                <SelectItem key={ip} value={ip}>
                  {ip}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          <Button
            className="flex-1 w-full mb-2 cursor-pointer"
            onClick={applyFilters}
          >
            <Filter className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </Button>
          <Button
            variant="outline"
            className="flex-1 w-full cursor-pointer"
            onClick={() => {
              setPredictionRange("all");
              setSelectedIP("all");
              applyFilters(); // Esto aplicará los filtros "limpios"
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Gráfica principal */}
      <div className="flex flex-col w-3/5 p-4">
        <div className="h-10 mb-2 flex items-center justify-center">
          <h2 className="text-xl font-bold">
            {selectedGraph === "prediccion_crecimiento" &&
              "Predicción de Crecimiento"}
            {selectedIP !== "all" && ` (IP: ${selectedIP})`}
          </h2>
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              Cargando datos...
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              Error: {error}
            </div>
          ) : !graphData?.transformedData ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No se recibieron datos de la API
            </div>
          ) : filteredData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No hay datos para los filtros seleccionados
            </div>
          ) : (
            renderChart()
          )}
        </div>
      </div>

      {/* Panel de detalles */}
      <div className="flex flex-col w-1/5 border-l p-4">
        <h3 className="font-semibold text-lg">Detalles</h3>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium">Total predicho</h4>
            <p className="text-2xl font-bold">
              {(filteredData.length > 0
                ? filteredData
                : graphData?.transformedData || []
              )
                .reduce((sum, item) => sum + (item.pv || 0), 0)
                .toLocaleString()}
            </p>
            {selectedIP !== "all" && (
              <p className="text-xs text-muted-foreground">
                Filtrado por IP: {selectedIP}
              </p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium">Período predicho</h4>
            <p>
              {filteredData.length > 0
                ? `${new Date(
                    filteredData[0].timestamp
                  ).toLocaleDateString()} - ${new Date(
                    filteredData[filteredData.length - 1].timestamp
                  ).toLocaleDateString()}`
                : graphData?.transformedData?.length > 0
                ? `${new Date(
                    graphData.transformedData[0].timestamp
                  ).toLocaleDateString()} - ${new Date(
                    graphData.transformedData[
                      graphData.transformedData.length - 1
                    ].timestamp
                  ).toLocaleDateString()}`
                : "N/A"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Número de predicciones</h4>
            <p>
              {filteredData.length > 0
                ? filteredData.length
                : graphData?.transformedData?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
