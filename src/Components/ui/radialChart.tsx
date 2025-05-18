import { Download, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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

interface RadialChartProps {
  title: string;
  description: string;
  data: {
    month: string;
    desktop: number;
    mobile: number;
  };
  trend?: string;
  note?: string;
}

export default function RadialChart({
  title,
  description,
  data,
  trend = "Trending up by 5.2% this month",
  note = "Showing total visitors for the last 6 months",
}: RadialChartProps) {
  const totalVisitors = data.desktop + data.mobile;

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card className="w-[180px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center p-0">
        <ChartContainer config={chartConfig} className="mx-auto w-full max-w-[150px] aspect-square">
          <RadialBarChart
            data={[data]}
            endAngle={180}
            innerRadius={50}
            outerRadius={70}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 10}
                          className="fill-foreground text-base font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 10}
                          className="fill-muted-foreground text-xs"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="desktop"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-desktop)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mobile"
              fill="var(--color-mobile)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="p-2 pt-0 flex justify-center">
        <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
          <Download className="w-3 h-3" />
          Descargar Reporte
        </Button>
      </CardFooter>
    </Card>
  );
}
