"use client"

import {AppSidebar} from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation"

// 路径到标题的映射函数
function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    "/staff/management": "员工管理",
    "/staff/logs": "员工日志",
    "/staff/employee-files": "员工档案",
  }
  
  // 处理动态路由，如 /dashboard/design-tasks/[id]
  if (pathname.match(/^\/dashboard\/design-tasks\/[^\/]+$/)) {
    return "任务书详情"
  }
  
  // 处理客户管理
  if (pathname.match(/^\/dashboard\/customers\/[^\/]+$/)) {
    return "客户资产管理"
  }

  // 返回匹配的标题，如果没有匹配则返回默认标题
  return routes[pathname] || "仪表盘"
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
      <SiteHeader title={pageTitle} />
        <div className="flex flex-1 flex-col px-4 md:px-6">
          <div className="@container/main flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-4 py-4 md:gap-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}