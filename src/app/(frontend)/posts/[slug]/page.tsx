import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { serialize } from '@/utilities/serialize'
import { TableOfContents } from '@/components/TableOfContents'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  const serialized = serialize(post.content)
  // console.log('Serialized content:', serialized)
  const headings = extractHeadings(serialized)

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <LivePreviewListener />

      <PostHero post={post} />

      {/* 三栏布局 */}
      <div className="container relative">
        <div className="grid grid-cols-1 xl:grid-cols-[240px,minmax(0,1fr),240px] gap-8">
          {/* 左侧边栏 - 预留 */}
          <div className="hidden xl:block">
            <div className="sticky top-32">{/* 这里可以放置其他导航或内容 */}</div>
          </div>

          {/* 中间文章内容 */}
          <div className="max-w-3xl mx-auto w-full">
            <RichText data={post.content} enableGutter={false} />
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <RelatedPosts
                className="mt-12 lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              />
            )}
          </div>

          {/* 右侧目录 */}
          <div className="hidden xl:block">
            <div className="sticky top-32 pt-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h4 className="font-medium mb-4 text-sm">目录</h4>
              <TableOfContents headings={headings} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

// 辅助函数：从 HTML 内容中提取标题
function extractHeadings(content: string): Array<{ level: number; id: string; text: string }> {
  // 先清理内容格式
  const cleanContent = content
    .replace(/\\n/g, '\n') // 替换转义的换行符
    .replace(/\\"/g, '"') // 替换转义的引号
    .replace(/\\'/g, "'") // 替换转义的单引号
    .replace(/\s+/g, ' ') // 合并多个空白字符
    .trim() // 移除首尾空白

  // 使用更简单的正则表达式，匹配 h1-h4 标签
  const matches = cleanContent.match(/<h[1-4].*?<\/h[1-4]>/g) || []

  // console.log('Original content:', content)
  // console.log('Cleaned content:', cleanContent)
  // console.log('Found headings:', matches)

  // 将匹配到的标题转换为所需格式，并过滤掉空标题
  return matches
    .map((match) => {
      // 提取级别 (1,2,3,4)
      const level = parseInt(match.charAt(2))
      // 提取 ID
      const id = match.match(/id="([^"]*)"/)?.[1] || ''
      // 提取文本（移除任何HTML标签）并清理空白
      const text = match.replace(/<[^>]*>/g, '').trim()

      // console.log('Processed heading:', { level, id, text })
      return { level, id, text }
    })
    .filter((heading) => heading.text !== '') // 过滤掉空标题
}
