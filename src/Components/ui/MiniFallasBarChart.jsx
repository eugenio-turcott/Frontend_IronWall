import React from "react";
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from "recharts";

// Mini bar chart for dashboard card (static demo values, can be replaced with props if needed)
export default function MiniFallasBarChart({ width = 100, height = 60, data }) {
  // If no data is passed, use demo values
  const chartData = data || [
    { device: "A", fail_count: 5 },
    { device: "B", fail_count: 3 },
    { device: "C", fail_count: 2 },
    { device: "D", fail_count: 1 },
    { device: "E", fail_count: 1 },
  ];
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 10, left: 20, bottom: 15 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          type="number"
          domain={[0, 'dataMax']}
          tick={{ fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          type="category"
          dataKey="device"
          tick={{ fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          width={20}
        />
        <Bar dataKey="fail_count" fill="#ef4444" barSize={10} />
      </BarChart>
      <div style={{ textAlign: 'center', color: '#ef4444', fontSize: 10, marginTop: -22 }}>
        Fallas
      </div>
    </ResponsiveContainer>
  );
}
