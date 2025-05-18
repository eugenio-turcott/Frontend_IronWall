"use client";

import { Download } from "lucide-react";
import { CartesianGrid, Dot, Line, LineChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

interface LineChartCardProps {
  title: string;
  description: string;
  data: {
    browser: string;
    visitors: number;
    fill: string;
  }[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-2))",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function LineChartCard({
  title,
  description,
  data,
}: LineChartCardProps) {
  return (
    <Card className="w-[180px]">
      <CardHeader className="pb-2 px-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex justify-center items-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[150px] aspect-[2/1]"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, left: 0, right: 0 }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="visitors"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="visitors"
              type="natural"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              dot={({ payload, ...props }) => (
                <Dot
                  key={payload.browser}
                  r={4}
                  cx={props.cx}
                  cy={props.cy}
                  fill={payload.fill}
                  stroke={payload.fill}
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs gap-1 h-6 px-1"
        >
          <Download className="w-3 h-3" />
          Descargar Reporte
        </Button>
      </CardFooter>
    </Card>
  );
}
