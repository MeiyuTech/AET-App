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
  servicesDescription: string[],
  deliveryMethod: string,
  additionalServices: ('extra_copy' | 'pdf_with_hard_copy' | 'pdf_only')[],
  applicationId: string,
  submittedAt: string
): string => {
  // Format services and delivery times for display
  const servicesHtml = servicesDescription.map((service) => `<li>${service}</li>`).join('')

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
  const formattedSubmissionDate = new Date(submittedAt).toLocaleString()

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
          padding: 10px;
        }
        h1 {
          color: #333;
          font-size: 32px;
          margin-bottom: 16px;
        }
        h2 {
          color: #4b5563;
          font-size: 24px;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        p {
          font-size: 16px;
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
        .next-steps {
          background-color: #f3f4f6;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .next-steps ul {
          margin-top: 8px;
          margin-bottom: 8px;
        } 
        .button {
          display: inline-block;
          background-color: #3b82f6;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .button:hover {
          background-color: #2563eb;
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
          color: #3b82f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://app.americantranslationservice.com/_next/image?url=%2Faet_e_logo.png&w=640&q=75" alt="Logo">
        </div>
        <div class="content">
          <h1>Dear ${firstName} ${lastName}!</h1>
          <p>Thank you for submitting your application. We have received it successfully! Your application ID is <span class="application-id">${applicationId}</span>.</p>
          
          <div class="application-details">
            <h1>Application Summary</h1>

            <h2>Submission Time</h2>
            <ul>${formattedSubmissionDate}</ul>

            <h2>Services Requested</h2>
            <ul>${servicesHtml}</ul>
            
            <h2>Delivery Method</h2>
            <ul>${deliveryMethod}</ul>
            
            <h2>Additional Service</h2>
            <ul>${additionalServicesHtml}</ul>
          </div>

          <div class="next-steps">
            <h1>What's next?</h1>
            <p>1. Confirm your application by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}" class="button">Check your status</a>
            </div>

            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px;">${`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}</p>
          
            <p>2. Submit all required documents as specified in your application.</p>

            <p>3. We will begin processing your evaluation once payment is confirmed.</p>

          </div>
          
          
          
          <p><span style="color: #3b82f6;">If anything, please reply to this email thread with all of your questions.</span> We are looking forward to cooperating with you!</p>
          
          <p>Best Regards,<br>AET Team</p>
        </div>

        <div class="footer">
          <p>American Education and Translation Services 
          <br>
          © All rights reserved.</p>
          <br>
          <a href="https://www.americantranslationservice.com/english.html" target="_blank">americantranslationservice.com</a>
        </div>
      </div>
    </body>
  </html>
  `
}
