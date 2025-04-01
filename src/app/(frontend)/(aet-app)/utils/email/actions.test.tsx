import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendEmail } from './actions'
import { getPayload } from 'payload'

// Mock payload-config
vi.mock('@payload-config', () => {
  return {
    default: {},
  }
})

// Mock payload module
vi.mock('payload', () => ({
  getPayload: vi.fn(),
  buildConfig: vi.fn(),
}))

// Mock environment variables
const originalEnv = process.env

describe('Email Actions', () => {
  // Mock payload instance
  const mockSendEmail = vi.fn()
  const mockPayload = {
    sendEmail: mockSendEmail,
    auth: {},
    authStrategies: [],
    collections: [],
    config: {},
    db: {},
    email: {},
    endpoints: [],
    express: {},
    globals: [],
    local: {},
    logger: {},
    preferences: {},
    router: {},
    secret: '',
    telemetry: {},
    versions: {},
  }

  beforeEach(() => {
    // Setup environment variables before each test
    process.env = {
      ...originalEnv,
      RESEND_DEFAULT_FROM_ADDRESS: 'test@example.com',
      RESEND_DEFAULT_FROM_NAME: 'Test Sender',
      RESEND_DEFAULT_CC_ADDRESS: 'cc@example.com',
      RESEND_DEFAULT_BCC_ADDRESS: 'bcc@example.com',
    }

    // Reset mocks
    vi.clearAllMocks()

    // Setup the mock implementation
    //
    vi.mocked(getPayload).mockResolvedValue(mockPayload as unknown as import('payload').Payload)
    mockSendEmail.mockResolvedValue({ success: true })
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      // Arrange
      const emailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>',
      }

      // Act
      const result = await sendEmail(emailOptions)

      // Assert
      expect(getPayload).toHaveBeenCalled()
      expect(mockSendEmail).toHaveBeenCalledWith({
        from: 'Test Sender <test@example.com>',
        to: 'recipient@example.com',
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>',
      })
      expect(result).toEqual({ success: true, message: 'Email sent successfully' })
    })

    it('should use provided cc and bcc if available', async () => {
      // Arrange
      const emailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>',
        cc: 'custom-cc@example.com',
        bcc: 'custom-bcc@example.com',
      }

      // Act
      await sendEmail(emailOptions)

      // Assert
      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          cc: 'custom-cc@example.com',
          bcc: 'custom-bcc@example.com',
        })
      )
    })

    it('should throw error if RESEND_DEFAULT_FROM_ADDRESS is not set', async () => {
      // Arrange
      delete process.env.RESEND_DEFAULT_FROM_ADDRESS

      // Act & Assert
      await expect(
        sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('RESEND_DEFAULT_FROM_ADDRESS is not set')
    })

    it('should throw error if RESEND_DEFAULT_FROM_NAME is not set', async () => {
      // Arrange
      delete process.env.RESEND_DEFAULT_FROM_NAME

      // Act & Assert
      await expect(
        sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('RESEND_DEFAULT_FROM_NAME is not set')
    })

    it('should handle errors from payload.sendEmail', async () => {
      // Arrange
      const error = new Error('Failed to send email')
      mockSendEmail.mockRejectedValue(error)

      // Act & Assert
      await expect(
        sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('Failed to send email')
    })
  })
})
