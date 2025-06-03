import React, { useState, useEffect } from "react";
import { X, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Estilo principal
import "react-date-range/dist/theme/default.css"; // Tema por defecto
import {
  Select,
  SelectGroup,
  SelectLabel,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ipMap = {
  "172.30.246.": "172.30.246.254",
  "172.19.255": "172.19.255.23",
  "172.31.14": "172.31.141.1",
  "10.61.5": "10.61.50.1",
  "172.31.11": "172.31.113.1",
  "172.19.25": "172.19.255.6",
  "172.19.3": "172.19.30.1",
  "172.19.6": "172.19.65.1",
  "172.21.25": "172.21.255.6",
  "172.31.243": "172.31.243.10",
  "172.31.5": "172.31.53.1",
  "172.28.": "172.28.0.1",
  "172.22.1": "172.22.16.1",
  "172.24.1": "172.24.13.1",
  "172.31.1.": "172.31.1.100",
  "10.2.0.": "10.2.0.254",
  "10.1.": "10.1.5.1",
  "172.31.10": "172.31.10.1",
  "172.31.12": "172.31.120.1",
  "172.31.17": "172.31.175.1",
  "172.31.16": "172.31.160.1",
  "172.31.21": "172.31.218.1",
  "172.31.7": "172.31.72.1",
  "172.24.": "172.24.0.1",
  "172.31.33": "172.31.33.52",
  "172.31.3": "172.31.35.1",
  "172.30.31.": "172.30.31.254",
  "172.255.255": "172.255.255.99",
  "172.31.8": "172.31.86.1",
  "172.21.28": "172.21.28.10",
  "10.20.": "10.20.0.1",
  "172.31.": "172.31.2.1",
  "172.31.241": "172.31.241.10",
  "172.30.220.": "172.30.220.254",
  "172.31.22": "172.31.220.1",
  "172.30.27.": "172.30.27.254",
  "172.31.4": "172.31.45.1",
  "172.30.89.": "172.30.89.246",
  "172.31.1": "172.31.1.68",
  "10.40.10": "10.40.10.1",
  "10.20.1": "10.20.11.1",
  "172.31.127": "172.31.127.1",
};

function mapIncompleteIPsToFull(incompleteIPs) {
  return incompleteIPs
    .map(ip => ip.trim())
    .filter(ip => ip !== "")
    .map(ip => {
      const match = Object.keys(ipMap).find(prefix => ip.startsWith(prefix));
      if (match) return ipMap[match];
      console.warn(`NO_MATCH:${ip}`);
      return `NO_MATCH:${ip}`;
    });
}


export default function HistoricoCrecimiento({ selectedGraph, onClose }) {
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIP, setSelectedIP] = useState("all");
  const [availableIPs, setAvailableIPs] = useState([]);

  // En HistoricoCrecimiento.jsx, modifica el useEffect que carga los datos:
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/graphs");
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();

        const transformedData = transformApiData(data);
        setGraphData({ ...data, transformedData });
        setFilteredData(transformedData); // <-- Aquí establecemos los datos filtrados iniciales

        if (transformedData.length > 0) {
          setDateRange([
            {
              startDate: new Date(transformedData[0].timestamp),
              endDate: new Date(
                transformedData[transformedData.length - 1].timestamp
              ),
              key: "selection",
            },
          ]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedGraph) fetchGraphData();
  }, [selectedGraph]);

  const transformApiData = (apiData) => {
    if (!apiData || !apiData.data) return [];

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

    const startDate = new Date(apiData.meta.start * 1000);
    const step = apiData.meta.step;
    const old_ips = apiData.meta.legend || [];

    let ips = mapIncompleteIPsToFull(old_ips)

    const deviceIdPromises = ips
    .filter(ip => !ip.startsWith("NO_MATCH:"))
    .map(async ip => {
      try {
        const res = await fetch(`/api/devices?ip=${encodeURIComponent(ip)}`);
        const data = await res.json();
        return { ip, deviceId: data.deviceId };
      } catch {
        return { ip, deviceId: null, error: true };
      }
    });
    const deviceIds = await Promise.all(deviceIdPromises);


    // Guardar las IPs disponibles
    setAvailableIPs(ips.filter((ip) => ip && ip.trim() !== ""));

    return apiData.data
      .map((item, index) => {
        const currentDate = new Date(startDate.getTime() + index * step * 1000);
        const monthName = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();

        const ipValues = {};
        ips.forEach((ip, i) => {
          const val = item[i];
          ipValues[ip] = !isNaN(val) ? val : 0;
        });

        const totalValue = item.reduce((sum, val) => {
          return !isNaN(val) ? sum + val : sum;
        }, 0);

        return {
          month: `${monthName} ${year}`,
          desktop: totalValue,
          timestamp: currentDate.getTime(),
          year: year.toString(),
          date: currentDate,
          ipValues,
          ips,
        };
      })
      .filter((item) => item.desktop > 0)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const applyFilters = () => {
    if (!graphData?.transformedData) return;

    let data = [...graphData.transformedData];

    // Filtrar por año
    if (selectedYear !== "all") {
      data = data.filter((item) => item.year === selectedYear);
    }

    // Filtrar por rango de fechas
    if (dateRange[0].startDate && dateRange[0].endDate) {
      const startTime = dateRange[0].startDate.getTime();
      const endTime = dateRange[0].endDate.getTime();

      data = data.filter((item) => {
        return item.timestamp >= startTime && item.timestamp <= endTime;
      });
    }

    // Filtrar por IP
    if (selectedIP !== "all") {
      data = data
        .map((item) => ({
          ...item, // Mantenemos todas las propiedades
          desktop: item.ipValues[selectedIP] || 0, // Sobreescribimos desktop con el valor de la IP seleccionada
        }))
        .filter((item) => item.desktop > 0); // Filtramos puntos con valor 0
    }

    setFilteredData(data);
  };

  // Componentes de gráficas
  const renderChart = () => {
    if (!selectedGraph) return null;

    const dataToUse =
      filteredData.length > 0 ? filteredData : graphData?.transformedData || [];

    switch (selectedGraph) {
      case "historico_crecimiento":
        return (
          <ResponsiveContainer>
            <AreaChart
              data={dataToUse}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGrowthF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => {
                  // Formatear números grandes a formato más legible (1.2B, 1.2M, 1.2K)
                  if (value >= 1000000000) {
                    return `${(value / 1000000000).toFixed(1)}B`;
                  }
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  }
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`;
                  }
                  return value;
                }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="desktop"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorGrowthF)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      // Agrega los otros casos para las demás gráficas
      default:
        return <div>Gráfica no implementada</div>;
    }
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

        {/* Selector de rango de fechas */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rango de fechas</label>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange[0].startDate.toLocaleDateString()} -{" "}
            {dateRange[0].endDate.toLocaleDateString()}
          </Button>
          {showDatePicker && (
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                setDateRange([item.selection]);
                setShowDatePicker(false);
              }}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              minDate={
                graphData?.transformedData?.length > 0
                  ? new Date(graphData.transformedData[0].timestamp)
                  : new Date(2021, 5, 1)
              }
              maxDate={
                graphData?.transformedData?.length > 0
                  ? new Date(
                      graphData.transformedData[
                        graphData.transformedData.length - 1
                      ].timestamp
                    )
                  : new Date(2025, 4, 1)
              }
              className="absolute z-10 bg-white border rounded-md shadow-lg"
            />
          )}
        </div>

        {/* Selector de rango de IPs */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Dirección IP</label>
          <Select onValueChange={setSelectedIP} value={selectedIP}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar IP" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>IPs disponibles</SelectLabel>
                <SelectItem value="all">Todas las IPs</SelectItem>
                {availableIPs.map((ip, i) => (
                  <SelectItem key={`${ip}+${i}`} value={ip}>
                    {ip}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Selector de año */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Año</label>
          <Select onValueChange={setSelectedYear} value={selectedYear}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los años</SelectItem>
              {Array.from(
                new Set(
                  graphData?.transformedData?.map((item) => item.year) || []
                )
              )
                .sort((a, b) => b - a)
                .map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
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
              setSelectedYear("all");
              setDateRange([
                {
                  startDate: new Date(
                    graphData?.transformedData?.[0]?.timestamp || new Date()
                  ),
                  endDate: new Date(
                    graphData?.transformedData?.[
                      graphData?.transformedData?.length - 1
                    ]?.timestamp || new Date()
                  ),
                  key: "selection",
                },
              ]);
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
            {selectedGraph === "historico_crecimiento" &&
              "Histórico de Crecimiento"}
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
          ) : graphData?.transformedData?.length === 0 ||
            filteredData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No hay datos para el rango seleccionado
            </div>
          ) : (
            renderChart()
          )}
        </div>
      </div>
      <div className="flex flex-col w-1/5 border-l p-4">
        <h3 className="font-semibold text-lg">Detalles</h3>
        {selectedGraph === "historico_crecimiento" && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium">Total de datos</h4>
              <p className="text-2xl font-bold">
                {(filteredData.length > 0
                  ? filteredData
                  : graphData?.transformedData || []
                )
                  .reduce((sum, item) => sum + (item.desktop || 0), 0)
                  .toLocaleString()}
              </p>
              {selectedIP !== "all" && (
                <p className="text-xs text-muted-foreground">
                  Filtrado por IP: {selectedIP}
                </p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium">Período</h4>
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
              <h4 className="text-sm font-medium">Número de registros</h4>
              <p>
                {filteredData.length > 0
                  ? filteredData.length
                  : graphData?.transformedData?.length || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
