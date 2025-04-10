import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Translation & Credential Evaluation Services, making your life easy in USA',
  images: [
    {
      // url: `${getServerSideURL()}/website-template-OG.webp`,
      url: `${getServerSideURL()}/golden-gate-bridge-view.jpg`,
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
