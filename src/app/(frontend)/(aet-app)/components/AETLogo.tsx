import Image from 'next/image'
import clsx from 'clsx'

type AETLogoProps = {
  className?: string
}

export function AETLogo({ className }: AETLogoProps) {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <Image
        src="/web-app-manifest-512x512.png"
        alt="American Education and Translation Services Logo"
        width={400}
        height={80}
        className="h-20 w-auto sm:h-20 lg:h-24"
        priority
      />
      <div className="hidden md:flex items-center gap-4">
        <div className="h-14 w-px bg-gray-400 lg:h-16" />
        <div className="text-left leading-tight flex flex-col">
          <div
            style={{
              color: '#bc271b',
              fontFamily: 'Merriweather, \"Times New Roman\", serif',
              fontWeight: 800,
              fontSize: '30px',
              lineHeight: '30px',
            }}
          >
            AET
          </div>
          <div
            className="hidden xl:block"
            style={{
              color: '#0C213F',
              fontFamily: 'Merriweather, \"Times New Roman\", serif',
              fontWeight: 700,
              fontSize: 'clamp(14px, 2.6vw, 18px)',
              lineHeight: 1.25,
            }}
          >
            <div>American Education &amp;</div>
            <div>Translation Services</div>
          </div>
        </div>
      </div>
    </div>
  )
}
