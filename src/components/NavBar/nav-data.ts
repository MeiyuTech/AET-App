export interface NavItem {
  title: string
  href?: string
  items?: {
    title: string
    href?: string
    description?: string
    items?: {
      title: string
      href: string
      description?: string
    }[]
  }[]
}

export const navigationData: NavItem[] = [
  {
    title: '移民服务',
    items: [
      {
        title: '投资移民 (EB-5)',
        href: '/services/eb-5-investment',
        items: [
          { title: '政策介绍', href: '/posts/eb-5-introduction' },
          { title: '申请条件', href: '/posts/eb-5-application' },
          { title: '申请流程', href: '/posts/eb-5-application' },
        ],
      },
      {
        title: '职业移民 (EB-1/2/3)',
        items: [
          { title: '高管移民 (L-1/EB-1C)', href: '/posts/l-1-eb-1c-introduction' },
          { title: '雇主担保移民 (EB-2/3)', href: '/posts/eb-23-introduction' },
        ],
      },
      {
        title: '其他服务',
        items: [
          { title: '家庭移民', href: '/posts/family-based-immigration-introduction' },
          { title: '学生签证 （F-1）', href: '/posts/f-1-introduction' },
          { title: '访问学者 （J-1）', href: '/posts/j-1-introduction' },
          { title: '工作签证 （H-1B）', href: '/posts/h-1b-introduction' },
        ],
      },
      {
        title: '在线评估',
        description: '只需 10 分钟，快速了解最适合您的移民项目。',
        items: [
          {
            title: '联系我们，立即评估',
            href: '/about-us/contact',
            description: '专业顾问为您提供免费咨询服务',
          },
        ],
      },
    ],
  },
  {
    title: '成功案例',
    items: [
      {
        title: '成功案例',
        items: [
          { title: '投资移民案例', href: '/cases/investment' },
          { title: '职业移民案例', href: '/cases/employment' },
          { title: '家庭移民案例', href: '/cases/family' },
        ],
      },
      {
        title: '客户反馈',
        items: [
          { title: '服务评价', href: '/testimonials/service-reviews' },
          { title: '客户推荐', href: '/testimonials/client-recommendations' },
          { title: '成功数据', href: '/testimonials/success-metrics' },
        ],
      },
      {
        title: '了解更多',
        description: '探索我们的成功故事，了解客户如何实现移民梦想。',
        items: [
          {
            title: '查看所有案例',
            href: '/cases',
            description: '深入了解我们的成功案例',
          },
        ],
      },
    ],
  },
  {
    title: '项目展示',
    items: [
      {
        title: '当前投资项目',
        items: [
          {
            title: '联邦快递独立投资项目',
            href: '/projects/fedex',
            description: '全球物流巨头并肩，220+国家网络覆盖',
          },
          {
            title: '高级素食餐厅投资项目',
            href: '/projects/vegetarian-restaurant',
            description: '20年餐饮经验团队，打造高端美食品牌',
          },
        ],
      },
      {
        title: '竣工项目',
        items: [
          {
            title: '加州大学河滨分校公寓项目',
            href: '/projects/ucr-student-housing',
            description: '优质学生住房，毗邻大型机场',
          },
          {
            title: '橙县艺术幼儿园项目',
            href: '/projects/kindergarten',
            description: 'EB-5认证教育投资，年利润324万美元',
          },
          {
            title: '福克斯物业开发项目',
            href: '/projects/fox-property',
            description: 'TEA区域优势显著，市场估值2000万美元',
          },
        ],
      },
      {
        title: '了解更多',
        description: '精选优质投资项目，确保资金安全与投资回报。',
        items: [
          {
            title: '了解更多项目',
            href: '/projects#investment-projects',
            description: '探索更多投资机会',
          },
        ],
      },
    ],
  },
  {
    title: '移民知识',
    items: [
      {
        title: '移民百科',
        items: [
          { title: '签证类别介绍', href: '/' },
          { title: '申请流程指南', href: '/' },
          { title: '材料清单', href: '/' },
        ],
      },
      {
        title: '政策解析',
        items: [
          { title: '最新政策动态', href: '/' },
          { title: '政策影响分析', href: '/' },
          { title: '常见问题解答', href: '/' },
        ],
      },
      {
        title: '专业文章',
        description: '深入了解美国移民，获取最新资讯与专业指导。',
        items: [
          {
            title: '阅读更多',
            href: '/posts',
            description: '浏览更多移民知识文章',
          },
        ],
      },
    ],
  },
  {
    title: '关于我们',
    items: [
      {
        title: '公司介绍',
        items: [
          { title: '集团介绍', href: '/about-us' },
          { title: '愿景使命', href: '/about-us#vision-and-strategy' },
          { title: '服务优势', href: '/about-us#service-advantage' },
        ],
      },
      {
        title: '专业团队',
        items: [
          { title: '顾问团队', href: '/about-us/consultants' },
          { title: '法律团队', href: '/about-us/lawyers' },
          { title: '合作伙伴', href: '/about-us/partners' },
        ],
      },
      {
        title: '联系我们',
        description: '专业团队随时为您服务，开启您的移民之旅。',
        items: [
          {
            title: '预约咨询',
            href: '/about-us/contact',
            description: '获取专业的移民咨询服务',
          },
        ],
      },
    ],
  },
]
