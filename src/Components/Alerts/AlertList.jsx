import React, { useState, useEffect, useMemo } from "react";
import AlertComponent from "./AlertComponent";
import { Download } from "lucide-react";

const severities = ["crit", "warn", "UNKNOWN"];

export default function AlertList() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filters, setFilters] = useState({
    tipo: "",
    severidad: "",
    region: "",
  });
  const [updatedMinutesAgo, setUpdatedMinutesAgo] = useState(0);

  // Obtener alertas de la API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:8000/alerts");
        if (!response.ok) {
          throw new Error("Error al obtener las alertas");
        }
        const data = await response.json();
        setAlerts(data);
        setSelectedAlert(data[0] || null);
        setUpdatedMinutesAgo(0); // Actualizar el tiempo de actualización
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Opcional: Configurar actualización periódica
    const intervalId = setInterval(fetchAlerts, 300000); // Actualizar cada minuto

    return () => clearInterval(intervalId);
  }, []);

  // Obtener tipos y regiones únicas de las alertas
  const tipos = useMemo(
    () => [...new Set(alerts.map((a) => a.device?.type || "Alerta"))],
    [alerts]
  );
  const regiones = useMemo(
    () => [...new Set(alerts.map((a) => a.device?.location))],
    [alerts]
  );

  // Filtros funcionales
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const severityMatch =
        !filters.severidad ||
        (filters.severidad === "UNKNOWN"
          ? a.severity === null ||
            a.severity === undefined ||
            a.severity === "UNKNOWN"
          : a.severity === filters.severidad);

      return (
        (!filters.tipo || (a.device?.type || "Alerta") === filters.tipo) &&
        severityMatch &&
        (!filters.region || a.device?.location === filters.region)
      );
    });
  }, [alerts, filters]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#f7f8fa]">
        <div className="text-lg">Cargando alertas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#f7f8fa]">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#f7f8fa]">
        <div className="text-lg">No hay alertas disponibles</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center bg-[#f7f8fa] min-h-0">
      <div className="w-full h-full max-w-6xl bg-white rounded-xl shadow flex-1 flex flex-col gap-4">
        <div className="flex flex-row gap-8 h-full min-h-0 p-8">
          {/* Columna izquierda: lista de alertas */}
          <div className="flex-1 min-w-[260px] max-w-[320px] flex flex-col">
            <h1 className="text-2xl font-bold mb-2">Alertas</h1>
            <div className="text-xs text-gray-400 mb-2">
              Updated {updatedMinutesAgo} minutes ago
            </div>
            <div className="overflow-y-scroll flex-1 flex flex-col gap-3 pr-1 min-h-0">
              {filteredAlerts.map((item) => (
                <div
                  key={item.alert_table_id}
                  className={`cursor-pointer ${
                    selectedAlert?.alert_table_id === item.alert_table_id
                      ? "border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/50 to-white"
                      : "border-l-4 border-transparent hover:bg-gray-50/50"
                  }`}
                  onClick={() => setSelectedAlert(item)}
                >
                  <AlertComponent
                    type={item.type}
                    severity={item.severity}
                    status={item.status}
                    recovered={item.recovered}
                    device={item.device}
                    last_ok={item.last_ok}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Columna central: filtros */}
          <div className="flex flex-col min-w-[220px] max-w-[260px] bg-[#f5f6fa] rounded-lg p-4 border mx-2 self-start">
            <h2 className="text-xl font-bold mb-2">Filtros</h2>
            <hr className="mb-3" />
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Tipo de alerta</span>
              {tipos.map((t) => (
                <button
                  key={t}
                  className={`rounded-lg px-3 py-1 text-sm font-medium text-left cursor-pointer ${
                    filters.tipo === t
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      tipo: f.tipo === t ? "" : t,
                    }))
                  }
                >
                  {t}
                </button>
              ))}
              <span className="font-medium text-sm mt-2">Severidad</span>
              {severities.map((s) => (
                <button
                  key={s}
                  className={`rounded-lg px-3 py-1 text-sm font-medium text-left cursor-pointer ${
                    filters.severidad === s
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      severidad: f.severidad === s ? "" : s,
                    }))
                  }
                >
                  {s}
                </button>
              ))}
              <span className="font-medium text-sm mt-2">Región</span>
              {regiones.map((r) => (
                <button
                  key={r}
                  className={`rounded-lg px-3 py-1 text-sm font-medium text-left cursor-pointer ${
                    filters.region === r
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      region: f.region === r ? "" : r,
                    }))
                  }
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="w-full max-w-6xl flex justify-end pt-8 pb-2 pr-8">
              <button className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium shadow-sm hover:shadow-md cursor-pointer">
                <Download className="w-4 h-4" /> Descargar Reporte
              </button>
            </div>
          </div>
          {/* Columna derecha: detalles de alerta seleccionada */}
          {selectedAlert && (
            <div className="min-w-[320px] max-w-[400px] bg-[#f5f6fa] rounded-lg p-6 border flex flex-col self-start">
              <div className="flex gap-4 mb-2 justify-between">
                <span className="font-bold text-base text-center">
                  ID del incidente: {selectedAlert.alert_table_id}
                </span>
                <span className="font-bold text-base text-center">
                  Nodo Afectado: {selectedAlert.device?.hostname}
                </span>
              </div>

              <div className="font-semibold mb-1">Estado</div>
              <div className="bg-white rounded-lg p-3 mb-3 text-sm text-gray-700 shadow-inner">
                {selectedAlert.status === "OK" ? "Resuelto" : "Activo"} - Tiempo
                de recuperación:{" "}
                {selectedAlert.recovered === "<i>Never</i>"
                  ? "Nunca"
                  : selectedAlert.recovered || "N/A"}
              </div>

              <div className="font-semibold mb-1">Detalles del dispositivo</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-blue-100 rounded-lg px-3 py-2 flex flex-col items-center">
                  <span className="text-xs text-gray-500">Tipo</span>
                  <span className="font-bold text-blue-900 text-lg">
                    {selectedAlert.device?.type || "-"}
                  </span>
                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-2 flex flex-col items-center">
                  <span className="text-xs text-gray-500">Sistema</span>
                  <span className="font-bold text-blue-900 text-lg">
                    {selectedAlert.device?.os || "-"}
                  </span>
                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-2 flex flex-col items-center">
                  <span className="text-xs text-gray-500">Fabricante</span>
                  <span className="font-bold text-blue-900 text-lg">
                    {selectedAlert.device?.vendor || "-"}
                  </span>
                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-2 flex flex-col items-center">
                  <span className="text-xs text-gray-500">Último OK</span>
                  <span className="font-bold text-blue-900 text-lg text-center">
                    {new Date(selectedAlert.last_ok * 1000).toLocaleString() ||
                      "-"}
                  </span>
                </div>
              </div>

              <div className="font-semibold mb-1">Ubicación</div>
              <div className="bg-white rounded-lg p-3 mb-4 text-sm text-gray-700 shadow-inner">
                {selectedAlert.device?.location || "Ubicación no disponible"}
                {selectedAlert.device?.location_lat &&
                  selectedAlert.device?.location_lon && (
                    <div className="mt-1 text-xs">
                      Coordenadas: {selectedAlert.device.location_lat},{" "}
                      {selectedAlert.device.location_lon}
                    </div>
                  )}
              </div>

              <button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 shadow cursor-pointer">
                Completar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
