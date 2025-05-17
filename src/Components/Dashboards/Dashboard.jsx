import React from "react";
import RadialChart from "../ui/RadialChart";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-xl font-bold">Start</h1>
      <div className="flex flex-row">
      <RadialChart/>
      <RadialChart/>
      <RadialChart/>
      <RadialChart/>
      <RadialChart/>
      </div>
      <h1 className="text-xl font-bold">End</h1>
    </>
  );
}
