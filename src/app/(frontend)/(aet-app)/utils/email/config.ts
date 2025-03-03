export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  cc?: string | string[]
  bcc?: string | string[]
}

export function getApplicationConfirmationEmailHTML(
  firstName: string,
  lastName: string,
  services: string[],
  deliveryTimes: string[],
  deliveryMethod: string,
  additionalServices: ('extra_copy' | 'pdf_with_hard_copy' | 'pdf_only')[],
  applicationId: string,
  submittedAt: string
): string {
  const submissionDate = new Date(submittedAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #7bc1f4;">Your AET Services Application Has Been Received</h1>
        <p>Dear ${firstName} ${lastName},</p>
        <p>We have received your application. Your application ID is: <strong style="color: #7bc1f4">${applicationId}</strong></p>
        <h2 style="color: #7bc1f4;">Submission Time:</h2>
        <table>
          <tr>
            <td>${submissionDate}</td>
          </tr>
        </table>
        <h2 style="color: #7bc1f4;">Services Requested:</h2>
        <table>
          ${services.map((service) => `<tr><td>${service}</td></tr>`).join('')}
        </table>
        <h2 style="color: #7bc1f4;">Expected Delivery Times:</h2>
        <table>
          ${deliveryTimes.map((time) => `<tr><td>${time}</td></tr>`).join('')}
        </table>
        <h2 style="color: #7bc1f4;">Additional Details:</h2>
        <table>
          <tr>
            <td>Delivery Method: ${deliveryMethod}</td>
          </tr>
          ${
            additionalServices.length > 0
              ? `<tr><td>Additional Services: ${additionalServices.join(', ')}</td></tr>`
              : ''
          }
        </table>
        <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0;">
          <h2 style="color: #7bc1f4;">Next Steps:</h2>
          <table>
            <tr>
              <td><a href="https://app.americantranslationservice.com/status?applicationId=${applicationId}">Check your status</a> with Application ID: <strong style="color: #7bc1f4">${applicationId}</strong></td>
            </tr>
            <tr>
              <td>Complete the payment process if you haven't already</td>
            </tr>
            <tr>
              <td>Submit all required documents as specified in your application</td>
            </tr>
            <tr>
              <td>We will begin processing your evaluation once payment is confirmed</td>
            </tr>
          </table>
        </div>
        <p>
          If you have any questions or need to provide additional information, please contact us and reference your application ID: 
          <strong style="color: #7bc1f4">${applicationId}</strong>
        </p>
        <p style="margin-top: 30px;">
          Best regards,<br>
          <span>AET Services Team</span>
        </p>
      </div>
    `
}
