// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { heartbeats, contactSubmissions, fceApplications, fceEducations } from '../drizzle/schema'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from '@/utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
      // Override the icon and logo for the Admin Panel
      graphics: {
        Icon: '@/components/IconMeiyu',
        Logo: '@/components/LogoMeiyu/Logo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    // Override the *icon* and *title suffix* in the browser tab for the Admin Panel
    meta: {
      titleSuffix: ' - Meiyu CMS',
      icons: [
        {
          fetchPriority: 'high',
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.svg',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          url: '/favicon-96x96.png',
        },
        {
          rel: 'shortcut icon',
          url: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          url: '/apple-touch-icon.png',
        },
        {
          rel: 'manifest',
          url: '/site.webmanifest',
        },
      ],
    },
  },
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    beforeSchemaInit: [
      ({ schema, adapter }) => {
        return {
          ...schema,
          tables: {
            ...schema.tables,
            heartbeats,
            contactSubmissions,
            fceApplications,
            fceEducations,
          },
        }
      },
    ],
  }),
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // email: nodemailerAdapter({
  //   defaultFromAddress: process.env.SMTP_USER as string,
  //   defaultFromName: process.env.SMTP_DEFAULT_FROM_NAME as string,
  //   transportOptions: {
  //     host: process.env.SMTP_HOST,
  //     port: parseInt(process.env.SMTP_PORT as string),
  //     secure: process.env.SMTP_SECURE === 'true',
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   },
  // }),
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_DEFAULT_FROM_ADDRESS as string,
    defaultFromName: process.env.RESEND_DEFAULT_FROM_NAME as string,
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  globals: [Header, Footer],
  localization: {
    locales: [
      {
        label: {
          en: 'English',
          zh: '英文',
        },
        code: 'en',
      },
      {
        label: {
          en: 'Chinese',
          zh: '中文',
        },
        code: 'zh',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    ...plugins,
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET as string,
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        // ... Other S3 configuration
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
