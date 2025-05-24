import React, { useState, useEffect, PureComponent } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { AreaChart, Area } from "recharts";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { BarChart, Bar, Rectangle } from "recharts";
import { LineChart, Line, ReferenceLine } from "recharts";
import FocusGraph from "./FocusGraph";

const RADIAN = Math.PI / 180;
const data = [
  { name: "A", value: 80, color: "#ff0000" },
  { name: "B", value: 45, color: "#00ff00" },
  { name: "C", value: 25, color: "#0000ff" },
];
const cx = 70;
const cy = 57.5;
const iR = 30;
const oR = 45;

const value = 50;

const needle = (value, data, cx, cy, iR, oR, color) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="#none"
      fill={color}
    />,
  ];
};

export class PieChartWithNeedle extends PureComponent {
  render() {
    return (
      <PieChart width={140} height={80}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
          className="cursor-pointer"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(value, data, cx, cy, iR, oR, "#d0d000")}
      </PieChart>
    );
  }
}

const RADIAN2 = Math.PI / 180;
const cx2 = 150;
const cy2 = 200;
const iR2 = 50;
const oR2 = 100;

const needle2 = (value, data, cx, cy, iR, oR, color) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN2 * ang);
  const cos = Math.cos(-RADIAN2 * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="#none"
      fill={color}
    />,
  ];
};

export class PieChartWithNeedle2 extends PureComponent {
  render() {
    return (
      <PieChart width={600} height={400}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx2}
          cy={cy2}
          innerRadius={iR2}
          outerRadius={oR2}
          fill="#8884d8"
          stroke="none"
          className="cursor-pointer"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle2(value, data, cx2, cy2, iR2, oR2, "#d0d000")}
      </PieChart>
    );
  }
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState(null);

  useEffect(() => {
    const savedState = sessionStorage.getItem("isSidebarCollapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }

    // Leer el hash de la URL al cargar
    const hash = window.location.hash.substring(1);
    if (hash && chartComponents[hash]) {
      setSelectedGraph(hash);
      sessionStorage.setItem("activeSidebarItem", getTitleFromGraphId(hash));
    }
  }, []);

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

  useEffect(() => {
    sessionStorage.setItem("isSidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && chartComponents[hash]) {
        setSelectedGraph(hash);
        sessionStorage.setItem("activeSidebarItem", getTitleFromGraphId(hash));
      }
    };

    // Escuchar tanto el evento popstate como nuestro evento personalizado
    window.addEventListener("popstate", handleHashChange);
    window.addEventListener("hashChanged", handleHashChange);

    // Ejecutar al montar
    handleHashChange();

    return () => {
      window.removeEventListener("popstate", handleHashChange);
      window.removeEventListener("hashChanged", handleHashChange);
    };
  }, []);

  const handleGraphClick = (graphId) => {
    setSelectedGraph(graphId);
    // Actualizar la URL con el hash
    window.location.hash = graphId;
    // También guardar en sessionStorage para que la sidebar lo detecte
    sessionStorage.setItem("activeSidebarItem", getTitleFromGraphId(graphId));
  };

  // Mapeo de componentes de gráficas
  const chartComponents = {
    consumo_total: (
      <ResponsiveContainer>
        <PieChartWithNeedle2 />
      </ResponsiveContainer>
    ),
    historico_crecimiento: (
      <ResponsiveContainer>
        <AreaChart
          data={data2}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGrowthF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
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
            fill="url(#colorGrowthF)"
          />
        </AreaChart>
      </ResponsiveContainer>
    ),
    trafico_red: (
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="50%" data={data3}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Mike"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    ),
    fallas: (
      <ResponsiveContainer>
        <BarChart
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
          />
        </BarChart>
      </ResponsiveContainer>
    ),
    prediccion_crecimiento: (
      <ResponsiveContainer>
        <LineChart
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
    ),
  };

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex flex-col w-full max-w-[1700px]">
        <div className="flex flex-row justify-around gap-6 mt-4 px-3 py-1">
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[200px] h-[200px] cursor-pointer"
            )}
          >
            <div className="px-2">
              <div className="mb-4 -mt-2 text-center">
                <h1 className="text-l font-bold">Consumo Total</h1>
                <p className="text-xs text-gray-500">Mayo 2025</p>
              </div>
              <div
                className="z-10 h-[80px]"
                onClick={() => handleGraphClick("consumo_total")}
              >
                <div className="z-10 flex justify-center">
                  <PieChartWithNeedle />
                </div>
              </div>
              <div className="z-20 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Descargar Reporte
                </Button>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[270px] h-[200px] cursor-pointer"
            )}
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
              <div className="z-20 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Descargar Reporte
                </Button>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[200px] h-[200px] cursor-pointer"
            )}
          >
            <div className="px-5">
              <div className="mb-4 -mt-2 text-center">
                <h1 className="text-l font-bold">Tráfico de red</h1>
                <p className="text-xs text-gray-500">Mayo 2025</p>
              </div>
              <div
                className="z-10 h-[80px]"
                onClick={() => handleGraphClick("trafico_red")}
              >
                <div className="z-10 flex justify-center">
                  <ResponsiveContainer width="100%" height={80}>
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="100%"
                      data={data3}
                    >
                      <PolarGrid />
                      <Radar
                        name="Mike"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                        className="cursor-pointer"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="z-20 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Descargar Reporte
                </Button>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[200px] h-[200px] cursor-pointer"
            )}
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
              <div className="z-20 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Descargar Reporte
                </Button>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[270px] h-[200px] cursor-pointer"
            )}
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
              <div className="z-20 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Descargar Reporte
                </Button>
              </div>
            </div>
          </div>
        </div>
        <FocusGraph
          selectedGraph={selectedGraph}
          chartComponents={chartComponents}
          onClose={() => {
            setSelectedGraph(null);
            window.location.hash = "";
            sessionStorage.setItem("activeSidebarItem", "Panel");
          }}
        />
      </div>
    </div>
  );
}
