import {StaffManagementList} from '@/components/staff-management'
import {Metadata} from 'next'

export const metadata: Metadata = {
  title: '客户管理',
  description: '管理客户信息',
}

export default function StaffManagementPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <StaffManagementList />
    </div>
  )
}