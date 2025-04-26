"use client"

import {useEffect, useState} from 'react'
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Loader2} from 'lucide-react'
import {ExtendedRawMaterialInfo, RequestRawMaterialInfo, SuppliersBaseInfo} from '@/api/suppliers/types'
import {FormSearchSelectField} from '../share/form/simple-form'
import {getSupplierSelectListRequest} from '@/api/suppliers/api'
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"

// 扩展的客户信息接口，包含所有字段

interface RawMaterialsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  raw_material?: ExtendedRawMaterialInfo
  onSave: (raw_material: Partial<RequestRawMaterialInfo> & { index?: string }) => void
  title: string
  isSaving: boolean
}

export function RawMaterialsDialog({
  open,
  onOpenChange,
  raw_material,
  onSave,
  title,
  isSaving,
}: RawMaterialsDialogProps) {
  // 部分状态依然使用 useState 管理
  const [suppliers, setSuppliers] = useState<SuppliersBaseInfo[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<SuppliersBaseInfo[]>([])

  // 使用 React Hook Form
  const form = useForm({
    defaultValues: {
      name: '',
      supplier: '',
      scientific_name: '',
      internal_number: '',
      unit: '',
      molecular_formula: '',
      description: '',
    }
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await getSupplierSelectListRequest()
      setSuppliers(response.data)
      setFilteredSuppliers(response.data)
    }
    fetchSuppliers()
  }, [])


  // 当raw_material变化时更新表单数据
  useEffect(() => {
    if (raw_material) {
      console.log('raw_material=>', raw_material)
      form.reset({
        name: raw_material.name || '',
        supplier: raw_material.supplier?.id.toString() || '',
        scientific_name: raw_material.scientific_name || '',
        internal_number: raw_material.internal_number || '',
        unit: raw_material.unit || '',
        molecular_formula: raw_material.molecular_formula || '',
        description: raw_material.description || '',
      })
    } else {
      form.reset({
        name: '',
        supplier: '',
        scientific_name: '',
        internal_number: '',
        unit: '',
        molecular_formula: '',
        description: '',
      })
    }
  }, [raw_material, open, form])

  const onSubmit = (data: any) => {
    if (!isSaving) {
      onSave({
        ...(raw_material?.index ? { index: raw_material.index } : {}),
        name: data.name.trim(),
        supplier: data.supplier,
        scientific_name: data.scientific_name.trim(),
        internal_number: data.internal_number.trim(),
        unit: data.unit.trim(),
        molecular_formula: data.molecular_formula.trim(),
        description: data.description.trim(),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>
                    原材料名称 <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入原材料名称"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormSearchSelectField 
              label="供应商"
              form={form}
              name="supplier"
              isLoading={false}
              filteredItems={filteredSuppliers}
            />

            <FormField
              control={form.control}
              name="scientific_name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>材料学名</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入材料学名"
                      className="resize-none h-14"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internal_number"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>内部编号</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入内部编号"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>单位</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入单位"
                      className="resize-none h-14"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="molecular_formula"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>分子式</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入分子式"
                      className="resize-none h-14"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入描述"
                      className="resize-none h-14"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <DialogFooter className="gap-2 sm:gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline" disabled={isSaving} type="button">取消</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 