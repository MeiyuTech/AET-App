// Global test setup, such as mocking global objects, adding custom matchers, etc.
import { vi } from 'vitest'

// Mock payload buildConfig function globally
vi.mock('payload', async () => {
  return {
    getPayload: vi.fn(),
    buildConfig: vi.fn().mockImplementation((config) => config),
  }
})

// Mock payload-config module
vi.mock('@payload-config', async () => {
  return {
    default: {}, // Return empty config object for tests
  }
})
