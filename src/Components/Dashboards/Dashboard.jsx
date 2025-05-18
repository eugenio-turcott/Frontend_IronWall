import React from "react";
import RadialChart from "../ui/RadialChart";
import AreaChartCard from "../ui/AreaChart"
import BarChartCard from "../ui/barChart";
import LineChartCard from "../ui/lineChart";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-xl font-bold">Start</h1>
      <div className="flex flex-row flex-wrap gap-4">

        <RadialChart
          title="Consumo Total"
          description="February 2024"
          data={{ month: "February", desktop: 850, mobile: 650 }}
        />
        <AreaChartCard
        title="Tendencias de Crecimiento"
        description="March 2024"
        data={[
            { month: "January", desktop: 120 },
            { month: "February", desktop: 250 },
            { month: "March", desktop: 300 },
            { month: "April", desktop: 190 },
            { month: "May", desktop: 400 },
            { month: "June", desktop: 350 },
        ]}
        />
        <BarChartCard
        title="Fallas"
        description="January - June 2024"
        data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
        ]}
        />

        <LineChartCard
        title="Predicción de crecimiento"
        description="January - June     2024"
        data={[
            { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
            { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
            { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
            { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
            { browser: "other", visitors: 90, fill: "var(--color-other)" },
        ]}
        />

      </div>
      <h1 className="text-xl font-bold">End</h1>
    </>
  );
}
