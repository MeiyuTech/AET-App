import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'AET Service, is an online platform for clients to get Reliable, Convenient and Affordable Translation Services and Credential Evaluations that make your life easy in USA',
  images: [
    {
      // url: `${getServerSideURL()}/website-template-OG.webp`,
      url: `${getServerSideURL()}/web-app-manifest-192x192.png`,
    },
  ],
  siteName: 'AET Service',
  title: 'AET Service',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
