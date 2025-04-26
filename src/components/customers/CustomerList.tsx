"use client"

import {useCallback, useEffect, useState} from 'react'
import {CustomerBaseInfo, CustomerOperation} from '@/api/customer/types'
import {
    createCustomerRequest,
    deleteCustomerRequest,
    getPaginatedCustomerListRequest,
    updateCustomerRequest
} from '@/api/customer/api'
import {CustomerTable} from './CustomerTable'
import {CustomerSearch} from './CustomerSearch'
import {CustomerDialog} from './CustomerDialog'
import {ConfirmDeleteDialog} from './ConfirmDeleteDialog'
import {toast} from 'sonner'
import {Loader2} from 'lucide-react'
import {useDebounce} from '@/hooks/use-debounce'

// 扩展的客户信息接口，用于前端展示
interface ExtendedCustomerInfo extends CustomerBaseInfo {
  index: string; // 序列
  phone?: string;
  address?: string;
  remark?: string;
}

export function CustomerList() {
  const [customers, setCustomers] = useState<ExtendedCustomerInfo[]>([])
  const [isLoading, setIsLoading] = useState(true) // 初始加载
  const [isSaving, setIsSaving] = useState(false) // 保存操作加载
  const [isDeleting, setIsDeleting] = useState(false) // 删除操作加载状态
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(16)
  
  // 对话框状态
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [currentCustomer, setCurrentCustomer] = useState<ExtendedCustomerInfo | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false) // 删除确认对话框状态
  const [customerToDelete, setCustomerToDelete] = useState<ExtendedCustomerInfo | null>(null) // 要删除的客户信息
  
  // 获取分页客户列表
  const fetchPaginatedCustomers = useCallback(async (page: number, search: string) => {
    setIsLoading(true) // 初始加载/翻页加载
    try {
      const response = await getPaginatedCustomerListRequest(page, pageSize, search)
      if (response.code === 0 && response.data) {
        const customersWithId = response.data.customers.map((cust, idx) => ({
          ...cust,
          id: idx + (page - 1) * pageSize
        }));
        setCustomers(customersWithId)
        setTotalPages(Math.max(1, Math.ceil(response.data.total / pageSize)))
      } else {
        toast.error(`获取客户列表失败: ${response.msg}`)
        setCustomers([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error("获取客户列表错误:", error)
      toast.error("获取客户列表失败，请稍后重试")
      setCustomers([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [pageSize])
  
  // 初始化加载和页面变化时加载数据
  useEffect(() => {
    fetchPaginatedCustomers(currentPage, debouncedSearchTerm)
  }, [currentPage, debouncedSearchTerm, fetchPaginatedCustomers])
  
  // 处理搜索输入变化
  const handleSearchInputChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) 
  }
  
  // 处理页面变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  // 打开新增客户对话框
  const handleAddClick = () => {
    setCurrentCustomer(undefined)
    setDialogTitle('新增客户')
    setDialogOpen(true)
  }
  
  // 打开编辑客户对话框
  const handleEditClick = (customer: ExtendedCustomerInfo) => {
    setCurrentCustomer(customer)
    setDialogTitle('编辑客户')
    setDialogOpen(true)
  }
  
  // 修改 handleDeleteClick 以打开确认对话框
  const handleDeleteClick = (customer: ExtendedCustomerInfo) => {
    setCustomerToDelete(customer)
    setIsDeleteDialogOpen(true)
  }
  
  // 新增 handleConfirmDelete 函数处理确认删除逻辑
  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    setIsDeleting(true)
    try {
      const response = await deleteCustomerRequest(customerToDelete.index)
      if (response.code === 0) {
        toast.success(`客户 "${customerToDelete.name}" 删除成功`)
        setIsDeleteDialogOpen(false)
        // 刷新列表，处理边界情况（删除的是当前页最后一条）
        if (customers.length === 1 && currentPage > 1) {
          // 如果删除的是当前页最后一条且不是第一页，跳转到前一页
          setCurrentPage(currentPage - 1)
        } else {
          // 否则刷新当前页
          fetchPaginatedCustomers(currentPage, debouncedSearchTerm)
        }
      } else {
        toast.error(`删除客户失败: ${response.msg}`)
        setIsDeleteDialogOpen(false) // 即使失败也关闭确认框
      }
    } catch (error) {
      console.error("删除客户错误:", error)
      toast.error("删除客户时发生错误，请稍后重试")
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
      setCustomerToDelete(null) // 清理状态
    }
  }
  
  // 处理保存客户
  const handleSaveCustomer = async (customerData: Partial<ExtendedCustomerInfo> & { index?: string }) => {
    setIsSaving(true)
    try {
      if (customerData.index) {
        // 编辑现有客户
        const updateData: CustomerOperation = {
          name: customerData.name || '',
          phone: customerData.phone || '',
          address: customerData.address || '',
          remark: customerData.remark || '',
        }
        
        const response = await updateCustomerRequest(customerData.index, updateData)
        
        if (response.code === 0 && response.data) {
          toast.success(`客户 "${response.data.name}" 更新成功`)
          // 更新本地状态
          setCustomers(prevCustomers => 
            prevCustomers.map(cust => 
              cust.index === customerData.index 
                ? { ...cust, ...response.data } // 使用返回的数据更新
                : cust
            )
          )
          setDialogOpen(false)
        } else {
          toast.error(`更新客户失败: ${response.msg}`)
        }
      } else {
        // 新增客户
        const createData: CustomerOperation = {
          name: customerData.name || '',
          phone: customerData.phone || '',
          address: customerData.address || '',
          remark: customerData.remark || '',
        }
        const response = await createCustomerRequest(createData)
        if (response.code === 0) {
          toast.success(`客户 "${createData.name}" 创建成功`)
          setDialogOpen(false)
          // 刷新列表到第一页
          if (currentPage === 1) {
            fetchPaginatedCustomers(1, debouncedSearchTerm)
          } else {
            setCurrentPage(1)
          }
        } else {
          toast.error(`创建客户失败: ${response.msg}`)
        }
      }
    } catch (error) {
      console.error("保存客户错误:", error)
      toast.error("保存客户时发生错误，请稍后重试")
    } finally {
      setIsSaving(false)
    }
  }

  // 显示全页面加载状态
  // 注意：只在没有搜索词且首次加载时显示全屏加载
  // 如果是带搜索词的加载或者翻页加载，使用表格内的加载状态
  if (isLoading && customers.length === 0 && !debouncedSearchTerm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">正在加载客户数据...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <CustomerSearch 
        onSearch={handleSearchInputChange} 
        onAddClick={handleAddClick} 
      />
      
      <CustomerTable 
        customers={customers} 
        isLoading={isLoading && customers.length === 0} 
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      
      <CustomerDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={currentCustomer}
        onSave={handleSaveCustomer}
        title={dialogTitle}
        isSaving={isSaving} // 传递 isSaving 状态
      />

      <ConfirmDeleteDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        customer={customerToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  )
} 