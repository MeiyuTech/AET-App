'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function MarketGrowthChart() {
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

  const data = [
    { year: '2020', value: isAnimated ? 42 : 0 },
    { year: '2021', value: isAnimated ? 74 : 0 },
    { year: '2023', value: isAnimated ? 364 : 0 },
    { year: '2030(预测)', value: isAnimated ? 928 : 0 },
  ]

  return (
    <div ref={ref} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => `${value}亿`} domain={[0, 1000]} />
          <Tooltip
            formatter={(value) => [`${value}亿美元`, '市场规模']}
            labelStyle={{ color: '#666' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Bar
            dataKey="value"
            fill="#008080"
            radius={[6, 6, 0, 0]}
            animationBegin={0}
            animationDuration={1000}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`rgba(0, 128, 128, ${0.6 + index * 0.1})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
