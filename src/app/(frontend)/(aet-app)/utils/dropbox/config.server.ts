// Dropbox configuration for different team spaces
export const DROPBOX_TOKENS = {
  AET_App: {
    refreshToken: process.env.DROPBOX_AET_App_REFRESH_TOKEN,
    appKey: process.env.DROPBOX_AET_App_KEY,
    appSecret: process.env.DROPBOX_AET_App_SECRET,
    namespaceId: process.env.DROPBOX_AET_App_NAMESPACE_ID,
    basePath: '/Team Files/WebsitesDev', // Base path for AET App
    LA_Path: '/Team Files/AET ALL Offices/AET Services/2-Foreign Credential Evaluation',
  },
  AET_App_East: {
    refreshToken: process.env.DROPBOX_AET_App_East_REFRESH_TOKEN,
    appKey: process.env.DROPBOX_AET_App_East_KEY,
    appSecret: process.env.DROPBOX_AET_App_East_SECRET,
    namespaceId: process.env.DROPBOX_AET_App_East_NAMESPACE_ID,
    basePath: '/WebsitesDev', // Base path for AET App East
  },
}

// Constants for token refresh
export const TOKEN_REFRESH = {
  DROPBOX_API_URL: 'https://api.dropbox.com/oauth2/token',
}

// Simplified token cache structure
export interface TokenCache {
  token: string
}

export const initialTokenCache: Record<string, TokenCache> = {
  AET_App: { token: '' },
  AET_App_East: { token: '' },
}
