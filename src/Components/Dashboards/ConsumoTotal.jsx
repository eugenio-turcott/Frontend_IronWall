import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import formatBytes from "@/utils/formatBytes";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import xcien_logo from "@/assets/xcien_logo_n.png";

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
            ? "http://ec2-54-159-226-76.compute-1.amazonaws.com/ports/consumption-internet-db"
            : "http://ec2-54-159-226-76.compute-1.amazonaws.com/ports/consumption-non-internet-db";
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

  const handleDownloadReport = async () => {
    const element = document.getElementById("consumo-report");
    if (!element) return;

    try {
      // Crear un contenedor temporal para el reporte
      const reportContainer = document.createElement("div");
      reportContainer.style.position = "fixed";
      reportContainer.style.left = "-9999px";
      reportContainer.style.width = "800px";
      reportContainer.style.padding = "30px";
      reportContainer.style.backgroundColor = "#ffffff";

      // Obtener el SVG del gráfico como string
      const svgElement = element.querySelector(".recharts-surface");
      const svgString = svgElement ? svgElement.outerHTML : "";

      reportContainer.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${xcien_logo}" alt="Logo XCien" style="height: 75px; margin-right: 25px;" />
        <div>
          <h1 style="font-size: 34px; color: #2d3748; margin: 0; text-align: center;">
            Reporte de Consumo de Datos
          </h1>
          <p style="color: #718096; font-size: 20px; margin: 2px 0 0;">
            Tipo: ${tipoConsumo === "externo" ? "Externo" : "Interno"}
          </p>
        </div>
      </div>

      <div style="height: 375px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px; margin-bottom: 10px;">
        ${svgString}
      </div>

      <div style="font-size: 18px; color: #4a5568; margin-bottom: 20px;">
        <strong>Métricas:</strong><br/>
        ${
          consumoData
            ? `
          Total Entrada: ${formatBytes(consumoData.total_in_gb * 1024)}<br/>
          Total Salida: ${formatBytes(consumoData.total_out_gb * 1024)}<br/>
          Total Combinado: ${formatBytes(consumoData.total_combined_gb * 1024)}
        `
            : "No hay datos disponibles"
        }
      </div>

      <div style="text-align: right; font-size: 15px; color: #a0aec0; margin-top: 50px;">
        Generado el ${new Date().toLocaleDateString()}<br/>
        &copy; ${new Date().getFullYear()} XCien. Todos los derechos reservados.
      </div>
    `;

      document.body.appendChild(reportContainer);

      // Esperar a que las imágenes se carguen
      await new Promise((resolve) => {
        const images = reportContainer.getElementsByTagName("img");
        let loadedCount = 0;

        if (images.length === 0) {
          resolve();
          return;
        }

        const onLoad = () => {
          loadedCount++;
          if (loadedCount === images.length) resolve();
        };

        Array.from(images).forEach((img) => {
          if (img.complete) {
            onLoad();
          } else {
            img.addEventListener("load", onLoad);
            img.addEventListener("error", onLoad);
          }
        });
      });

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
        `Reporte_Consumo_${tipoConsumo}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Ocurrió un error al generar el PDF. Por favor intenta nuevamente."
      );
    } finally {
      const containerToRemove = document.querySelector(
        'div[style*="left: -9999px"]'
      );
      if (containerToRemove && containerToRemove.parentNode) {
        containerToRemove.parentNode.removeChild(containerToRemove);
      }
    }
  };

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
    <div
      id="consumo-report"
      className="flex w-full h-full bg-white rounded-xl shadow mt-4 border relative"
    >
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
        {consumoData && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">Resumen</h4>
            <p className="text-blue-600 font-semibold mt-1">
              Total: {formatBytes(consumoData.total_combined_gb * 1024)}
            </p>
            <p className="text-xs text-blue-500 mt-2">
              {tipoConsumo === "externo"
                ? "Tráfico con Internet"
                : "Tráfico interno"}
            </p>
          </div>
        )}
      </div>

      {/* Gráfica principal */}
      <div className="flex flex-col w-3/5 p-4 items-center">
        <h2 className="text-xl font-bold mb-4 justify-center">
          Consumo Total ({tipoConsumo === "externo" ? "Externo" : "Interno"})
        </h2>
        <div className="w-full h-[375px] flex flex-col items-center justify-center mt-4">
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
                    label={({ name, value }) =>
                      `${name}: ${formatBytes(value * 1024)}`
                    }
                    labelLine={false}
                  >
                    {pieChartData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={pieColors[idx % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatBytes(value * 1024)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full flex justify-center mt-4">
                <div className="flex gap-6">
                  {pieChartData.map((entry, idx) => (
                    <div
                      key={`legend-${idx}`}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="inline-block w-4 h-4 rounded-full"
                        style={{
                          background: pieColors[idx % pieColors.length],
                        }}
                      ></span>
                      <span className="text-sm">{entry.name}</span>
                    </div>
                  ))}
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
        {consumoData ? (
          <div className="space-y-6">
            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <h4 className="text-sm font-medium text-gray-500">Entrada</h4>
              <p className="text-2xl font-bold text-indigo-600">
                {formatBytes(consumoData.total_in_gb * 1024)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {(
                  (consumoData.total_in_gb / consumoData.total_combined_gb) *
                  100
                ).toFixed(1)}
                % del total
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <h4 className="text-sm font-medium text-gray-500">Salida</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatBytes(consumoData.total_out_gb * 1024)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {(
                  (consumoData.total_out_gb / consumoData.total_combined_gb) *
                  100
                ).toFixed(1)}
                % del total
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <h4 className="text-sm font-medium text-gray-500">Combinado</h4>
              <p className="text-2xl font-bold text-orange-600">
                {formatBytes(consumoData.total_combined_gb * 1024)}
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Entrada</span>
                  <span>Salida</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (consumoData.total_in_gb /
                          consumoData.total_combined_gb) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div
                    className="bg-green-500 h-2 rounded-full -mt-2"
                    style={{
                      width: `${
                        (consumoData.total_out_gb /
                          consumoData.total_combined_gb) *
                        100
                      }%`,
                      marginLeft: `${
                        (consumoData.total_in_gb /
                          consumoData.total_combined_gb) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            {consumoData && (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={handleDownloadReport}
              >
                <Download className="h-4 w-4 mr-1" />
                Descargar Reporte
              </Button>
            )}
          </div>
        ) : (
          <div className="text-gray-500 p-4 bg-white rounded-lg shadow-sm border">
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
}
