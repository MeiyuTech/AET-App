/**
 * @description Email Config
 */

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  cc?: string | string[]
  bcc?: string | string[]
}

// Application Confirmation Email Template
export const ApplicationConfirmationEmailStyle = `
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
`

export const ApplicationConfirmationEmailHead = `
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Confirmation</title>
    ${ApplicationConfirmationEmailStyle}
  </head>
`

export const ApplicationConfirmationEmailFooter = `
  <div class="footer">
    <p>American Education and Translation Services 
    <br>
    © All rights reserved.</p>
    <br>
    <a href="https://www.americantranslationservice.com/english.html" target="_blank">americantranslationservice.com</a>
  </div>
`
