import React, { useState, useMemo } from "react";
import AlertComponent from "./AlertComponent";
import { Download } from "lucide-react";

const mockAlerts = [
	{
		alert_table_id: "1095483",
		device_id: "5",
		last_ok: "1747943500",
		severity: "crit",
		status: "OK",
		recovered: "3h 5m",
		tipo: "Uso alto de CPU",
		nodo: "Nodo 3",
		fecha: "2025-05-16 14:30",
		descripcion:
			"El uso de CPU ha superado el 90% en el nodo. Verificar procesos en ejecución.",
		duracion: "4h 10m",
		metricas: {
			utilizacion: "95%",
			perdida_paquetes: "0%",
			latencia: "20 ms",
			sla: "99%",
		},
		device: {
			hostname: "172.19.99.3",
			ip: "172.19.99.3",
			location: "Coahuila, Saltillo, RB Jolla",
			location_id: "4",
			location_lat: "25.4458200",
			location_lon: "-100.9953960",
			sysName: "edge-switch_saltillo",
			os: "routeros",
			vendor: "Mikrotik",
			type: "network",
			status: "1",
		},
	},
	{
		alert_table_id: "1095484",
		device_id: "6",
		last_ok: "1747944000",
		severity: "info",
		status: "OK",
		recovered: "5d 12h 0m",
		tipo: "Temperatura elevada",
		nodo: "Nodo 4",
		fecha: "2025-05-16 18:45",
		descripcion:
			"La temperatura de la CPU ha superado los 75 °C. Revisar sistema de enfriamiento.",
		duracion: "1h 35m",
		metricas: {
			utilizacion: "50%",
			perdida_paquetes: "0%",
			latencia: "N/A",
			sla: "100%",
		},
		device: {
			hostname: "172.19.99.10",
			ip: "172.19.99.10",
			location: "Coahuila, Saltillo, RB Jolla",
			location_id: "4",
			location_lat: "25.4458200",
			location_lon: "-100.9953960",
			sysName: "core-temp-monitor",
			os: "linux",
			vendor: "Dell",
			type: "server",
			status: "1",
		},
	},
	{
		alert_table_id: "1095485",
		device_id: "7",
		last_ok: "1747944500",
		severity: "crit",
		status: "OK",
		recovered: "10m",
		tipo: "Error de disco",
		nodo: "Nodo 5",
		fecha: "2025-05-17 08:05",
		descripcion:
			"Se detectaron bloques defectuosos en el disco principal. Posible riesgo de pérdida de datos.",
		duracion: "10m",
		metricas: {
			utilizacion: "40%",
			perdida_paquetes: "0%",
			latencia: "5 ms",
			sla: "95%",
		},
		device: {
			hostname: "172.19.99.11",
			ip: "172.19.99.11",
			location: "Coahuila, Saltillo, RB Jolla",
			location_id: "4",
			location_lat: "25.4458200",
			location_lon: "-100.9953960",
			sysName: "storage-node5",
			os: "linux",
			vendor: "HP",
			type: "storage",
			status: "1",
		},
	},
	{
		alert_table_id: "1095486",
		device_id: "8",
		last_ok: "1747945000",
		severity: "warn",
		status: "OK",
		recovered: "1d 2h 45m",
		tipo: "Puerto caído",
		nodo: "Nodo 6",
		fecha: "2025-05-17 11:20",
		descripcion:
			"El puerto Gigabit ETH1 ha quedado inactivo. Comprobar cableado y configuración.",
		duracion: "2h",
		metricas: {
			utilizacion: "30%",
			perdida_paquetes: "1%",
			latencia: "50 ms",
			sla: "92%",
		},
		device: {
			hostname: "172.19.99.5",
			ip: "172.19.99.5",
			location: "Coahuila, Saltillo, RB Jolla",
			location_id: "4",
			location_lat: "25.4458200",
			location_lon: "-100.9953960",
			sysName: "edge-port-swt6",
			os: "routeros",
			vendor: "Mikrotik",
			type: "network",
			status: "1",
		},
	},
	{
		alert_table_id: "1095487",
		device_id: "9",
		last_ok: "1747945500",
		severity: "warn",
		status: "OK",
		recovered: "12h",
		tipo: "Memoria insuficiente",
		nodo: "Nodo 7",
		fecha: "2025-05-17 15:55",
		descripcion:
			"La memoria RAM ha superado el 85% de uso. Evaluar procesos y aumentar capacidad si es necesario.",
		duracion: "6h 20m",
		metricas: {
			utilizacion: "88%",
			perdida_paquetes: "0%",
			latencia: "25 ms",
			sla: "97%",
		},
		device: {
			hostname: "172.19.99.6",
			ip: "172.19.99.6",
			location: "Coahuila, Saltillo, RB Jolla",
			location_id: "4",
			location_lat: "25.4458200",
			location_lon: "-100.9953960",
			sysName: "app-server7",
			os: "linux",
			vendor: "Ubuntu",
			type: "server",
			status: "1",
		},
	}
];

const severities = ["crit", "warn", "info"];
const tipos = [...new Set(mockAlerts.map((a) => a.tipo))];
const regiones = [...new Set(mockAlerts.map((a) => a.device.location))];

export default function AlertList() {
	const [selectedAlert, setSelectedAlert] = useState(mockAlerts[0]);
	const [filters, setFilters] = useState({
		tipo: "",
		severidad: "",
		region: "",
	});

	// Filtros funcionales
	const filteredAlerts = useMemo(() => {
		return mockAlerts.filter((a) => {
			return (
				(!filters.tipo || a.tipo === filters.tipo) &&
				(!filters.severidad || a.severity === filters.severidad) &&
				(!filters.region || a.device.location === filters.region)
			);
		});
	}, [filters]);

	// Leyenda de actualización
	const updatedMinutesAgo = 5;

	return (
		<div className="w-full h-screen flex flex-col items-center bg-[#f7f8fa] min-h-0">
			<div className="w-full max-w-6xl flex justify-end pt-8 pb-2 pr-8">
				<button className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium shadow-sm hover:shadow-md cursor-pointer">
					<Download className="w-4 h-4" /> Descargar Reporte
				</button>
			</div>
			<div className="w-full max-w-6xl bg-white rounded-xl shadow flex-1 flex flex-col gap-4">
				<div className="flex flex-row gap-8 h-full min-h-0 p-8">
					{/* Columna izquierda: lista de alertas */}
					<div className="flex-1 min-w-[260px] max-w-[320px] flex flex-col">
						<h1 className="text-2xl font-bold mb-2">Alerts</h1>
						<div className="text-xs text-gray-400 mb-2">
							Updated {updatedMinutesAgo} minutes ago
						</div>
						<div className="overflow-y-auto flex-1 flex flex-col gap-3 pr-1 min-h-0">
							{filteredAlerts.map((item) => (
								<div
									key={item.alert_table_id}
									className={`cursor-pointer ${
										selectedAlert?.alert_table_id === item.alert_table_id
											? "ring-2 ring-blue-400"
											: ""
									}`}
									onClick={() => setSelectedAlert(item)}
								>
									<AlertComponent
										tipo={item.tipo}
										nodo={item.nodo}
										fecha={item.fecha}
										severity={item.severity}
										device={item.device}
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
									className={`rounded-lg px-3 py-1 text-sm font-medium text-left ${
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
									className={`rounded-lg px-3 py-1 text-sm font-medium text-left ${
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
									className={`rounded-lg px-3 py-1 text-sm font-medium text-left ${
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
					{/* Columna derecha: detalles de alerta seleccionada */}
					<div className="min-w-[320px] max-w-[400px] bg-[#f5f6fa] rounded-lg p-6 border flex flex-col self-start">
						<div className="flex gap-4 mb-2">
							<span className="font-bold text-base">
								{selectedAlert?.tipo || "Tipo de incidente"}
							</span>
							<span className="font-bold text-base">
								{selectedAlert?.device?.hostname || "nodo afectado"}
							</span>
						</div>
						<div className="font-semibold mb-1">Duración estimada</div>
						<div className="bg-white rounded-lg p-3 mb-3 text-sm text-gray-700 shadow-inner">
							{selectedAlert?.descripcion || "Sin descripción"}
						</div>
						<div className="font-semibold mb-1">Métricas relevantes</div>
						<div className="grid grid-cols-2 gap-2 mb-4">
							<div className="bg-blue-100 rounded-lg px-3 py-2 flex flex-col items-center">
								<span className="text-xs text-gray-500">
									Utilización Promedio
								</span>
								<span className="font-bold text-blue-900 text-lg">
									{selectedAlert?.metricas?.utilizacion || "-"}
								</span>
							</div>
							<div className="bg-blue-100 rounded-lg px-3 py-2 flex flex-col items-center">
								<span className="text-xs text-gray-500">
									Perdida de Paquetes
								</span>
								<span className="font-bold text-blue-900 text-lg">
									{selectedAlert?.metricas?.perdida_paquetes || "-"}
								</span>
							</div>
							<div className="bg-blue-100 rounded-lg px-3 py-2 flex flex-col items-center">
								<span className="text-xs text-gray-500">Latencia</span>
								<span className="font-bold text-blue-900 text-lg">
									{selectedAlert?.metricas?.latencia || "-"}
								</span>
							</div>
							<div className="bg-blue-100 rounded-lg px-3 py-2 flex flex-col items-center">
								<span className="text-xs text-gray-500">
									Cumplimiento de SLA
								</span>
								<span className="font-bold text-blue-900 text-lg">
									{selectedAlert?.metricas?.sla || "-"}
								</span>
							</div>
						</div>
						<button className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 shadow cursor-pointer">
							Completar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}