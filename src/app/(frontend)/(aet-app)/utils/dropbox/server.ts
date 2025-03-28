import fetch from 'node-fetch'
import { Dropbox } from 'dropbox'

import { DROPBOX_TOKENS, TOKEN_REFRESH } from './config.server'

export async function getAccessToken(tokenType: 'AET_App' | 'AET_App_East') {
  const { refreshToken, appKey, appSecret } = DROPBOX_TOKENS[tokenType]

  try {
    const token = await refreshAccessToken(refreshToken, appKey, appSecret)
    console.log(`success to get access token (${tokenType})`)
    return token
  } catch (error) {
    console.error('failed to get access token:', error)
    throw error
  }
}

export async function refreshAccessToken(
  refreshToken: string | undefined,
  appKey: string | undefined,
  appSecret: string | undefined
) {
  try {
    if (!refreshToken || !appKey || !appSecret) {
      throw new Error(
        'Refresh token or app key or app secret is undefined: \n' +
          JSON.stringify({ refreshToken, appKey, appSecret })
      )
    }

    const response = await fetch(TOKEN_REFRESH.DROPBOX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        client_id: appKey,
        client_secret: appSecret,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`failed to refresh token: ${response.status} ${errorData}`)
    }

    const data = (await response.json()) as {
      access_token: string
      expires_in: number
      token_type: string
    }

    return data.access_token
  } catch (error) {
    console.error('failed to refresh access token:', error)
    throw error
  }
}

export function createDropboxClient(accessToken: string, namespaceId: string | null) {
  return new Dropbox({
    accessToken: accessToken,
    fetch: fetch,
    pathRoot: JSON.stringify({
      '.tag': 'namespace_id',
      namespace_id: namespaceId,
    }),
  })
}
