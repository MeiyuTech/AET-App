'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface BusinessDistributionChartProps {
  data: {
    name: string
    value: number
  }[]
}

const COLORS = ['#008080', '#00a0a0', '#00c0c0', '#00e0e0']

export function BusinessDistributionChart({ data }: BusinessDistributionChartProps) {
  const [isAnimated, setIsAnimated] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
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

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 shadow-md rounded border border-[#008080]/20">
          <p className="text-sm">
            {payload[0].name}: <span className="font-semibold">{payload[0].value}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div ref={ref} className="flex items-center gap-8">
      {/* Legend on the left */}
      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className={`flex items-center gap-2 cursor-pointer transition-colors duration-200
              ${activeIndex === index ? 'text-[#008080]' : 'text-gray-600'}`}
            onClick={() => handleClick(null, index)}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full transition-transform duration-200
                ${activeIndex === index ? 'scale-125' : ''}`}
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Chart on the right */}
      <div className="flex-1 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              startAngle={90}
              endAngle={-270}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
              isAnimationActive={true}
              onClick={handleClick}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  strokeWidth={0}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
