"use client"

import {useState} from "react"
import {DesignTaskFormWrapper} from "./design-task-form-wrapper"
import {IconCirclePlusFilled} from "@tabler/icons-react"
import {SidebarMenuButton} from "@/components/ui/sidebar"

export function DesignTaskDialog() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <SidebarMenuButton
        tooltip="快速创建"
        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
        onClick={() => setOpen(true)}
      >
        <IconCirclePlusFilled />
        <span>创建商机</span>
      </SidebarMenuButton>
      
      <DesignTaskFormWrapper open={open} onOpenChange={setOpen} />
    </>
  )
} 