"use client"

import {useEffect, useState} from 'react'
import {CustomerBaseInfo} from '@/api/customer/types'
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Loader2} from 'lucide-react'

// 扩展的客户信息接口，包含所有字段
interface ExtendedCustomerInfo extends CustomerBaseInfo {
  phone?: string;
  address?: string;
  remark?: string;
  index?: string;
}

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: ExtendedCustomerInfo
  onSave: (customer: Partial<ExtendedCustomerInfo> & { index?: string }) => void
  title: string
  isSaving: boolean
}

export function CustomerDialog({
  open,
  onOpenChange,
  customer,
  onSave,
  title,
  isSaving,
}: CustomerDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    address: string;
    remark: string;
  }>({
    name: '',
    phone: '',
    address: '',
    remark: '',
  })

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
  }>({})

  // 当customer变化时更新表单数据
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        address: customer.address || '',
        remark: customer.remark || '',
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        address: '',
        remark: '',
      })
    }
    // 重置错误
    setErrors({})
  }, [customer, open])

  const validateForm = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '客户名称不能为空'
    }
    
    // 电话号码格式验证（可选）
    // if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
    //   newErrors.phone = '请输入有效的手机号码'
    // }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm() && !isSaving) {
      onSave({
        ...(customer?.index ? { index: customer.index } : {}),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        remark: formData.remark.trim(),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customer-name">
              客户名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入客户名称"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="customer-phone">
              联系电话
            </Label>
            <Input
              id="customer-phone"
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
            <Label htmlFor="customer-address">
              地址
            </Label>
            <Textarea
              id="customer-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="请输入地址"
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
            <Button variant="outline" disabled={isSaving}>取消</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSaving}>
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