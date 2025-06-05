import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const pieColors = ["#4f46e5", "#22c55e", "#f59e42"];

export default function MiniConsumoPieChart({ width = 100, height = 80, data }) {
  const pieChartData = data || [
    { name: "Entrada", value: 4000 },
    { name: "Salida", value: 2000 },
    { name: "Combinado", value: 6000 },
  ];
  return (
    <PieChart width={width} height={height}>
      <Pie
        dataKey="value"
        data={pieChartData}
        cx="50%"
        cy="50%"
        outerRadius={Math.min(width, height) / 2 - 5}
        innerRadius={Math.min(width, height) / 4}
        stroke="black"
        strokeWidth={1}
      >
        {pieChartData.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
