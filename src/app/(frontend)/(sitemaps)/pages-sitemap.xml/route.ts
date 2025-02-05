import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const defaultSitemap = [
      {
        loc: `${SITE_URL}/search`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/posts`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/about-us`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/about-us/contact`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/about-us/lawyers`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/privacy`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/projects`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/projects/fedex`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/projects/fox-property`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/projects/kindergarten`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/projects/ucr-student-housing`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/projects/vegetarian-restaurant`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/services/eb-5-investment`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/services/h-1b-recruitment`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/terms`,
        lastmod: dateFallback,
      },
    ]

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            return {
              loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
              lastmod: page.updatedAt || dateFallback,
            }
          })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  }
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
