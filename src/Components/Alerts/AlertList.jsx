import React, { useState, useEffect, useMemo } from "react";
import AlertComponent from "./AlertComponent";
import {
  Download,
  CircleAlert,
  ListFilter,
  FileWarning,
  MessageCircleWarning,
  Siren,
  MapPinned,
  CircleSlash,
  ChartNetwork,
  ReceiptText,
  LocateFixed,
} from "lucide-react";

const severities = [
  { value: "crit", label: "CRITICAL" },
  { value: "warn", label: "WARNING" },
  { value: "DESCONOCIDO", label: "DESCONOCIDO" },
];

export default function AlertList() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filters, setFilters] = useState({
    tipo: "",
    severidad: "",
    region: "",
    estado: "",
  });
  const [lastUpdated, setLastUpdated] = useState(null); // Cambiamos el estado para guardar el timestamp
  const [updatedText, setUpdatedText] = useState("Justo ahora"); // Estado para el texto formateado
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [alertToComplete, setAlertToComplete] = useState(null);

  // Obtener alertas de la API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          "http://ec2-44-202-12-128.compute-1.amazonaws.com/alerts_db"
        );
        if (!response.ok) {
          throw new Error("Error al obtener las alertas");
        }
        const data = await response.json();
        setAlerts(data);
        setSelectedAlert(data[0] || null);
        setLastUpdated(new Date()); // Actualizar el tiempo de actualización
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Opcional: Configurar actualización periódica
    const intervalId = setInterval(fetchAlerts, 300000); // Actualizar cada 5 minutos

    // Configurar intervalo para actualizar el texto cada segundo
    const updateInterval = setInterval(() => {
      if (lastUpdated) {
        const seconds = Math.floor((new Date() - lastUpdated) / 1000);

        if (seconds < 60) {
          setUpdatedText(
            `Actualizado hace ${seconds} segundo${seconds !== 1 ? "s" : ""}`
          );
        } else {
          const minutes = Math.floor(seconds / 60);
          setUpdatedText(
            `Actualizado hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`
          );
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(updateInterval);
    };
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
    const userType = sessionStorage.getItem("userType");

    // Primero aplicamos el filtro por tipo de usuario
    const userFilteredAlerts = alerts.filter(
      (a) =>
        userType === "administrador" ||
        (a.completado !== "SI" && a.status !== "OK") // <-- Nueva condición
    );

    // Luego aplicamos los demás filtros
    return userFilteredAlerts.filter((a) => {
      const severityMatch =
        !filters.severidad ||
        (filters.severidad === "DESCONOCIDO"
          ? a.severity === null ||
            a.severity === undefined ||
            a.severity === "DESCONOCIDO"
          : a.severity === filters.severidad);

      return (
        (!filters.tipo || (a.device?.type || "Alerta") === filters.tipo) &&
        severityMatch &&
        (!filters.region || a.device?.location === filters.region) &&
        (!filters.estado ||
          (filters.estado === "Resuelto"
            ? a.status === "OK"
            : a.status !== "OK"))
      );
    });
  }, [alerts, filters]);

  useEffect(() => {
    // Este efecto asegurará que el selectedAlert siempre esté actualizado
    if (selectedAlert) {
      const updatedAlert = alerts.find(
        (a) => a.alert_table_id === selectedAlert.alert_table_id
      );
      if (updatedAlert) {
        setSelectedAlert(updatedAlert);
      } else {
        setSelectedAlert(null);
      }
    }
  }, [alerts, selectedAlert?.alert_table_id]);

  useEffect(() => {
    if (alerts.length > 0) {
      const noCompletedAlerts = alerts.filter(
        (alert) => alert.completado === "NO"
      ).length;
      sessionStorage.setItem("numberAlerts", noCompletedAlerts.toString());
    }
  }, [alerts]);

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

  // Añadir esta función dentro del componente AlertList
  const handleCompleteAlert = async (alertId) => {
    const userType = sessionStorage.getItem("userType");

    if (userType === "usuario") {
      setAlertToComplete(alertId);
      setShowConfirmPopup(true);
      return;
    }

    try {
      const response = await fetch(
        `http://ec2-44-202-12-128.compute-1.amazonaws.com/alerts_db/${alertId}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to complete alert");

      // Actualizar el estado local
      setAlerts(
        alerts.map((alert) =>
          alert.alert_table_id === alertId
            ? { ...alert, completado: "SI" }
            : alert
        )
      );

      // Si es usuario, quitamos la alerta de la lista inmediatamente
      const userType = sessionStorage.getItem("userType");
      if (userType === "usuario") {
        setAlerts(alerts.filter((alert) => alert.alert_table_id !== alertId));
        setSelectedAlert(null);
      }

      setSelectedAlert(null);
      setShowConfirmPopup(false);
    } catch (error) {
      console.error("Error completing alert:", error);
    }
  };

  const confirmCompleteAlert = async () => {
    try {
      const response = await fetch(
        `http://ec2-44-202-12-128.compute-1.amazonaws.com/alerts_db/${alertToComplete}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to complete alert");

      setAlerts(
        alerts.filter((alert) => alert.alert_table_id !== alertToComplete)
      );
      setSelectedAlert(null);
      setShowConfirmPopup(false);
    } catch (error) {
      console.error("Error completing alert:", error);
    }
  };

  // Añadir esta función dentro del componente AlertList
  const handleNoCompleteAlert = async (alertId) => {
    try {
      const response = await fetch(
        `http://ec2-44-202-12-128.compute-1.amazonaws.com/alerts_db/${alertId}/no_complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to no complete alert");

      // Actualizar el estado local
      setAlerts(
        alerts.map((alert) =>
          alert.alert_table_id === alertId
            ? { ...alert, completado: "NO" }
            : alert
        )
      );
    } catch (error) {
      console.error("Error completing alert:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-[#f7f8fa] min-h-0 relative">
      <div className="w-full h-full max-w-6xl bg-white rounded-xl shadow flex-1 flex flex-col gap-4">
        <div className="flex flex-row gap-8 h-full min-h-0 p-8">
          {/* Columna izquierda: lista de alertas */}
          <div className="flex-1 min-w-[260px] max-w-[320px] flex flex-col">
            <div className="flex items-center">
              <CircleAlert className="w-8 h-8" />
              <h1 className="text-2xl font-bold mb-2 ml-2">Alertas</h1>
            </div>
            <div className="text-xs text-gray-400 mb-2">{updatedText}</div>
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
                    completado={item.completado}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Columna central: filtros */}
          <div className="flex flex-col min-w-[220px] max-w-[260px] bg-[#f5f6fa] rounded-lg p-4 border mx-2 self-start h-full">
            <div className="flex items-center">
              <ListFilter className="w-8 h-8" />
              <h2 className="text-xl font-bold mb-2 ml-2">Filtros</h2>
            </div>
            <hr className="mb-3" />
            <div className="flex flex-col gap-2">
              <div>
                <FileWarning className="w-4 h-4 inline-block mr-1" />
                <span className="font-medium text-sm">Tipo de alerta</span>
              </div>
              <div className="overflow-y-auto flex-1 flex flex-col gap-3 pr-1 max-h-20">
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
              </div>
              <div>
                <MessageCircleWarning className="w-4 h-4 inline-block mr-1" />
                <span className="font-medium text-sm mt-2">Severidad</span>
              </div>
              {severities.map((s) => (
                <button
                  key={s.value}
                  className={`rounded-lg px-3 py-1 text-sm font-medium text-left cursor-pointer ${
                    filters.severidad === s.value
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      severidad: f.severidad === s.value ? "" : s.value,
                    }))
                  }
                >
                  {s.label}
                </button>
              ))}
              <div>
                <Siren className="w-4 h-4 inline-block mr-1" />
                <span className="font-medium text-sm mt-2">Estado</span>
              </div>
              {["Activo", "Resuelto"].map((e) => (
                <button
                  key={e}
                  className={`rounded-lg px-3 py-1 text-sm font-medium text-left cursor-pointer ${
                    filters.estado === e
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      estado: f.estado === e ? "" : e,
                    }))
                  }
                >
                  {e}
                </button>
              ))}
              <div>
                <MapPinned className="w-4 h-4 inline-block mr-1" />
                <span className="font-medium text-sm mt-2">Región</span>
              </div>
              <div className="overflow-y-auto flex-1 flex flex-col gap-3 pr-1 max-h-20">
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
            </div>
            {sessionStorage.getItem("userType") === "administrador" && (
              <div className="w-full max-w-6xl flex justify-end pt-8 pb-2 pr-8">
                <button className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium shadow-sm hover:shadow-md cursor-pointer">
                  <Download className="w-4 h-4" /> Descargar Reporte
                </button>
              </div>
            )}
          </div>
          {/* Columna derecha: detalles de alerta seleccionada */}
          {selectedAlert && (
            <div className="min-w-[320px] max-w-[400px] bg-[#f5f6fa] rounded-lg p-6 border flex flex-col self-start">
              <div className="flex gap-4 mb-2 justify-between">
                <div className="flex items-center">
                  <CircleSlash className="w-8 h-8 mr-1" />
                  <span className="font-bold text-base text-center">
                    ID del incidente: {selectedAlert.alert_table_id}
                  </span>
                </div>
                <div className="flex items-center">
                  <ChartNetwork className="w-8 h-8 -mr-2" />
                  <span className="font-bold text-base text-center">
                    Nodo Afectado: {selectedAlert.device?.hostname}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Siren className="w-4 h-4 inline-block mr-1" />
                <div className="font-semibold mb-1">Estado</div>
              </div>
              <div className="bg-white rounded-lg p-3 mb-3 text-sm text-gray-700 shadow-inner">
                {selectedAlert.status === "OK" ? "Resuelto" : "Activo"} - Tiempo
                de recuperación:{" "}
                {selectedAlert.recovered === "<i>Never</i>"
                  ? "Nunca"
                  : selectedAlert.recovered || "N/A"}
              </div>
              <div className="flex items-center">
                <ReceiptText className="w-4 h-4 inline-block mr-1" />
                <div className="font-semibold mb-1">
                  Detalles del dispositivo
                </div>
              </div>
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
              <div className="flex items-center">
                <LocateFixed className="w-4 h-4 inline-block mr-1" />
                <div className="font-semibold mb-1">Ubicación</div>
              </div>
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
              {/* <button
                onClick={() =>
                  handleCompleteAlert(selectedAlert.alert_table_id)
                }
                className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 shadow cursor-pointer"
              >
                Completar
              </button> */}
              {selectedAlert.completado === "SI" ? (
                <button
                  onClick={() =>
                    handleNoCompleteAlert(selectedAlert.alert_table_id)
                  }
                  className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg px-4 py-2 shadow cursor-pointer"
                >
                  Regresar
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleCompleteAlert(selectedAlert.alert_table_id)
                  }
                  className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 shadow cursor-pointer"
                >
                  Completar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-center">
              Confirmar acción
            </h3>
            <p className="mb-3 text-center">
              ¿Estás seguro quieres completar esta alerta?
            </p>
            <p className="text-sm mt-2 mb-5 text-gray-500 text-center">
              Recuerda que estará bajo supervisión de un administrador, quien se
              encargará de verificar el estatus.
            </p>
            <div className="flex justify-evenly gap-3">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCompleteAlert}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
