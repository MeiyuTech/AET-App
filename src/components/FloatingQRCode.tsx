'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export const FloatingQRCode = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <motion.button
              onClick={scrollToTop}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-primary/80 text-white shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WeChat QR Code button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-primary/80 text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </motion.div>

          {/* QR Code popup */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-16 right-0 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-xl"
              >
                <div className="relative h-48 w-48">
                  <Image
                    src="/wechat-QR-Code.png"
                    alt="WeChat QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                  扫码添加客服微信
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
