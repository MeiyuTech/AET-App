import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    // console.log('SEARCH ROUTE: Request received')
    const { query, num = 3 } = await req.json()
    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }
    const apiKey = process.env.BRAVE_SEARCH_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Brave Search API key' }, { status: 500 })
    }
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${num}`
    // console.log('SEARCH ROUTE: Brave Search API URL:', url)
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': apiKey,
      },
    })

    // console.log('SEARCH ROUTE: Brave Search API response:', res)
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Brave Search API error', status: res.status },
        { status: 500 }
      )
    }
    const data = await res.json()
    console.log('SEARCH ROUTE: Search API data:', data)
    // Parse results, extract title and url
    const results = (data.web?.results || []).slice(0, num).map((item: any) => ({
      title: item.title,
      url: item.url,
    }))
    return NextResponse.json({ results })
  } catch (error) {
    console.error('SEARCH ROUTE: Search API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
