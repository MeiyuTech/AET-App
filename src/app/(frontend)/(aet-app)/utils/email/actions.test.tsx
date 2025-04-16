import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { resendEmail, getApplicationConfirmationEmailHTML } from './actions'
import { getPayload } from 'payload'
import { render } from '@react-email/render'
import { ApplicationConfirmationEmail } from 'emails/templates/ApplicationConfirmation/ApplicationConfirmationEmail'
import { ApplicationData } from '../../components/FCEApplicationForm/types'
import { EmailOptions } from './config'
import React from 'react'

// Mock dependencies
vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

vi.mock('@react-email/render', () => ({
  render: vi.fn().mockReturnValue('<div>Mocked HTML</div>'),
}))

vi.mock('emails', () => ({
  ApplicationConfirmationEmail: vi.fn().mockImplementation(() => null),
}))

describe('Email Actions', () => {
  // Store original environment variables
  const originalEnv = { ...process.env }

  // Mock payload instance
  const mockPayload = {
    sendEmail: vi.fn().mockResolvedValue({ success: true }),
  }

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()

    // Set up environment variables for testing
    process.env.RESEND_DEFAULT_FROM_ADDRESS = 'test@example.com'
    process.env.RESEND_DEFAULT_FROM_NAME = 'Test Sender'
    process.env.RESEND_DEFAULT_CC_ADDRESS = 'cc@example.com'
    process.env.RESEND_DEFAULT_BCC_ADDRESS = 'bcc@example.com'

    // Mock getPayload to return our mock payload instance
    vi.mocked(getPayload).mockResolvedValue(mockPayload as any)
  })

  afterEach(() => {
    // Restore original environment variables
    process.env = { ...originalEnv }
  })

  describe('resendEmail', () => {
    it('should send an email successfully', async () => {
      // Arrange
      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      }

      // Act
      const result = await resendEmail(emailOptions)

      // Assert
      expect(getPayload).toHaveBeenCalled()
      expect(mockPayload.sendEmail).toHaveBeenCalledWith({
        from: 'Test Sender <test@example.com>',
        to: 'recipient@example.com',
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      })
      expect(result).toEqual({ success: true, message: 'Email sent successfully' })
    })

    it('should use provided cc and bcc addresses when specified', async () => {
      // Arrange
      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        cc: 'custom-cc@example.com',
        bcc: 'custom-bcc@example.com',
      }

      // Act
      await resendEmail(emailOptions)

      // Assert
      expect(mockPayload.sendEmail).toHaveBeenCalledWith({
        from: 'Test Sender <test@example.com>',
        to: 'recipient@example.com',
        cc: 'custom-cc@example.com',
        bcc: 'custom-bcc@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      })
    })

    it('should throw an error when RESEND_DEFAULT_FROM_ADDRESS is not set', async () => {
      // Arrange
      process.env.RESEND_DEFAULT_FROM_ADDRESS = undefined
      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      }

      // Act & Assert
      await expect(resendEmail(emailOptions)).rejects.toThrow(
        'RESEND_DEFAULT_FROM_ADDRESS is not set'
      )
    })

    it('should throw an error when RESEND_DEFAULT_FROM_NAME is not set', async () => {
      // Arrange
      process.env.RESEND_DEFAULT_FROM_NAME = undefined
      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      }

      // Act & Assert
      await expect(resendEmail(emailOptions)).rejects.toThrow('RESEND_DEFAULT_FROM_NAME is not set')
    })

    it('should handle errors from payload.sendEmail', async () => {
      // Arrange
      const error = new Error('Email sending failed')
      mockPayload.sendEmail.mockRejectedValueOnce(error)

      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      }

      // Act & Assert
      await expect(resendEmail(emailOptions)).rejects.toThrow('Email sending failed')
    })
  })

  describe('getApplicationConfirmationEmailHTML', () => {
    it('should generate HTML for application confirmation email', async () => {
      // Arrange
      const applicationId = 'test-123'
      const application: ApplicationData = {
        firstName: 'John',
        lastName: 'Doe',
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        due_amount: 100,
        payment_status: 'pending',
        payment_id: null,
        paid_at: null,
        additionalServices: ['pdf_only'],
        additionalServicesQuantity: {
          extra_copy: 0,
          pdf_with_hard_copy: 0,
          pdf_only: 1,
        },
      }

      // Create a spy on React.createElement
      const createElementSpy = vi.spyOn(React, 'createElement')

      // Act
      const result = await getApplicationConfirmationEmailHTML(
        applicationId,
        application,
        'https://app.americantranslationservice.com/status?applicationId=test-123'
      )

      // Assert
      // Check that React.createElement was called with the correct arguments
      expect(createElementSpy).toHaveBeenCalledWith(ApplicationConfirmationEmail, {
        applicationId,
        application,
      })

      // Check that render was called and returned the expected result
      expect(render).toHaveBeenCalled()
      expect(result).toBe('<div>Mocked HTML</div>')

      // Restore the spy
      createElementSpy.mockRestore()
    })
  })
})
