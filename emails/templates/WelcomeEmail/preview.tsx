import * as React from 'react'
import WelcomeEmail from './WelcomeEmail'

// 预览数据
const previewData = {
  firstName: 'John',
  lastName: 'Doe',
  loginUrl: 'https://app.americantranslationservice.com/login',
}

// 导出预览组件
export default function Preview() {
  return (
    <WelcomeEmail
      firstName={previewData.firstName}
      lastName={previewData.lastName}
      loginUrl={previewData.loginUrl}
    />
  )
}
