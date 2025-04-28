"use client"

import {AppSidebar} from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation"

// 路径到标题的映射函数
function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    "/dashboard": "总览",
    "/dashboard/opportunity": "商机管理",
    "/dashboard/opportunity/[id]": "商机详情",
  }
  
  // 处理动态路由，如 /dashboard/design-tasks/[id]
  if (pathname.match(/^\/dashboard\/design-tasks\/[^\/]+$/)) {
    return "任务书详情"
  }
  
  // 处理客户管理
  if (pathname.match(/^\/dashboard\/customers\/[^\/]+$/)) {
    return "客户资产管理"
  }

  // 处理原材料管理
  if (pathname.match(/^\/dashboard\/opportunity\/[^\/]+$/)) {
    return "商机管理"
  }

  // 处理电梯选型 http://localhost:3000/dashboard/opportunity/1001/elevator-selection
  if (pathname.match(/^\/dashboard\/opportunity\/[^\/]+\/elevator-selection$/)) {
    return "电梯选型"
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}