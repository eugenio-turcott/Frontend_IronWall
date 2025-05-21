import React, { useState, useEffect } from "react";
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

const data = [
  { name: "Energía", value: 400 },
  { name: "Agua", value: 300 },
  { name: "Gas", value: 200 },
  { name: "Otros", value: 100 },
];

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
    subject: "Math",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "Chinese",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "English",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Geography",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "Physics",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "History",
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

const data4 = [
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: 1890,
  },
];

const data5 = [
  {
    name: "Page A",
    pv: 2400,
  },
  {
    name: "Page B",
    pv: 1398,
  },
  {
    name: "Page C",
    pv: 9800,
  },
  {
    name: "Page D",
    pv: 3908,
  },
  {
    name: "Page E",
    pv: 4800,
  },
  {
    name: "Page F",
    pv: 3800,
  },
  {
    name: "Page G",
    pv: 4300,
  },
];

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = sessionStorage.getItem("isSidebarCollapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("isSidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="flex h-screen">
      <div className="flex flex-row justify-center gap-4 mt-5">
        <div
          className={cn(
            "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[175px] h-[315px]"
          )}
        >
          <div className="px-2">
            <div className="mb-4 -mt-2 text-center">
              <h1 className="text-l font-bold">Consumo Total</h1>
              <p className="text-gray-500">Mayo 2025</p>
            </div>
            <div className="z-10 h-[180px]">
              <div className="z-10 flex justify-center">
                <PieChart width={175} height={175}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={15}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </div>
            <div className="z-20 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs gap-1"
              >
                <Download className="w-3 h-3" />
                Descargar Reporte
              </Button>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-[315px]"
          )}
        >
          <div className="px-5">
            <div className="mb-4 -mt-2 text-center">
              <h1 className="text-l font-bold">Histórico de Crecimiento</h1>
              <p className="text-gray-500">Mayo 2025</p>
            </div>
            <div className="z-10 h-[180px]">
              <div className="z-10 flex justify-center">
                <ResponsiveContainer width="100%" height={175}>
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
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="z-20 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs gap-1"
              >
                <Download className="w-3 h-3" />
                Descargar Reporte
              </Button>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[250px] h-[315px]"
          )}
        >
          <div className="px-5">
            <div className="mb-4 -mt-2 text-center">
              <h1 className="text-l font-bold">Tráfico de red</h1>
              <p className="text-gray-500">Mayo 2025</p>
            </div>
            <div className="z-10 h-[180px]">
              <div className="z-10 flex justify-center">
                <ResponsiveContainer width="100%" height={175}>
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
              </div>
            </div>
            <div className="z-20 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs gap-1"
              >
                <Download className="w-3 h-3" />
                Descargar Reporte
              </Button>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[250px] h-[315px]"
          )}
        >
          <div className="px-5">
            <div className="mb-4 -mt-2 text-center">
              <h1 className="text-l font-bold">Top 5 Fallas</h1>
              <p className="text-gray-500">Mayo 2025</p>
            </div>
            <div className="z-10 h-[180px]">
              <div className="z-10 flex justify-center">
                <ResponsiveContainer width="100%" height={175}>
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
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="z-20 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs gap-1"
              >
                <Download className="w-3 h-3" />
                Descargar Reporte
              </Button>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-[250px] h-[315px]"
          )}
        >
          <div className="px-5">
            <div className="mb-4 -mt-2 text-center">
              <h1 className="text-l font-bold">Predicción de Crecimiento</h1>
              <p className="text-gray-500">Mayo 2025</p>
            </div>
            <div className="z-10 h-[180px]">
              <div className="z-10 flex justify-center">
                <ResponsiveContainer width="100%" height={175}>
                  <LineChart
                    width={500}
                    height={300}
                    data={data5}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <ReferenceLine x="Page C" stroke="red" label="May 2025" />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="z-20 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs gap-1"
              >
                <Download className="w-3 h-3" />
                Descargar Reporte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
