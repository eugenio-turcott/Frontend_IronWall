import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AreaChart, Area } from "recharts";
import { BarChart, Bar, Rectangle } from "recharts";
import { LineChart, Line, ReferenceLine } from "recharts";
import HistoricoCrecimiento from "./HistoricoCrecimiento";
import PrediccionCrecimiento from "./PrediccionCrecimiento";
import PieChartWithNeedle from "../ui/PieChartWithNeedle";
import FallasTop from "./Fallas";
import ConsumoTotal from "./ConsumoTotal";

const data = [
  { name: "A", value: 80, color: "#ff0000" },
  { name: "B", value: 45, color: "#00ff00" },
  { name: "C", value: 25, color: "#0000ff" },
];

const data2 = [
  { month: "January", desktop: 120 },
  { month: "February", desktop: 250 },
  { month: "March", desktop: 300 },
  { month: "April", desktop: 190 },
  { month: "May", desktop: 400 },
  { month: "June", desktop: 350 },
];

const data3 = [
  {
    subject: "1",
    A: 90,
    B: 80,
    fullMark: 100,
  },
  {
    subject: "2",
    A: 78,
    B: 90,
    fullMark: 100,
  },
  {
    subject: "3",
    A: 46,
    B: 70,
    fullMark: 100,
  },
  {
    subject: "4",
    A: 60,
    B: 90,
    fullMark: 100,
  },
  {
    subject: "5",
    A: 35,
    B: 65,
    fullMark: 100,
  },
  {
    subject: "6",
    A: 65,
    B: 85,
    fullMark: 100,
  },
];

const data4 = [
  {
    name: "A",
    uv: 900,
  },
  {
    name: "B",
    uv: 600,
  },
  {
    name: "C",
    uv: 200,
  },
  {
    name: "D",
    uv: 780,
  },
  {
    name: "E",
    uv: 490,
  },
];

const data5 = [
  {
    name: "A",
    pv: 240,
  },
  {
    name: "B",
    pv: 150,
  },
  {
    name: "C",
    pv: 600,
  },
  {
    name: "D",
    pv: 400,
  },
  {
    name: "E",
    pv: 200,
  },
  {
    name: "F",
    pv: 380,
  },
  {
    name: "G",
    pv: 140,
  },
];

export default function Dashboard() {
  const [selectedGraph, setSelectedGraph] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setSelectedGraph(hash);
      }
    };

    // Verificar el hash al cargar
    handleHashChange();

    // Escuchar cambios en el hash
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleGraphClick = (graphId) => {
    setSelectedGraph(graphId);
    window.location.hash = graphId;
    sessionStorage.setItem("activeSidebarItem", getTitleFromGraphId(graphId));
  };

  const getTitleFromGraphId = (graphId) => {
    switch (graphId) {
      case "consumo_total":
        return "Consumo total";
      case "historico_crecimiento":
        return "Histórico de crecimiento";
      case "trafico_red":
        return "Trafico de red";
      case "fallas":
        return "Fallas";
      case "prediccion_crecimiento":
        return "Prediccion de crecimiento";
      default:
        return "Panel";
    }
  };

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex flex-col w-full max-w-[1700px]">
        <div className="flex flex-row justify-around gap-6 mt-4 px-3 py-1">
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[200px] h-[175px] cursor-pointer"
            )}
            onClick={() => handleGraphClick("consumo_total")}
          >
            <div className="px-2">
              <div className="mb-4 -mt-2 text-center">
                <h1 className="text-l font-bold">Consumo Total</h1>
                <p className="text-xs text-gray-500">Mayo 2025</p>
              </div>
              <div className="z-10 h-[80px]">
                <div className="z-10 flex justify-center">
                  <PieChartWithNeedle />
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[270px] h-[175px] cursor-pointer"
            )}
            onClick={() => handleGraphClick("historico_crecimiento")}
          >
            <div className="px-5">
              <div className="mb-4 -mt-2 text-center">
                <h1 className="text-l font-bold">Histórico de Crecimiento</h1>
                <p className="text-xs text-gray-500">Mayo 2025</p>
              </div>
              <div
                className="z-10 h-[80px]"
                onClick={() => handleGraphClick("historico_crecimiento")}
              >
                <div className="z-10 flex justify-center">
                  <ResponsiveContainer width="100%" height={80}>
                    <AreaChart
                      data={data2}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorGrowth"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4f46e5"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4f46e5"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="desktop"
                        stroke="#4f46e5"
                        fillOpacity={1}
                        fill="url(#colorGrowth)"
                        className="cursor-pointer"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[200px] h-[175px] cursor-pointer"
            )}
            onClick={() => handleGraphClick("fallas")}
          >
            <div className="px-5">
              <div className="mb-4 -mt-2 text-center">
                <h1 className="text-l font-bold">Top 5 Fallas</h1>
                <p className="text-xs text-gray-500">Mayo 2025</p>
              </div>
              <div
                className="z-10 h-[80px]"
                onClick={() => handleGraphClick("fallas")}
              >
                <div className="z-10 flex justify-center">
                  <ResponsiveContainer width="100%" height={80}>
                    <BarChart
                      width={500}
                      height={300}
                      data={data4}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="uv"
                        fill="#82ca9d"
                        activeBar={<Rectangle fill="gold" stroke="purple" />}
                        className="cursor-pointer"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[270px] h-[175px] cursor-pointer"
            )}
            onClick={() => handleGraphClick("prediccion_crecimiento")}
          >
            <div className="px-5">
              <div className="mb-4 -mt-2 text-center">
                <h1 className="text-l font-bold">Predicción de Crecimiento</h1>
                <p className="text-xs text-gray-500">Mayo 2025</p>
              </div>
              <div
                className="z-10 h-[80px]"
                onClick={() => handleGraphClick("prediccion_crecimiento")}
              >
                <div className="z-10 flex justify-center">
                  <ResponsiveContainer width="100%" height={80}>
                    <LineChart
                      width={500}
                      height={300}
                      data={data5}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <ReferenceLine x="C" stroke="red" label="May 2025" />
                      <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedGraph === "historico_crecimiento" ? (
          <HistoricoCrecimiento
            selectedGraph={selectedGraph}
            onClose={() => {
              setSelectedGraph(null);
              window.location.hash = "";
              sessionStorage.setItem("activeSidebarItem", "Panel");
            }}
          />
        ) : selectedGraph === "prediccion_crecimiento" ? (
          <PrediccionCrecimiento
            selectedGraph={selectedGraph}
            onClose={() => {
              setSelectedGraph(null);
              window.location.hash = "";
              sessionStorage.setItem("activeSidebarItem", "Panel");
            }}
          />
        ) : selectedGraph === "fallas" ? (
          <FallasTop
            selectedGraph={selectedGraph}
            onClose={() => {
              setSelectedGraph(null);
              window.location.hash = "";
              sessionStorage.setItem("Panel", "");
            }}
          />
        ) : selectedGraph === "consumo_total" ? (
          <ConsumoTotal
            selectedGraph={selectedGraph}
            onClose={() => {
              setSelectedGraph(null);
              window.location.hash = "";
              sessionStorage.setItem("activeSidebarItem", "Panel");
            }}
          />
        ) : selectedGraph ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 mt-4 border-2">
            Componente para {selectedGraph} no implementado aún.
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 mt-4 border-2">
            Selecciona una gráfica para ver los detalles.
          </div>
        )}
      </div>
    </div>
  );
}
