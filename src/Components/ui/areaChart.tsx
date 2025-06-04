"use client";

import { Download } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart";
import { Button } from "@/Components/ui/button";

interface AreaChartProps {
  title: string;
  description: string;
  data: {
    month: string;
    desktop: number;
  }[];
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function AreaChartCard({
  title,
  description,
  data,
}: AreaChartProps) {
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
          <AreaChart
            data={data}
            margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(val) => val.slice(0, 3)}
              fontSize={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              fill="var(--color-desktop)"
              fillOpacity={0.25}
            />
          </AreaChart>
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
