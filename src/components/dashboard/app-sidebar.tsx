"use client"

import * as React from "react"
import {
    IconCamera,
    IconDashboard,
    IconDatabaseLeak,
    IconDatabasePlus,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconInnerShadowTop,
    IconListDetails,
    IconUser,
    IconUserCheck,
    IconUserShield
} from "@tabler/icons-react"
import {NavStaff} from "@/components/dashboard/nav-staff"
import {NavMain} from "@/components/dashboard/nav-main"
import {NavUser} from "@/components/dashboard/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
  user: {
    name: "张三",
    email: "zhangsan@midea.com",
    avatar: "https://hips.hearstapps.com/hmg-prod/images/20-1598244753.jpg",
  },
  navMain: [
    {
      title: "商机总览",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "合同管理",
      url: "/dashboard/contracts",
      icon: IconListDetails,
    },
    {
      title: "客户管理",
      url: "/dashboard/customer",
      icon: IconUser,
    },
    {
      title: "下单管理",
      url: "/dashboard/orders",
      icon: IconDatabaseLeak,
    },
    {
      title: "维保管理",
      url: "/dashboard/maintenance",
      icon: IconDatabasePlus,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: IconSettings,
  //   },
  //   {
  //     title: "Get Help",
  //     url: "#",
  //     icon: IconHelp,
  //   },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: IconSearch,
  //   },
  // ],
  staff: [
    {
      name: "员工管理",
      url: "/dashboard",
      icon: IconUserCheck,
    },
    {
      name: "员工日志",
      url: "/dashboard",
      icon: IconUserShield,
    },
    {
      name: "员工档案",
      url: "/dashboard",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
              <div className="w-full h-10 flex items-center justify-center">
              <Image src="/linvol.png" alt="logo" width={240} height={240} />
              </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavStaff items={data.staff} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
