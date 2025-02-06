import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 border-b bg-white z-50">
        <link rel="icon" type="image/png" href="/AET-favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/AET-favicon/favicon.svg" />
        <link rel="shortcut icon" href="/AET-favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/AET-favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/AET-favicon/site.webmanifest" />
        <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8 flex items-center">
          <Link href="/next-fce-form" className="flex-shrink-0">
            <Image
              src="/aet_e_logo.png"
              alt="AET"
              width={425}
              height={82}
              className="w-auto h-auto"
              priority={true}
            />
          </Link>
        </div>
      </header>
    </>
  )
}
