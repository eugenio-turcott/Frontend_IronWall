import React, { useState, useEffect } from "react";
import { X, Calendar, Filter, Download } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { DateRange } from "react-date-range";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import xcien_logo from "@/assets/xcien_logo_n.png";
import formatBytes from "@/utils/formatBytes";
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
} from "@/Components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTickY = ({ x, y, payload }) => {
  return (
    <text x={x} y={y} fill="#666666" textAnchor="end">
      {formatBytes(payload.value)}
    </text>
  );
};

const ipMap = {
  "172.30.246.": "core-antigua_estanzuela",
  "172.19.255": "core-acherbis",
  "172.31.14": "core-juarez",
  "10.61.5": "core-cuautitlan-cdmx",
  "172.31.11": "core-vasconcelos",
  "172.19.25": "core-acherbis",
  "172.19.3": "core-acherbis",
  "172.19.6": "core-ramazini",
  "172.21.25": "core-border_twinmex-ii-reynosa",
  "172.31.243": "core-monterrey_ii",
  "172.31.11": "core-pda",
  "172.31.5": "core-kristales",
  "172.28.": "core-coyotepec",
  "172.22.1": "core-centinela",
  "172.24.1": "core-colorado",
  "172.31.1.": "core-estanzuela",
  "10.2.0.": "core-floresta",
  "10.1.": "core-grupo_sol",
  "172.31.1": "core-loma_larga",
  "172.31.12": "core-lomita",
  "10.20.1": "core-morelos",
  "172.31.1": "core-nimiw",
  "172.31.17": "core_172.31.175.1",
  "172.31.16": "core-hualahuises",
  "172.31.21": "core-pesqueria-lee",
  "10.2.0": "switch_crs326_grupo_sol",
  "172.31.7": "core-capitolio",
  "172.31.7": "core-rojas",
  "172.24.1": "core-bandera",
  "172.24.": "core-border_queretaro_san_pablo",
  "172.24.1": "core_ccr1036_tec100",
  "172.31.12": "core-sta_catarina",
  "172.31.6": "core-repetec",
  "172.31.33": "core-rb_hidalgo",
  "172.31.3": "core-pueblo_serena",
  "172.30.31.": "rep-guadalupe_ii_silva",
  "172.255.255": "rep-guadalupe_ii_silva",
  "172.31.8": "core-garcia",
  "172.21.25": "core-rio_bravo",
  "172.21.28": "core-172.21.28.10",
  "10.20.": "core-10.20.0.1",
  "172.31.": "core-cadereyta",
  "172.31.": "core-172.31.8.1",
  "172.31.241": "core_switch_crs317_purisima",
  "172.31.11": "core-sendero",
  "172.30.220.": "core-santa_rosa-b",
  "172.31.22": "core-santa_rosa-b",
  "172.30.27.": "core-pabellon_m",
  "172.31.8": "core-fo_ccr1072_guadalupe",
  "172.31.4": "core-pueblo_nvo",
  "172.30.89.": "core_switch_mitras_ccr2004",
  "172.31.1": "core-santa_isabel",
};

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
        const response = await fetch(
          "http://ec2-54-159-226-76.compute-1.amazonaws.com/graphs_db"
        );
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
    let ips = apiData.meta.legend || [];

    // Función para mapear las IPs según ipMap
    const mapIPs = (ipList) => {
      return ipList.map((ip) => {
        if (!ip) return ip;
        const matchedKey = Object.keys(ipMap).find((key) => ip.startsWith(key));
        return matchedKey ? ipMap[matchedKey] : ip;
      });
    };

    // Mapear las IPs (primera mitad del array)
    const mappedIPs = [
      ...new Set(
        mapIPs(
          ips
            .slice(0, Math.ceil(ips.length / 2))
            .filter((ip) => ip && ip.trim() !== "")
        )
      ),
    ];
    setAvailableIPs(mappedIPs);

    return apiData.data
      .map((item, index) => {
        const currentDate = new Date(startDate.getTime() + index * step * 1000);
        const monthName = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();

        const ipValues = {};
        const negativeIpValues = {};

        // Procesar valores positivos con IPs mapeadas
        mappedIPs.forEach((ip, i) => {
          const val = item[i];
          ipValues[ip] = !isNaN(val) ? val : 0;
        });

        // Procesar valores negativos (segunda mitad del array original)
        mappedIPs.forEach((ip, i) => {
          const val = item[i + Math.ceil(ips.length / 2)];
          negativeIpValues[ip] = !isNaN(val) ? val : 0;
        });

        const totalValue = item
          .slice(0, Math.ceil(ips.length / 2))
          .reduce((sum, val) => {
            return !isNaN(val) ? sum + val : sum;
          }, 0);

        const totalNegativeValue = item
          .slice(Math.ceil(ips.length / 2))
          .reduce((sum, val) => {
            return !isNaN(val) ? sum + val : sum;
          }, 0);

        return {
          month: `${monthName} ${year}`,
          tráfico: totalValue,
          tráficoNegativo: totalNegativeValue,
          timestamp: currentDate.getTime(),
          year: year.toString(),
          date: currentDate,
          ipValues,
          negativeIpValues,
          ips: mappedIPs,
        };
      })
      .filter((item) => item.tráfico > 0 || item.tráficoNegativo > 0)
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
          ...item,
          tráfico: item.ipValues[selectedIP] || 0,
          tráficoNegativo: item.negativeIpValues[selectedIP] || 0,
        }))
        .filter((item) => item.tráfico > 0 || item.tráficoNegativo > 0);
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
          <ResponsiveContainer id="historico-crecimiento-grafica">
            <AreaChart
              data={dataToUse}
              margin={{ top: 20, right: 10, left: 30, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGrowthF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorNegativeGrowthF"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tick={<CustomTickY />} />
              <Tooltip
                formatter={(value, name, props) => [
                  formatBytes(value),
                  props.dataKey === "tráfico"
                    ? "Tráfico Positivo"
                    : "Tráfico Negativo",
                ]}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="tráfico"
                name="Tráfico Positivo"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorGrowthF)"
              />
              <Area
                type="monotone"
                dataKey="tráficoNegativo"
                name="Tráfico Negativo"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorNegativeGrowthF)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      // Agrega los otros casos para las demás gráficas
      default:
        return <div>Gráfica no implementada</div>;
    }
  };

  const buildGraphDescription = () => {
    const dataToUse =
      filteredData.length > 0 ? filteredData : graphData?.transformedData || [];

    if (dataToUse.length === 0)
      return "No se encontraron datos para describir.";

    const firstValue = dataToUse[0].tráfico;
    const lastValue = dataToUse[dataToUse.length - 1].tráfico;
    const firstNegativeValue = dataToUse[0].tráficoNegativo;
    const lastNegativeValue = dataToUse[dataToUse.length - 1].tráficoNegativo;

    const delta = lastValue - firstValue;
    const negativeDelta = lastNegativeValue - firstNegativeValue;

    const trend =
      delta > 0
        ? "un incremento"
        : delta < 0
        ? "una disminución"
        : "una estabilidad";

    const negativeTrend =
      negativeDelta > 0
        ? "un incremento"
        : negativeDelta < 0
        ? "una disminución"
        : "una estabilidad";

    return `Durante el periodo analizado, se observa ${trend} en el total de datos positivos, comenzando con ${formatBytes(
      firstValue
    )} y terminando con ${formatBytes(
      lastValue
    )}. Para los datos negativos, se observa ${negativeTrend}, comenzando con ${formatBytes(
      firstNegativeValue
    )} y terminando con ${formatBytes(lastNegativeValue)}.`;
  };

  const handleDownloadReport = async () => {
    const element = document.getElementById("historico-crecimiento-report");
    if (!element) return;

    try {
      // Crear un contenedor temporal para el reporte
      const reportContainer = document.createElement("div");
      reportContainer.style.position = "fixed";
      reportContainer.style.left = "-9999px";
      reportContainer.style.width = "800px";
      reportContainer.style.padding = "30px";
      reportContainer.style.backgroundColor = "#ffffff";

      // Obtener el elemento principal por su ID
      const mainContainer = document.getElementById(
        "historico-crecimiento-grafica"
      );
      if (!mainContainer) return;

      // Clonar todo el contenido del contenedor principal
      const clonedContainer = mainContainer.cloneNode(true);

      // Ocultar elementos que no queremos en el reporte (como botones de cerrar)
      const closeButtons = clonedContainer.querySelectorAll("button");
      closeButtons.forEach((btn) => (btn.style.display = "none"));

      const graphDescription = buildGraphDescription();

      reportContainer.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <img src="${xcien_logo}" alt="Logo XCien" style="height: 75px; margin-right: 25px;" />
          <div>
            <h1 style="font-size: 34px; color: #2d3748; margin: 0; text-align: center;">
              Histórico de Crecimiento
            </h1>
            <p style="color: #718096; font-size: 20px; margin: 2px 0 0;">
              Este gráfico muestra el crecimiento histórico de los datos
              del nodo seleccionado en el rango de fechas especificado.
            </p>
          </div>
        </div>

        <div style="margin-bottom: 15px; font-size: 18px; color: #4a5568;">
          <strong>Filtros aplicados:</strong><br/>
          Año: ${selectedYear === "all" ? "Todos" : selectedYear}<br/>
          Rango de fechas: ${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}<br/>
          Nodo: ${selectedIP === "all" ? "Todos los nodos" : selectedIP}
        </div>

        <div style="height: 375px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px; margin-bottom: 10px;">
          ${clonedContainer.innerHTML}
        </div>

        <div style="font-size: 18px; color: #4a5568; margin-bottom: 20px;">
          <strong>Métricas:</strong><br/>
          Total de datos: ${formatBytes(
            (filteredData.length > 0
              ? filteredData
              : graphData?.transformedData || []
            ).reduce((sum, item) => sum + (item.tráfico || 0), 0)
          )}<br/>
          Número de registros: ${
            filteredData.length > 0
              ? filteredData.length
              : graphData?.transformedData?.length || 0
          }
        </div>

        <div style="margin-bottom: 20px; font-size: 18px; color: #2d3748;">
          <strong>Descripción:</strong>
          <p style="margin-top: 5px;">
            ${graphDescription}
          </p>
        </div>

        <div style="text-align: right; font-size: 15px; color: #a0aec0; margin-top: 50px;">
          Generado el ${new Date().toLocaleDateString()}<br/>
          &copy; ${new Date().getFullYear()} XCien. Todos los derechos reservados.
        </div>
      `;

      document.body.appendChild(reportContainer);

      // Esperar un breve momento para que los gráficos se rendericen
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        logging: true,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        format: "a4",
        unit: "mm",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Reporte_Historico_Crecimiento_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Limpiar de manera segura
      const containerToRemove = document.querySelector(
        'div[style*="left: -9999px"]'
      );
      if (containerToRemove && containerToRemove.parentNode) {
        containerToRemove.parentNode.removeChild(containerToRemove);
      }
    }
  };

  return (
    <div
      id="historico-crecimiento-report"
      className="flex w-full h-full bg-white shadow mt-4 relative"
    >
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

        {/* Selector de rango de Nodos */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nodo</label>
          <Select onValueChange={setSelectedIP} value={selectedIP}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar Nodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Nodos disponibles</SelectLabel>
                <SelectItem value="all">Todos los Nodos</SelectItem>
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
      <div className="flex flex-col w-full p-4">
        <div className="h-10 mb-2 flex items-center justify-center">
          <h2 className="text-xl font-bold">
            {selectedGraph === "historico_crecimiento" &&
              "Histórico de Crecimiento"}
            {selectedIP !== "all" && ` (Nodo: ${selectedIP})`}
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
                {formatBytes(
                  (filteredData.length > 0
                    ? filteredData
                    : graphData?.transformedData || []
                  ).reduce((sum, item) => sum + (item.tráfico || 0), 0)
                )}
              </p>
              {selectedIP !== "all" && (
                <p className="text-xs text-muted-foreground">
                  Filtrado por Nodo: {selectedIP}
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
            {!loading &&
              !error &&
              (filteredData.length > 0 ||
                graphData?.transformedData?.length > 0) &&
              sessionStorage.getItem("userType") === "administrador" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  onClick={handleDownloadReport}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar Reporte
                </Button>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
