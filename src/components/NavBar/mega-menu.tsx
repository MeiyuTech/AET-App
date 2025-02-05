import Link from 'next/link'

interface MegaMenuWrapperProps {
  children: React.ReactNode
}

function MegaMenuWrapper({ children }: MegaMenuWrapperProps) {
  return (
    <div className="absolute left-0 right-0 top-full">
      <div className="absolute inset-0 bg-[#00808033] backdrop-blur-[12px]" />
      <div className="relative mega-menu-enter">
        <div className="container mx-auto grid grid-cols-3 gap-8 py-8 text-[15px] text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {children}
        </div>
      </div>
    </div>
  )
}

const linkStyles =
  'block text-[20px] font-medium text-white/80 hover:text-white transition-colors drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
const headingStyles =
  'mb-4 text-[14px] font-semibold uppercase tracking-wide text-white/60 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
const featureHeadingStyles =
  'text-[28px] font-semibold leading-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]'
export function ServiceMegaMenu() {
  return (
    <MegaMenuWrapper>
      <div>
        <h3 className={headingStyles}>
          <Link href="/services/eb-5-investment">投资移民 (EB-5)</Link>
        </h3>
        <div className="space-y-3">
          <Link href="/posts/eb-5-introduction" className={linkStyles}>
            政策介绍
          </Link>
          <Link href="/posts/eb-5-application" className={linkStyles}>
            申请条件
          </Link>
          <Link href="/posts/eb-5-application" className={linkStyles}>
            申请流程
          </Link>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>其他服务</h3>
        <div className="space-y-3">
          <Link href="/posts/family-based-immigration-introduction" className={linkStyles}>
            家庭移民
          </Link>
          <Link href="/posts/f-1-introduction" className={linkStyles}>
            学生签证 （F-1）
          </Link>
          <Link href="/posts/j-1-introduction" className={linkStyles}>
            访问学者 （J-1）
          </Link>
          <Link href="/posts/h-1b-introduction" className={linkStyles}>
            工作签证 （H-1B）
          </Link>
        </div>
      </div>

      <div>
        <h3 className={headingStyles}>在线评估</h3>
        <div className="space-y-4">
          <h4 className={featureHeadingStyles}>
            只需 10 分钟，
            <br />
            快速了解最适合您的移民项目。
          </h4>
          <Link
            href="/about-us/contact"
            className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white"
          >
            联系我们，立即评估
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>职业移民 (EB-1/2/3)</h3>
        <div className="space-y-3">
          <Link href="/posts/l-1-eb-1c-introduction" className={linkStyles}>
            高管移民 (L-1/EB-1C)
          </Link>
          <Link href="/posts/eb-23-introduction" className={linkStyles}>
            雇主担保移民 (EB-2/3)
          </Link>
        </div>
      </div>
    </MegaMenuWrapper>
  )
}

export function SuccessStoriesMegaMenu() {
  return (
    <MegaMenuWrapper>
      <div>
        <h3 className={headingStyles}>成功案例</h3>
        <div className="space-y-3">
          <a href="#" className={linkStyles}>
            投资移民案例
          </a>
          <a href="#" className={linkStyles}>
            职业移民案例
          </a>
          <a href="#" className={linkStyles}>
            家庭移民案例
          </a>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>客户反馈</h3>
        <div className="space-y-3">
          <a href="#" className={linkStyles}>
            服务评价
          </a>
          <a href="#" className={linkStyles}>
            客户推荐
          </a>
          <a href="#" className={linkStyles}>
            成功数据
          </a>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>了解更多</h3>
        <div className="space-y-4">
          <h4 className={featureHeadingStyles}>
            探索我们的成功故事，
            <br />
            了解客户如何实现移民梦想。
          </h4>
          <a
            href="#"
            className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white"
          >
            查看所有案例
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </MegaMenuWrapper>
  )
}

export function ProjectShowcaseMegaMenu() {
  return (
    <MegaMenuWrapper>
      <div>
        <h3 className={headingStyles}>当前投资项目</h3>
        <div className="space-y-3">
          <Link href="/projects/fedex" className={linkStyles}>
            联邦快递独立投资项目
            <div className="mt-1 text-xs text-white/60">全球物流巨头并肩，220+国家网络覆盖</div>
          </Link>
          <Link href="/projects/vegetarian-restaurant" className={linkStyles}>
            高级素食餐厅投资项目
            <div className="mt-1 text-xs text-white/60">20年餐饮经验团队，打造高端美食品牌</div>
          </Link>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>竣工项目</h3>
        <div className="space-y-3">
          <Link href="/projects/ucr-student-housing" className={linkStyles}>
            加州大学河滨分校公寓项目
            <div className="mt-1 text-xs text-white/60">优质学生住房，毗邻大型机场</div>
          </Link>
          <Link href="/projects/kindergarten" className={linkStyles}>
            橙县艺术幼儿园项目
            <div className="mt-1 text-xs text-white/60">EB-5认证教育投资，年利润324万美元</div>
          </Link>
          <Link href="/projects/fox-property" className={linkStyles}>
            福克斯物业开发项目
            <div className="mt-1 text-xs text-white/60">TEA区域优势显著，市场估值2000万美元</div>
          </Link>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>投资优势</h3>
        <div className="space-y-4">
          <h4 className={featureHeadingStyles}>
            精选优质投资项目，
            <br />
            确保资金安全与投资回报。
          </h4>
          <Link
            href="/projects#investment-projects"
            className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white"
          >
            了解更多项目
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </MegaMenuWrapper>
  )
}

export function ImmigrationResourcesMegaMenu() {
  return (
    <MegaMenuWrapper>
      <div>
        <h3 className={headingStyles}>移民百科</h3>
        <div className="space-y-3">
          <a href="#" className={linkStyles}>
            签证类别介绍
          </a>
          <a href="#" className={linkStyles}>
            申请流程指南
          </a>
          <a href="#" className={linkStyles}>
            材料清单
          </a>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>政策解析</h3>
        <div className="space-y-3">
          <a href="#" className={linkStyles}>
            最新政策动态
          </a>
          <a href="#" className={linkStyles}>
            政策影响分析
          </a>
          <a href="#" className={linkStyles}>
            常见问题解答
          </a>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>专业文章</h3>
        <div className="space-y-4">
          <h4 className={featureHeadingStyles}>
            深入了解美国移民，
            <br />
            获取最新资讯与专业指导。
          </h4>
          <Link
            href="/posts"
            className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white"
          >
            阅读更多
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </MegaMenuWrapper>
  )
}

export function AboutUsMegaMenu() {
  return (
    <MegaMenuWrapper>
      <div>
        <h3 className={headingStyles}>公司介绍</h3>
        <div className="space-y-3">
          <Link href="/about-us" className={linkStyles}>
            集团介绍
          </Link>
          <Link href="/about-us#vision-and-strategy" className={linkStyles}>
            愿景使命
          </Link>
          <Link href="/about-us#service-advantage" className={linkStyles}>
            服务优势
          </Link>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>专业团队</h3>
        <div className="space-y-3">
          <a href="#" className={linkStyles}>
            顾问团队
          </a>
          <Link href="/about-us/lawyers" className={linkStyles}>
            法律团队
          </Link>
          <a href="#" className={linkStyles}>
            合作伙伴
          </a>
        </div>
      </div>
      <div>
        <h3 className={headingStyles}>联系我们</h3>
        <div className="space-y-4">
          <h4 className={featureHeadingStyles}>
            专业团队随时为您服务，
            <br />
            开启您的移民之旅。
          </h4>
          <Link
            href="/about-us/contact"
            className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white"
          >
            预约咨询
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </MegaMenuWrapper>
  )
}
