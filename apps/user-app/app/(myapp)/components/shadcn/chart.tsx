"use client"

import * as React from "react"
import axios from "axios"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

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

// your API Tx types
type OnTx = {
  OnRampingStatus: string
  amount: number
  created_at: string
  updated_at: string
  provider: string
}
type OffTx = {
  OffRampingStatus: string
  amount: number
  created_at: string
  updated_at: string
  provider: string
}

// unified chart point
type Point = {
  date: string
  mobile?: number    // incoming
  off?: number       // outgoing (will be negative)
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState<string>("90d")
  const [chartData, setChartData] = React.useState<Point[]>([])

  React.useEffect(() => {
    async function load() {
      try {
        const [onRes, offRes] = await Promise.all([
          axios.get<OnTx[]>("/api/getAllTrans"),
          axios.get<OffTx[]>("/api/getoffRamp"),
        ])

        const onPoints: Point[] = onRes.data.map(tx => ({
          date: tx.created_at,
          mobile: tx.amount,
        }))

        const offPoints: Point[] = offRes.data.map(tx => ({
          date: tx.created_at,
          off: -tx.amount,    // negate here
        }))

        const combined = [...onPoints, ...offPoints].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        setChartData(combined)
      } catch (err) {
        console.error("failed to load chart data", err)
      }
    }
    load()
  }, [])

  const filteredData = React.useMemo(() => {
    const now = new Date()
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const cutoff = new Date(now)
    cutoff.setDate(cutoff.getDate() - days)
    return chartData.filter(pt => new Date(pt.date) >= cutoff)
  }, [chartData, timeRange])

  const chartConfig = {
    mobile: { label: "Incoming", color: "#4ade80" },   // green
    off:    { label: "Outgoing", color: "#f87171" },   // red
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
            {/* Y-axis for positive/negative */}
            <YAxis
              domain={['auto', 'auto']}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'white', fontSize: 12 }}
              width={40}
            />

            <CartesianGrid vertical={false} stroke="#333" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{
                fill: 'white',
                fontSize: 12,
              }}
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

            <defs>
              {/* incoming gradient */}
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
              </linearGradient>
              {/* outgoing gradient */}
              <linearGradient id="fillOff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f87171" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* incoming area (green) */}
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="#4ade80"
              connectNulls={false}
            />

            {/* outgoing area (red) */}
            <Area
              dataKey="off"
              type="natural"
              fill="url(#fillOff)"
              stroke="#f87171"
              connectNulls={false}
            />

            <ChartLegend />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
