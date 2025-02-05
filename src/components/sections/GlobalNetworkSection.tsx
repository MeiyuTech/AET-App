import Image from 'next/image'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { AnimatedElement } from '@/components/ui/animated-elements'

export function GlobalNetworkSection() {
  return (
    <section id="global-network" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">多时区团队协作</h2>
        <h3 className="text-2xl text-center mb-4">中美两岸一站式的全链路服务</h3>
        <p className="text-lg text-center mb-16">
          北京/常州/成都/武汉 - 洛杉矶/旧金山/迈阿密/波士顿/纽约
        </p>
        {/* World Map */}
        <div className="relative w-full aspect-[1.6/1] mb-16">
          <AnimatedElement
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/MeiyuGlobalNetwork.png"
              alt="Meiyu Global Network"
              fill
              className="object-cover transition-all duration-700 hover:scale-110"
            />
          </AnimatedElement>
        </div>

        {/* Office Locations Carousel */}
        <Carousel
          opts={{
            align: 'start',
            loop: true,
            autoplay: true,
            delay: 3000,
          }}
          className="w-full"
        >
          <Link href="/about-us/contact">
            <CarouselContent className="-ml-4">
              {[
                {
                  src: '/office-beijing.jpg',
                  alt: 'Office Beijing',
                  title: '中国-北京办公室',
                },
                {
                  src: '/office-irvine.jpg',
                  alt: 'Office Invine',
                  title: '美国-洛杉矶办公室',
                },
                {
                  src: '/office-sf.jpg',
                  alt: 'Office San Francisco',
                  title: '美国-旧金山办公室',
                },
                {
                  src: '/office-miami.jpg',
                  alt: 'Office Miami',
                  title: '美国-迈阿密办公室',
                },
                {
                  src: '/office-boston.jpg',
                  alt: 'Office Boston',
                  title: '美国-波士顿办公室',
                },
                {
                  src: '/office-chengdu.jpg',
                  alt: 'Office Chengdu',
                  title: '中国-成都办公室',
                },
                {
                  src: '/office-changzhou.jpg',
                  alt: 'Office Changzhou',
                  title: '中国-常州办公室',
                },
              ].map((office, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/3">
                  <div className="relative aspect-video rounded-lg overflow-hidden group">
                    <Image
                      src={office.src}
                      alt={office.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#008080] py-2 px-4">
                      <p className="text-center text-white">{office.title}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Link>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}
