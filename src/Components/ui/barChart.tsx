"use client";

import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

interface BarChartCardProps {
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

export default function BarChartCard({
  title,
  description,
  data,
}: BarChartCardProps) {
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
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              fontSize={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
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
