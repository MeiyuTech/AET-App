'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '@/providers/Theme'

export function AnimatedTitle() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll({
    offset: ['start start', '80vh start'],
  })

  // Animation transforms
  const scale = useTransform(scrollYProgress, [0, 1], [12, 1])
  const y = useTransform(scrollYProgress, [0, 1], ['-100vh', '-40vh'])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Desktop Animated Title */}
      <div className="hidden md:block absolute inset-x-0 h-[80vh] pointer-events-none z-50">
        <motion.div
          className="flex h-screen items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-center w-screen px-4 origin-center"
            style={{
              scale,
              y,
              opacity,
            }}
          >
            <span
              className={`block text-8xl font-bold ${
                mounted ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-black'
              }`}
            >
              美域佳华
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Static Title */}
      <div className="md:hidden py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2
            className={`text-4xl font-bold text-center ${
              mounted ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-black'
            }`}
          >
            美域佳华
          </h2>
        </div>
      </div>
    </>
  )
}
