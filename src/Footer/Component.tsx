import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

// import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
// import { CMSLink } from '@/components/Link'

export async function Footer() {
  // const footerData: Footer = await getCachedGlobal('footer', 1)()

  // const navItems = footerData?.navItems || []
  return (
    <footer className="border-t border-border bg-black text-white">
      <div className="container py-12">
        {/* Top Bar with Theme Selector and CMS Links */}
        <div className="mb-12 flex flex-col items-end gap-4 md:flex-row md:justify-end md:items-center">
          {/* <nav className="flex flex-wrap gap-4">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink className="text-sm text-white/70 hover:text-white" key={i} {...link} />
              )
            })}
          </nav> */}
          <ThemeSelector />
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Company Info */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <div className={clsx('flex items-center gap-3')}>
                <Image
                  src="/favicon.svg"
                  alt="Meiyu Logo"
                  width={150}
                  height={100}
                  loading="lazy"
                  fetchPriority="low"
                  // className={clsx('max-w-[15rem] w-full h-[34px]', className)}
                  className={clsx('max-w-[15rem]')}
                />
                <span className="text-3xl font-medium w-[120px]">美域佳华</span>
              </div>
            </Link>
            <p className="text-sm text-white/70">
              美域佳华是您值得信赖的美国移民顾问，我们提供专业的投资移民、职业移民等服务，助您实现美国梦。
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-white/60">
              服务项目
            </h3>
            <nav className="grid gap-2">
              <Link
                href="/services/eb-5-investment"
                className="text-sm text-white/70 hover:text-white"
              >
                投资移民 (EB-5)
              </Link>
              <Link
                href="/posts/l-1-eb-1c-introduction"
                className="text-sm text-white/70 hover:text-white"
              >
                高管移民 (L-1/EB-1C)
              </Link>
              <Link
                href="/posts/family-based-immigration-introduction"
                className="text-sm text-white/70 hover:text-white"
              >
                家庭移民
              </Link>
              <Link
                href="/posts/f-1-introduction"
                className="text-sm text-white/70 hover:text-white"
              >
                留学服务 (F-1)
              </Link>
              <Link
                href="/posts/h-1b-introduction"
                className="text-sm text-white/70 hover:text-white"
              >
                工作签证 (H-1B)
              </Link>
            </nav>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-white/60">
              快速链接
            </h3>
            <nav className="grid gap-2">
              <Link href="/cases" className="text-sm text-white/70 hover:text-white">
                成功案例
              </Link>
              <Link href="/projects" className="text-sm text-white/70 hover:text-white">
                项目展示
              </Link>
              <Link href="/posts" className="text-sm text-white/70 hover:text-white">
                移民知识
              </Link>
              <Link href="/about-us" className="text-sm text-white/70 hover:text-white">
                关于我们
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-white/60">
              联系我们
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="h-5 w-5 shrink-0" />
                <p>19800 MacArthur Blvd Ste 420, Irvine CA 92612</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="h-5 w-5" />
                <div className="space-y-1">
                  <p>
                    中国直拨：
                    <a href="tel:167-6208-4336" className="hover:text-white">
                      167-6208-4336
                    </a>
                  </p>
                  <p>
                    美国电话：
                    <a href="tel:9499547996" className="hover:text-white">
                      (949)954-7996
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="h-5 w-5" />
                <a href="mailto:ca2@aet21.com" className="hover:text-white">
                  ca2@aet21.com
                </a>
              </div>
              <div className="text-sm text-white/70">
                <p>微信：LA9499547996</p>
                <p>周一至周五 当地时间: 9:30 AM - 5:30 PM (PST)</p>
              </div>
              <Link
                href="/about-us/contact"
                className="inline-block text-sm text-white/70 hover:text-white underline"
              >
                查看更多办公室
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/60 md:flex-row">
            <div className="flex flex-col md:flex-row md:gap-4">
              <p>© {new Date().getFullYear()} 美域集团. 保留所有权利.</p>
              {/* ICP 备案号： */}
              <Link
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                苏ICP备18052748号-5
              </Link>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">
                隐私政策
              </Link>
              <Link href="/terms" className="hover:text-white">
                服务条款
              </Link>
              <Link href="/sitemap.xml" className="hover:text-white">
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
