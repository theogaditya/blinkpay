"use client"

import * as React from "react"
import axios from "axios"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

// initial empty state; we'll fill it from the API
type Tx = {
  OnRampingStatus: string
  amount: number
  created_at: string
  updated_at: string
}

type Point = {
  date: string
  mobile: number
  desktop?: number
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState<string>("90d")
  const [chartData, setChartData] = React.useState<Point[]>([])

  React.useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get<Tx[]>("/api/getAllTrans")
        const formatted: Point[] = data.map((tx) => ({
          date: tx.created_at,
          mobile: tx.amount,
          // desktop: 0, // add if you need a second series
        }))
        setChartData(formatted)
      } catch (err) {
        console.error("failed to load chart data", err)
      }
    }
    load()
  }, [])

  // filter by selected time range
  const filteredData = React.useMemo(() => {
    const now = new Date()
    let days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const cutoff = new Date(now)
    cutoff.setDate(cutoff.getDate() - days)

    return chartData.filter((pt) => new Date(pt.date) >= cutoff)
  }, [chartData, timeRange])

  const chartConfig = {
    visitors: { label: "Visitors" },
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <Card className="pt-0 bg-black border-none">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row border-none">
        <div className="flex-1 text-white" />
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex text-white"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            
            <ChartLegend />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
