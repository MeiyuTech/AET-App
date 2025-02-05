'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface FinancialChartProps {
  data: {
    year: string
    revenue: number
    profit: number
  }[]
}

export function FinancialChart({ data }: FinancialChartProps) {
  const [isAnimated, setIsAnimated] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // 使用 useEffect 监听 inView 的变化
  useEffect(() => {
    if (inView) {
      setIsAnimated(true)
    } else {
      setIsAnimated(false) // 当组件离开视图时重置状态
    }
  }, [inView])

  // 对数据按年份升序排序
  const sortedData = [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year))

  const chartData = sortedData.map((item) => ({
    year: item.year,
    营业额: isAnimated ? item.revenue : 0,
    净利润: isAnimated ? item.profit : 0,
  }))

  return (
    <div ref={ref} className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(value as number)
            }
          />
          <Bar
            dataKey="营业额"
            fill="#008080"
            animationBegin={0}
            animationDuration={1000}
            isAnimationActive={true}
          />
          <Bar
            dataKey="净利润"
            fill="#008080"
            fillOpacity={0.6}
            animationBegin={500}
            animationDuration={1000}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
