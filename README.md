# TODO:

- [ ] Add i18n and localization, which could help with the SEO and ToC (Table of Contents) in posts.
- [x] IMPROVE the sitemap!!!!
- [ ] Do we need ‘src/utilities/serialize.ts’? Try to find the build in function in Payload.
- [x] Create 'projects' and 'cases' pages, like Posts Page (or just add metadata('Related PAges' and 'Categories') for Pages? )
- [x] Which logo should we use? One is darker (witth text "美域佳华"), one's color looks better yet the bg is not perfectly deleted. 暂定为天蓝色。
- [x] Create a form and show the email resender, submission record.
- [x] AnimatedTitle disappears in mobile mode!!!
- [x] Theme selector shows layout mess in mobile mode!!!
- [x] 提供的图片没有背景，在黑色主题下文字看不清！！！ 和王艳沟通，让 潘总 zhangfeng 帮忙改 (changed the ImageMedia ‘style’, )
- [ ] Form is tricky, let them contact ppl first
- [ ] make all the links work
- [ ] add cases page
- [ ] 支持大文件的上传

# i18n and localization

1. Modify `payload.config.ts`

```typescript
i18n: {
    fallbackLanguage: 'en',
  },
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
```

2. And after that, it goes:

```bash
+ snapshot column will be created

+ published_locale column will be created
--- all columns conflicts in _posts_v table resolved ---


+ snapshot column will be created

+ published_locale column will be created
--- all columns conflicts in _pages_v table resolved ---

? Warnings detected during schema push:

· You're about to add not-null _locale column without default value, which contains 9 items
· You're about to delete meta_title column in pages table with 3 items
· You're about to delete meta_image_id column in pages table with 3 items
· You're about to delete meta_description column in pages table with 3 items
· You're about to delete meta_title column in posts table with 5 items
· You're about to delete meta_image_id column in posts table with 5 items
· You're about to delete meta_description column in posts table with 5 items
· You're about to delete subject column in forms_emails table with 1 items
· You're about to delete message column in forms_emails table with 1 items
· You're about to delete submit_button_label column in forms table with 1 items
· You're about to delete confirmation_message column in forms table with 1 items
· You're about to delete version_meta_title column in _posts_v table with 69 items
· You're about to delete version_meta_image_id column in _posts_v table with 69 items
· You're about to delete version_meta_description column in _posts_v table with 69 items
· You're about to delete version_meta_title column in _pages_v table with 43 items
· You're about to delete version_meta_image_id column in _pages_v table with 43 items
· You're about to delete version_meta_description column in _pages_v table with 43 items
· You're about to delete title column in search table with 5 items
· You're about to delete label column in forms_blocks_textarea table with 1 items
· You're about to delete default_value column in forms_blocks_textarea table with 1 items
· You're about to delete label column in forms_blocks_text table with 1 items
· You're about to delete default_value column in forms_blocks_text table with 1 items
· You're about to delete label column in forms_blocks_email table with 1 items
· You're about to delete label column in forms_blocks_number table with 1 items

DATA LOSS WARNING: Possible data loss detected if schema is pushed.

Accept warnings and push schema to database? › (y/N)
```

# Install Shadcn Sidebar

1. Modify `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.mjs",
    "css": "src/app/(frontend)/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/utilities"
  }
}
```

2. Modify `tailwind.config.mjs`
   Comment this part:

```typescript
typography: ({ theme }) => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
```

3. https://ui.shadcn.com/docs/components/sidebar#installation

# Github Workflow

[Github-Workflow.md](./Github-Workflow.md)

# Next.js Immigration Website

A modern immigration consulting website built with Next.js 14, Payload CMS, and Supabase. Features server-side rendering, dynamic content management, and responsive design.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **CMS**: Payload CMS
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend API
- **Deployment**: Vercel

## Key Features

- Server-side rendering
- Dynamic content management
- Responsive design
- Dark/Light theme support
- Email form submission
- SEO optimization
- Sitemap generation

## Important: Database Connection

### Supabase Connection Setup

When deploying to Vercel, you must use Supabase's Connection Pooler instead of Direct Connection. This is because:

1. Vercel's environment prioritizes IPv6
2. Supabase's Direct Connection may have IPv6 compatibility issues
3. Connection Pooler enforces IPv4 and provides better stability

#### Connection String Format:

❌ Don't use Direct Connection in production
DATABASE_URI=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

✅ Use Connection Pooler instead
DATABASE_URI=postgresql://postgres.xxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres

To find your Connection Pooler URL:

1. Go to Supabase Dashboard
2. Project Settings > Database
3. Connection Pooling section
4. Copy the Connection string

This setup ensures:

- IPv6/IPv4 compatibility
- Better connection management
- Improved stability
- Automatic connection handling

## Posts can't be published

1. e+1(without S3) works well. Is it because of S3?
2. seems like it is about localization and Related Posts and Categories?
