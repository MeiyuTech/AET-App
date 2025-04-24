/**
 * Custom hook for handling horizontal scrolling in the ApplicationsTable
 * This hook provides smooth scrolling functionality for wide tables
 */

import { RefObject } from 'react'

/**
 * Hook for managing table horizontal scrolling
 * @param containerRef - Reference to the scrollable container element
 * @returns Object containing scroll handler functions
 */
export const useTableScroll = (containerRef: RefObject<HTMLDivElement | null>) => {
  /**
   * Calculate the scroll distance based on container width
   * Subtracting a small offset to ensure partial visibility of next/previous content
   */
  const getScrollDistance = () => {
    if (!containerRef.current) return 0
    return containerRef.current.clientWidth - 50
  }

  /**
   * Handle scrolling to the left
   * Ensures smooth scrolling and prevents scrolling past the start
   */
  const handleScrollLeft = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollDistance = getScrollDistance()

    const newScrollPosition = Math.max(0, container.scrollLeft - scrollDistance)
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    })
  }

  /**
   * Handle scrolling to the right
   * Ensures smooth scrolling and prevents scrolling past the end
   */
  const handleScrollRight = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollDistance = getScrollDistance()

    const maxScroll = container.scrollWidth - container.clientWidth
    const newScrollPosition = Math.min(maxScroll, container.scrollLeft + scrollDistance)
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    })
  }

  return {
    handleScrollLeft,
    handleScrollRight,
  }
}
