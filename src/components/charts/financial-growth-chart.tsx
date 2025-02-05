'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface FinancialGrowthChartProps {
  data: {
    year: string
    revenue: number
    profit: number
  }[]
}

export function FinancialGrowthChart({ data }: FinancialGrowthChartProps) {
  const [isAnimated, setIsAnimated] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView) {
      setIsAnimated(true)
    } else {
      setIsAnimated(false)
    }
  }, [inView])

  const chartData = data.map((item) => ({
    year: item.year,
    revenue: isAnimated ? item.revenue : 0,
    profit: isAnimated ? item.profit : 0,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 shadow-md rounded border border-[#008080]/20">
          <p className="text-sm font-medium mb-1">{label}年</p>
          <p className="text-sm text-gray-600">
            营收: <span className="font-semibold text-[#008080]">{payload[0].value}M</span>
          </p>
          <p className="text-sm text-gray-600">
            利润: <span className="font-semibold text-[#00a0a0]">{payload[1].value}M</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div ref={ref} className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#008080" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#008080" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00a0a0" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#00a0a0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#eee' }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#eee' }}
            tickFormatter={(value) => `${value}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#008080"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#00a0a0"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#008080]" />
          <span className="text-xs text-gray-600">营收</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00a0a0]" />
          <span className="text-xs text-gray-600">利润</span>
        </div>
      </div>
    </div>
  )
}
