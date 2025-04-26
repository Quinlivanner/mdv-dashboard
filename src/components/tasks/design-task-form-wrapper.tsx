"use client"

import React, {useState} from "react"
import {DesignTaskFormStep1} from "./design-task-form-step1"
import {DesignTaskForm} from "./design-task-form"
import {Dialog} from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {useRouter} from "next/navigation"
import {toast} from "sonner"
import {createDesignTaskRequest} from "@/api/rad/api"
import {DesignTaskInfo} from "@/api/rad/types"
import {cn} from "@/lib/utils"

// 自定义对话框内容组件，增强动画效果
const SmoothDialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300"
    />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4 sm:p-6 shadow-lg rounded-lg",
        "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span className="sr-only">关闭</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
SmoothDialogContent.displayName = "SmoothDialogContent"

interface DesignTaskFormWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  useStepForm?: boolean // 是否使用分步骤表单
}

export function DesignTaskFormWrapper({ 
  open, 
  onOpenChange,
  useStepForm = false // 默认使用直接提交表单
}: DesignTaskFormWrapperProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const totalSteps = 1 // 目前只有一个步骤，后续可以增加
  
  // 处理表单提交
  const handleSubmit = (data: any) => {
  }
  
  // 处理最终提交
  const handleFinalSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      console.log("提交数据:", data)
      // 转换表单数据为API所需格式
      const designTaskData: DesignTaskInfo = {
        srf_code: data.srfCode,
        take_time: data.receiveDate, // 保持原始YYYY-MM-DD字符串格式
        plan_end_date: data.planEndDate || null, // 如果没有日期则传null
        priority: parseInt(data.priority),
        customer: parseInt(data.customerID),
        engineer: parseInt(data.projectDeveloperID),
        sales: parseInt(data.projectSalesID),
        sample_direction: parseInt(data.sampleDirectionID),
        project_background: data.projectBackground,
        special_requirements: data.specialRequirements,
        remark: data.remarks,
        sample_image: data.sample_image
      }
      
      console.log("提交数据:", designTaskData)
      
      // 调用API创建设计任务
      const response = await createDesignTaskRequest(designTaskData)
      
      if (response.code === 0) {
        // 显示成功消息
        toast.success("设计开发任务书已创建")
        
        // 关闭对话框
        onOpenChange(false)
        
        // 重置表单状态
        setFormData({})
        setStep(1)
        
        // 可选：导航到任务详情页面
        // router.push(`/dashboard/tasks/${response.data.id}`)
      } else {
        toast.error(`创建失败: ${response.msg}`)
      }
    } catch (error) {
      console.error("提交表单失败:", error)
      toast.error("创建失败，请重试")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // 渲染当前步骤
  const renderForm = () => {
    if (useStepForm) {
      switch (step) {
        case 1:
          return <DesignTaskFormStep1 
            onSubmit={handleSubmit} 
            defaultValues={formData} 
            isSubmitting={isSubmitting}
          />
        default:
          return null
      }
    } else {
      return <DesignTaskForm 
        onSubmit={handleSubmit} 
        defaultValues={formData} 
        isSubmitting={isSubmitting}
      />
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (isSubmitting) return // 提交中禁止关闭对话框
      onOpenChange(newOpen)
    }}>
      <SmoothDialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto mx-auto w-[95%] md:w-full">
        <div className="px-3 py-4 md:px-6">
          {/* 步骤指示器 - 为未来的多步骤表单做准备 */}
          {useStepForm && totalSteps > 1 && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i + 1 === step 
                        ? 'bg-primary' 
                        : i + 1 < step 
                          ? 'bg-primary/60' 
                          : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* 当前表单 */}
          {renderForm()}
        </div>
      </SmoothDialogContent>
    </Dialog>
  )
} 