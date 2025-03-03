export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  cc?: string | string[]
  bcc?: string | string[]
}

export const getApplicationConfirmationEmailHTML = (
  firstName: string,
  lastName: string,
  services: string[],
  deliveryTimes: string[],
  deliveryMethod: string,
  additionalServices: ('extra_copy' | 'pdf_with_hard_copy' | 'pdf_only')[],
  applicationId: string,
  submittedAt: string
): string => {
  // Format services and delivery times for display
  const servicesHtml = services.map((service) => `<li>${service}</li>`).join('')
  const deliveryTimesHtml = deliveryTimes.map((time) => `<li>${time}</li>`).join('')

  // Format additional services for display
  const additionalServicesMap: Record<string, string> = {
    extra_copy: 'Extra Hard Copy',
    pdf_with_hard_copy: 'PDF with Hard Copy',
    pdf_only: 'PDF Only',
  }

  const additionalServicesHtml = additionalServices
    .map((service) => `<li>${additionalServicesMap[service] || service}</li>`)
    .join('')

  // Format date for display
  const formattedDate = new Date(submittedAt).toLocaleString()

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Confirmation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 24px;
        }
        .logo img {
          height: 60px;
          width: auto;
        }
        .content {
          padding: 20px;
        }
        h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 16px;
        }
        h2 {
          color: #4b5563;
          font-size: 18px;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        p {
          margin-bottom: 16px;
          color: #4b5563;
        }
        .application-details {
          background-color: #f3f4f6;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .application-details ul {
          margin-top: 8px;
          margin-bottom: 8px;
        }
        .button {
          display: inline-block;
          background-color: #e76f51;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #d85c3d;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .social-links {
          text-align: center;
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 8px;
        }
        .social-links img {
          width: 24px;
          height: 24px;
        }
        .contact {
          text-align: center;
          margin-bottom: 16px;
        }
        .contact a {
          color: #3b82f6;
          text-decoration: none;
        }
        .application-id {
          font-family: monospace;
          background-color: #e5e7eb;
          padding: 2px 6px;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://openweathermap.org/themes/openweathermap/assets/img/logo_white_cropped.png" alt="Logo">
        </div>
        <div class="content">
          <h1>Dear ${firstName} ${lastName}!</h1>
          <p>Thank you for submitting your application. We have received it successfully!</p>
          
          <div class="application-details">
            <h2>Application Summary</h2>
            <p><strong>Application ID:</strong> <span class="application-id">${applicationId}</span></p>
            <p><strong>Submitted:</strong> ${formattedDate}</p>
            
            <h2>Selected Services</h2>
            <ul>${servicesHtml}</ul>
            
            <h2>Delivery Times</h2>
            <ul>${deliveryTimesHtml}</ul>
            
            <h2>Delivery Method</h2>
            <p>${deliveryMethod}</p>
            
            <h2>Additional Services</h2>
            <ul>${additionalServicesHtml}</ul>
          </div>
          
          <p>Please confirm your application by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}" class="button">Check your status</a>
          </div>
          
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 12px;">${`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}</p>
          
          <p>For further technical questions and support, please contact us at <a href="mailto:info@openweathermap.org">info@openweathermap.org</a></p>
          
          <p>We are looking forward to cooperating with you!</p>
          
          <p>Best Regards,<br>The Team</p>
        </div>
        <div class="social-links">
          <a href="https://twitter.com" target="_blank"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/twitter.svg" alt="Twitter"></a>
          <a href="https://linkedin.com" target="_blank"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/linkedin.svg" alt="LinkedIn"></a>
          <a href="https://github.com" target="_blank"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/github.svg" alt="GitHub"></a>
          <a href="https://facebook.com" target="_blank"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/facebook.svg" alt="Facebook"></a>
        </div>
        <div class="footer">
          <p>© All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `
}
