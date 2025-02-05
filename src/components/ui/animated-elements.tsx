'use client'

import { useEffect, useState, forwardRef, HTMLAttributes } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/cn'

// Animated number component
export function AnimatedNumber({ value }: { value: number }) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (inView) {
      // Animation duration
      const duration = 2000
      // Update interval
      const interval = 16
      // Number of steps
      const steps = duration / interval
      // Increment per step
      const increment = value / steps

      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, interval)

      return () => clearInterval(timer)
    } else {
      setCount(0)
    }
  }, [inView, value])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {new Intl.NumberFormat('en-US').format(count)}
    </motion.span>
  )
}

// Add style to props type
interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

// Animated card component
export function AnimatedCard({ children, className = '', style }: AnimatedCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // 提取 col-span 相关的类
  const colSpanClass = className.match(/col-span-\d+/)?.[0] || ''
  // 移除原始className中的 col-span 类，避免重复
  const otherClasses = className.replace(/col-span-\d+/, '').trim()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`w-full h-full ${colSpanClass}`} // 应用 col-span 到外层
      style={style}
    >
      <Card className={`w-full h-full ${otherClasses}`}>{children}</Card>
    </motion.div>
  )
}

// Animated progress component
export function AnimatedProgress({ value }: { value: number }) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="h-2 bg-[#008080]/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-[#008080] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: inView ? `${value}%` : '0%' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  )
}

// 添加一个新的动画组件，没有背景和边框
const AnimatedElementComponent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} className={cn('', props.className)} />
  }
)
AnimatedElementComponent.displayName = 'AnimatedElementComponent'

export const AnimatedElement = motion(AnimatedElementComponent)
