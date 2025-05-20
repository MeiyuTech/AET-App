import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
export default function DegreeEquivalencyToolPage() {
  return (
    <>
      <div
        className="relative min-h-[80vh] flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/Graduation-Students.jpg)' }}
      >
        {/* Card Container */}
        <Card className="relative z-20 mt-32 mb-8 bg-white/80 backdrop-blur-md px-8 py-10 flex flex-col items-center w-full max-w-2xl shadow-xl">
          <h1 className="text-4xl font-bold text-center mb-2">
            Degree Equivalency <span className="text-green-600">Tool</span>
          </h1>
          <p className="text-xl text-center mb-6 font-medium text-muted-foreground">
            See What Your Degree is Equivalent to in the U.S.
          </p>
          <Link href="/degree-equivalency-tool/application">
            <Button size="lg" className="text-lg px-8 py-2">
              Start Now
            </Button>
          </Link>
        </Card>

        {/* Bottom Text */}
        <div className="absolute bottom-0 left-0 w-full bg-[#0a2c4d] py-6 text-center text-white text-lg z-20">
          Use our tool to learn more about what your degree is comparable to in the U.S.
          <br />
          Not all degrees and institutions may be available.
        </div>
      </div>
    </>
  )
}
