import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import xcien_logo from "@/assets/xcien_logo_n.png";

// Función para formatear nombres de dispositivos
const formatDeviceName = (name) => {
  if (!name) return name;

  // Reemplazar switch o sw por Switch
  let formatted = name.replace(/^switch_|^sw_/i, "Switch ");

  // Reemplazar guiones bajos por espacios
  formatted = formatted.replace(/_/g, " ");

  // Capitalizar primera letra de cada palabra
  formatted = formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formatted;
};

export default function FallasTop({ selectedGraph, onClose }) {
  const [failuresData, setFailuresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFailures = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://ec2-54-159-226-76.compute-1.amazonaws.com/ports/failures_db"
        );
        if (!response.ok) throw new Error("Error fetching failures data");

        const data = await response.json();
        setFailuresData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFailures();
  }, [selectedGraph]);

  const handleDownloadReport = async () => {
    const element = document.getElementById("fallas-report");
    if (!element) return;

    try {
      // Crear un contenedor temporal para el reporte
      const reportContainer = document.createElement("div");
      reportContainer.style.position = "fixed";
      reportContainer.style.left = "-9999px";
      reportContainer.style.width = "800px";
      reportContainer.style.padding = "30px";
      reportContainer.style.backgroundColor = "#ffffff";

      // Crear contenido del reporte manualmente para evitar estilos problemáticos
      const totalFailures = failuresData.reduce(
        (sum, item) => sum + item.fail_count,
        0
      );
      const topDevice = failuresData.length > 0 ? failuresData[0] : null;

      // Obtener el SVG del gráfico como string
      const svgElement = element.querySelector(".recharts-surface");
      const svgString = svgElement ? svgElement.outerHTML : "";

      reportContainer.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${xcien_logo}" alt="Logo XCien" style="height: 75px; margin-right: 25px;" />
        <div>
          <h1 style="font-size: 34px; color: #2d3748; margin: 0; text-align: center;">
            Reporte de Fallas por Dispositivo
          </h1>
          <p style="color: #718096; font-size: 20px; margin: 2px 0 0;">
            Este reporte muestra las fallas registradas por dispositivo.
          </p>
        </div>
      </div>

      <div style="height: 375px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px; margin-bottom: 10px;">
        ${svgString}
      </div>

      <div style="font-size: 18px; color: #4a5568; margin-bottom: 20px;">
        <strong>Métricas:</strong><br/>
        Total de fallas: ${totalFailures.toLocaleString()}<br/>
        Número de dispositivos: ${failuresData.length}<br/>
        ${
          topDevice
            ? `Dispositivo con más fallas: ${formatDeviceName(
                topDevice.device
              )} (${topDevice.fail_count.toLocaleString()} fallas)`
            : ""
        }
      </div>

      <div style="margin-bottom: 20px; font-size: 18px; color: #2d3748;">
        <strong>Dispositivos con fallas:</strong>
        <ul style="margin-top: 5px; padding-left: 20px;">
          ${failuresData
            .map(
              (item) => `
            <li>${formatDeviceName(
              item.device
            )}: ${item.fail_count.toLocaleString()} fallas</li>
          `
            )
            .join("")}
        </ul>
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
            img.addEventListener("error", onLoad); // Continuar incluso si hay error en imagen
          }
        });
      });

      // Configuración para evitar problemas con colores CSS modernos
      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        logging: true,
        useCORS: true,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => {
          // Ignorar elementos problemáticos si es necesario
          return false;
        },
        onclone: (clonedDoc) => {
          // Limpiar estilos problemáticos en el clon
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            // Eliminar estilos problemáticos
            if (el.style) {
              el.style.color = "";
              el.style.backgroundColor = "";
            }
          });
        },
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
        `Reporte_Fallas_Dispositivos_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Ocurrió un error al generar el PDF. Por favor intenta nuevamente."
      );
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

  if (selectedGraph !== "fallas") return null;

  const totalFailures = failuresData.reduce(
    (sum, item) => sum + item.fail_count,
    0
  );
  const topDevice = failuresData.length > 0 ? failuresData[0] : null;

  return (
    <div
      id="fallas-report"
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

      <div className="flex flex-col w-3/5 p-4">
        <div>
          <h2 className="text-xl font-bold mb-4">
            Top 5 Fallas por Dispositivo
          </h2>

          {loading ? (
            <div className="h-full flex items-center justify-center">
              Cargando datos...
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              Error: {error}
            </div>
          ) : failuresData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No hay datos disponibles
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
              style={{ marginBottom: "10px" }}
            >
              <BarChart
                data={failuresData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  label={{
                    value: "Fallas",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis
                  dataKey="device"
                  type="category"
                  label={{
                    value: "Dispositivo",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tick={{ fontSize: 12 }}
                  width={200}
                />
                <Tooltip
                  formatter={(value) => [value.toLocaleString(), "Fallas"]}
                  labelFormatter={(label) => `Dispositivo: ${label}`}
                />
                <Bar dataKey="fail_count" fill="#ef4444" name="Fallas" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {topDevice && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">
              Dispositivo con más fallas
            </h4>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-semibold">
                {formatDeviceName(topDevice.device)}
              </p>
              <p className="text-red-600 font-bold">
                {topDevice.fail_count.toLocaleString()} fallas
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Panel de detalles */}
      <div className="flex flex-col w-2/5 border-l p-4">
        <h3 className="font-semibold text-lg">Detalles</h3>
        {!loading && !error && failuresData.length > 0 ? (
          <>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Total de fallas
              </h4>
              <p className="text-3xl font-bold text-red-600">
                {totalFailures.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Dispositivos registrados
              </h4>
              <p className="text-xl font-semibold">{failuresData.length}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Lista de dispositivos
              </h4>
              <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                <ul className="divide-y">
                  {failuresData.map((item) => (
                    <li key={item.device} className="py-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {formatDeviceName(item.device)}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {item.fail_count.toLocaleString()} fallas
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {!loading && !error && failuresData.length > 0 && (
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
          </>
        ) : (
          <p className="text-gray-500 mt-2">No hay detalles disponibles</p>
        )}
      </div>
    </div>
  );
}
