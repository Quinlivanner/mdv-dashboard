"use client"

import {useEffect, useState} from 'react'
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Loader2} from 'lucide-react'
import {SuppliersBaseInfo} from '@/api/suppliers/types'

// 扩展的客户信息接口，包含所有字段
interface ExtendedSupplierInfo extends SuppliersBaseInfo {
  phone?: string;
  email?: string;
  country?: string;
  remark?: string;
  index?: string;
}

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: ExtendedSupplierInfo
  onSave: (supplier: Partial<ExtendedSupplierInfo> & { index?: string }) => void
  title: string
  isSaving: boolean
}

export function SuppliersDialog({
  open,
  onOpenChange,
  supplier,
  onSave,
  title,
  isSaving,
}: SupplierDialogProps) {
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    country: string;
    remark: string;
  }>({
    name: '',
    phone: '',
    email: '',
    country: '',
    remark: '',
  })

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
  }>({})

  // 当customer变化时更新表单数据
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        country: supplier.country || '',
        remark: supplier.remark || '',
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        country: '',
        remark: '',
      })
    }
    // 重置错误
    setErrors({})
  }, [supplier, open])

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
        ...(supplier?.index ? { index: supplier.index } : {}),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        country: formData.country.trim(),
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
            <Label htmlFor="supplier-name">
              供应商名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supplier-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入供应商名称"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="supplier-phone">
              电话
            </Label>
            <Input
              id="supplier-phone"
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
            <Label htmlFor="supplier-email">
              邮箱
            </Label>
            <Textarea
              id="supplier-email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="请输入邮箱"
              className="resize-none h-14"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supplier-country">
              国家
            </Label>
            <Input
              id="supplier-country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="请输入国家"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="supplier-remark">
              备注
            </Label>
            <Textarea
              id="supplier-remark"
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