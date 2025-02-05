'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export function BrandInvestExitProcessCircle() {
  const [isAnimating, setIsAnimating] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView) {
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
    }
  }, [inView])

  return (
    <div ref={ref} className="relative mx-auto aspect-square">
      <svg className="w-full h-full" viewBox="0 0 800 800">
        {/* Define Arrow Marker */}
        <defs>
          <marker id="arrowhead" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
            <path d="M0,0 L12,4 L0,8" className="fill-[#008080]" opacity="0.2" />
          </marker>
        </defs>

        {/* Center Circle and Text */}
        <g
          className={`transition-opacity duration-700 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        >
          <circle
            cx="400"
            cy="400"
            r="160"
            className="fill-[#008080]/5 stroke-[#008080] stroke-2"
          />
          <text
            x="400"
            y="370"
            textAnchor="middle"
            className="text-4xl md:text-5xl font-bold fill-[#008080]"
          >
            Taste of
          </text>
          <text
            x="400"
            y="440"
            textAnchor="middle"
            className="text-4xl md:text-5xl font-bold fill-[#008080]"
          >
            Beauty
          </text>
        </g>

        {/* Progress Circle with Arrows */}
        {isAnimating && (
          <>
            <path
              d={`M400,180 A220,220 0 1,1 400,620 A220,220 0 1,1 400,180`}
              fill="none"
              className="stroke-[#008080]/20"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              markerStart="url(#arrowhead)"
              markerMid="url(#arrowhead)"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset="100"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="1.5s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              />
            </path>

            {/* Add multiple arrows along the path */}
            {[30, 90, 150, 210, 270, 330].map((angle, index) => {
              const radians = (angle * Math.PI) / 180
              const x = 400 + 220 * Math.cos(radians)
              const y = 400 + 220 * Math.sin(radians)

              return (
                <g
                  key={`arrow-${index}`}
                  className={`transition-opacity duration-500`}
                  style={{
                    transitionDelay: `${1500 + index * 100}ms`,
                  }}
                  transform={`translate(${x},${y}) rotate(${angle + 90})`}
                >
                  <path
                    d="M-4,0 L4,0 M1,-3 L4,0 L1,3"
                    stroke="#008080"
                    strokeWidth="2"
                    className={`opacity-20 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                    fill="none"
                  />
                </g>
              )
            })}
          </>
        )}

        {/* Connecting Lines and Steps */}
        {[
          { angle: -90, label: '初期投资到位', desc: '项目筹备运行' },
          { angle: -30, label: '项目运行顺利', desc: '盈利可进入再投资' },
          { angle: 30, label: '品牌扩张', desc: '旗舰店与直营店扩张' },
          { angle: 90, label: '股权分红', desc: '初期投资人如期获得分红' },
          { angle: 150, label: '身份获批', desc: '初期投资人获得绿卡' },
          { angle: 210, label: '退出并引入新投资', desc: '溢价回购不低于105%' },
        ].map((item, index) => {
          const angle = (item.angle * Math.PI) / 180
          const innerX = 400 + 160 * Math.cos(angle)
          const innerY = 400 + 160 * Math.sin(angle)
          const outerX = 400 + 260 * Math.cos(angle)
          const outerY = 400 + 260 * Math.sin(angle)

          return (
            <g key={index} className="select-none">
              {/* Connecting Line */}
              <line
                x1={innerX}
                y1={innerY}
                x2={outerX}
                y2={outerY}
                className={`stroke-[#008080] stroke-2 transition-all duration-700 ${
                  isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: `${800 + index * 100}ms`,
                }}
                strokeDasharray="6 6"
              />

              {/* Step Circle with Number and Label */}
              <g
                className={`transition-all duration-700 ${
                  isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  transitionDelay: `${1000 + index * 100}ms`,
                }}
              >
                {/* Circle and Number */}
                <g transform={`translate(${outerX},${outerY})`}>
                  <g className="cursor-pointer">
                    <circle
                      r="36"
                      className="fill-[#008080] transition-colors duration-300 hover:fill-[#006666]"
                    />
                    <text
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      y="2"
                      className="fill-white text-3xl md:text-4xl font-bold pointer-events-none"
                    >
                      {index + 1}
                    </text>
                  </g>

                  {/* Label */}
                  <g
                    transform={`translate(0,${item.angle > 0 && item.angle < 180 ? 70 : -70})`}
                    className="pointer-events-none"
                  >
                    <rect
                      x="-100"
                      y="-40"
                      width="200"
                      height="70"
                      rx="8"
                      className="fill-white/95 stroke-[#008080]/20"
                    />
                    <text
                      textAnchor="middle"
                      className="text-lg md:text-xl font-bold fill-[#008080]"
                      y="-16"
                    >
                      {item.label}
                    </text>
                    <text textAnchor="middle" className="text-sm md:text-base fill-gray-500" y="16">
                      {item.desc}
                    </text>
                  </g>
                </g>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
