"use client"

import { DesignTaskForm } from "@/components/tasks/design-task-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CreateOpportunity() {
  const router = useRouter()

  return (
    <div className="container max-w-screen-lg mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">创建新商机</h1>
      </div>
      <DesignTaskForm />
    </div>
  )
} 