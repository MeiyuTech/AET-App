import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TableScrollButtonsProps {
  onScrollLeft: () => void
  onScrollRight: () => void
}

/**
 * Component that renders the scroll buttons for a horizontally scrollable table
 * Displays left and right chevron buttons positioned absolutely on the sides
 */
export const TableScrollButtons = ({ onScrollLeft, onScrollRight }: TableScrollButtonsProps) => {
  return (
    <>
      {/* Left scroll button */}
      <div className="absolute left-8 top-0 h-12 flex items-center z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md bg-white/80 hover:bg-white"
          onClick={onScrollLeft}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Right scroll button */}
      <div className="absolute right-0 top-0 h-12 flex items-center z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md bg-white/80 hover:bg-white"
          onClick={onScrollRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </>
  )
}
