"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {Loader2} from "lucide-react"

// 复用CustomerList中的类型定义，或者在这里重新定义/导入
interface ExtendedCustomerInfo {
  index: string;
  name: string;
  phone?: string;
  address?: string;
  remark?: string;
  id?: number; // 保持与CustomerList一致
}

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: ExtendedCustomerInfo | null
  onConfirm: () => void
  isDeleting: boolean
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  customer,
  onConfirm,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  if (!customer) return null; // 如果没有客户信息，不渲染对话框

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除客户 "<strong>{customer.name}</strong>" (序列: {customer.index}) 吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                删除中...
              </>
            ) : (
              '确认删除'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 