"use client"

import {useEffect, useState} from 'react'
import {CustomerEmployee} from '@/api/customer/types'
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Loader2} from 'lucide-react'


interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: CustomerEmployee
  onSave: (employee: Partial<CustomerEmployee> & { index?: string }) => void
  title: string
  isSaving: boolean
}

export function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSave,
  title,
  isSaving,
}: EmployeeDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    remark: string;
  }>({
    name: '',
    phone: '',
    email: '',
    remark: '',
  })

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
  }>({})

  // 当employee变化时更新表单数据
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        phone: employee.phone || '',
        email: employee.email || '',
        remark: employee.remark || '',
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        remark: '',
      })
    }
    // 重置错误
    setErrors({})
  }, [employee, open])

  const validateForm = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = '员工姓名不能为空'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm() && !isSaving) {
      onSave({
        ...(employee?.index ? { index: employee.index } : {}),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        remark: formData.remark.trim(),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="employee-name">
              员工姓名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="employee-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入员工姓名"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="employee-phone">
              联系电话
            </Label>
            <Input
              id="employee-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入联系电话"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="employee-email">
              邮箱
            </Label>
            <Textarea
              id="employee-email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="请输入邮箱"
              className="resize-none h-14"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="customer-remark">
              备注
            </Label>
            <Textarea
              id="customer-remark"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              placeholder="请输入备注信息"
              className="resize-none h-34"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto" variant="outline" disabled={isSaving}>取消</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 