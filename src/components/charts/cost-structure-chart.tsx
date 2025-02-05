'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface CostStructureChartProps {
  data: {
    name: string
    value: number
  }[]
}

const COLORS = ['#008080', '#00a0a0', '#00c0c0']

export function CostStructureChart({ data }: CostStructureChartProps) {
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
    name: item.name,
    value: isAnimated ? item.value : 0,
  }))

  return (
    <div ref={ref} className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 text-sm">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
            <span className="text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
