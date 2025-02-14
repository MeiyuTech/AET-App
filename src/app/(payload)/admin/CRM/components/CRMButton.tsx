import React from 'react'
import Link from 'next/link'
import './style.css'

const CRMButton: React.FC = () => {
  return (
    <div className="crm-button">
      <Link href="/admin/CRM" className="crm-link">
        CRM
      </Link>
    </div>
  )
}

export default CRMButton
