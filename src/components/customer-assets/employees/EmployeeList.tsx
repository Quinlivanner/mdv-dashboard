"use client"

import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Edit, Eye, Trash2} from 'lucide-react'
import {useIsMobile} from '@/hooks/use-mobile'
import {CustomerEmployee} from '@/api/customer/types'
import {
    createEmployeeRequest,
    deleteEmployeeRequest,
    getPaginatedCustomerEmployeeListRequest,
    updateEmployeeRequest
} from '@/api/customer/api'
import {PaginationControls} from '@/components/share/pagination'
import {EmployeeSearch} from './EmployeeSearch'
import {EmployeeDialog} from './EmployeeDialog'
import {toast} from 'sonner'
import {EmployeeDetailDialog} from './EmployeeDetailDialog'
import {ConfirmDeleteDialog} from './ConfirmDeleteDialog'

interface CustomerEmployeeListProps {
  customerIndex:string
  onCustomerNameChange: (name:string) => void
}



export function CustomerEmployeeList({ customerIndex, onCustomerNameChange }: CustomerEmployeeListProps) {
  const [employees, setEmployees] = useState<CustomerEmployee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [editEmployee, setEditEmployee] = useState<CustomerEmployee | null>(null);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<CustomerEmployee | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState<CustomerEmployee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      const response = await getPaginatedCustomerEmployeeListRequest(customerIndex, currentPage, 10, searchTerm)
      if (response.code === 0 && response.data) {
        setEmployees(response.data.employees)
        onCustomerNameChange(response.data.customer.name)
        setCurrentPage(response.data.page)
        setTotalPages(response.data.total_pages)
      } else {
        toast.error("获取客户员工列表失败:" + response.msg)
      }
    } catch (error) {
      console.error("获取客户员工列表错误:", error)
      toast.error("获取客户员工列表错误:" + error)
    } finally {
      setIsLoading(false)
    }
  }

  // 获取员工列表
  useEffect(() => {
    fetchEmployees()
  }, [currentPage, searchTerm])

  // 刷新 dialog数据状态
  useEffect(() => {
    if (!isDialogOpen) {
      setEditEmployee(null)
    }
  }, [isDialogOpen])

  const onPageChange = async (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    setCurrentPage(1) 
    
  }

  const handleViewEmployee = (employee: CustomerEmployee) => {
    setDetailEmployee(employee)
    setIsDetailDialogOpen(true)
  }

  const handleAddEmployee = () => {
    setIsDialogOpen(true)
  }

  const handleEditEmployee = (employee: CustomerEmployee) => {
    console.log('Edit employee:', employee)
    setEditEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDeleteEmployee = (employee: CustomerEmployee) => {
    setDeleteEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    if (!deleteEmployee || !deleteEmployee.index) return;
    const response = await deleteEmployeeRequest(deleteEmployee.index)
    if (response.code === 0) {
      setIsDeleteDialogOpen(false)
      fetchEmployees()
      toast.success(`${deleteEmployee.name} 删除成功`)
    } else {
      toast.error(`${deleteEmployee.name} 删除失败: ${response.msg}`)
    }
    setIsDeleting(false)
    return
  }
  

  // add or update employee
  const handleSaveEmployee = async (employee: Partial<CustomerEmployee> & { index?: string }) => {
    if (employee.index) {
      const response = await updateEmployeeRequest(employee.index, employee)
      if (response.code === 0 && response.data) {
        setIsDialogOpen(false)
        fetchEmployees()
        toast.success(`${employee.name} 更新成功`)
      } else {
        toast.error(`${employee.name} 更新失败: ${response.msg}`)
      }
      return
    }
    // 创建员工
    setCreateSaving(true)
    const response = await createEmployeeRequest(customerIndex, employee)
    if (response.code === 0 && response.data) {
      setIsDialogOpen(false)
      fetchEmployees()
      toast.success(`${employee.name} 创建成功`)
    } else {
      toast.error(`${employee.name} 创建失败: ${response.msg}`)
    }
    setCreateSaving(false)
  }


  return (
    <div className="space-y-4">
      <EmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveEmployee}
        employee={editEmployee || undefined}
        title={editEmployee ? "编辑员工" : "新增员工"}
        isSaving={createSaving}
      />
      <EmployeeDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        employee={detailEmployee || undefined}
      />
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        employee={deleteEmployee}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
      <EmployeeSearch onSearch={handleSearchChange} onAddClick={handleAddEmployee} title="员工" />
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="relative w-12 h-12">
                <div className="absolute w-full h-full border-4 border-muted rounded-full"></div>
                <div className="absolute w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : employees.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-muted-foreground">暂无员工数据</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">姓名</th>
                      {!isMobile && (
                        <>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">电话</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">邮箱</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">备注</th>
                        </>
                      )}
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">{employee.name}</td>
                        {!isMobile && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm  text-center">{employee.phone || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm  text-center">{employee.email || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm  text-center">{employee.remark || '-'}</td>
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                          {isMobile ? (
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleViewEmployee(employee)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">详情</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">编辑</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">删除</span>
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleViewEmployee(employee)} className="mr-3">详情</Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)} className="mr-3">编辑</Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteEmployee(employee)}>删除</Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 