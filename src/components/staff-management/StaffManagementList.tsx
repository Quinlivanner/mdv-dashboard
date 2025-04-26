"use client"

import {useCallback, useEffect, useState} from 'react'
import {StaffsTable} from './StaffManagementTable'
import {StaffsSearch} from './StaffManagementSearch'
import {StaffsManagementDialog} from './StaffManagementDialog'
import {toast} from 'sonner'
import {Loader2} from 'lucide-react'
import {useDebounce} from '@/hooks/use-debounce'
import {StaffDetail, StaffOperation} from '@/api/staff/types'
import {createStaffRequest, deleteStaffRequest, getPaginatedStaffListRequest, updateStaffRequest} from '@/api/staff/api'
import {ConfirmDeleteDialog} from './ConfirmDeleteDialog'


export function StaffManagementList() {
  const [staffs, setStaffs] = useState<StaffDetail[]>([])
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
  const [currentStaff, setCurrentStaff] = useState<StaffDetail | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false) // 删除确认对话框状态
  const [staffToDelete, setStaffToDelete] = useState<StaffDetail | null>(null) // 要删除的客户信息
  
  // 获取分页客户列表
  const fetchPaginatedStaffs = useCallback(async (page: number, search: string) => {
    setIsLoading(true) 
    try {
      const response = await getPaginatedStaffListRequest(page, pageSize, search)
      if (response.code === 0 && response.data) {
        const staffsWithId = response.data.staffs.map((staff, idx) => ({
          ...staff,
          id: idx + (page - 1) * pageSize
        }));
        setStaffs(staffsWithId)
        setTotalPages(response.data.total_pages)
      } else {
        toast.error(`获取员工列表失败: ${response.msg}`)
        setStaffs([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error("获取员工列表错误:", error)
      toast.error("获取员工列表失败，请稍后重试")
      setStaffs([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [pageSize])
  
  // 初始化加载和页面变化时加载数据
  useEffect(() => {
    fetchPaginatedStaffs(currentPage, debouncedSearchTerm)
  }, [currentPage, debouncedSearchTerm, fetchPaginatedStaffs])
  
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
    setCurrentStaff(undefined)
    setDialogTitle('新增员工')
    setDialogOpen(true)
  }
  
  // 打开编辑客户对话框
  const handleEditClick = (staff: StaffDetail) => {
    setCurrentStaff(staff)
    setDialogTitle('编辑员工')
    setDialogOpen(true)
  }
  
  // 修改 handleDeleteClick 以打开确认对话框
  const handleDeleteClick = (staff: StaffDetail) => {
    setStaffToDelete(staff)
    setIsDeleteDialogOpen(true)
  }
  
  // 新增 handleConfirmDelete 函数处理确认删除逻辑
  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;

    setIsDeleting(true)
    try {
      const response = await deleteStaffRequest(staffToDelete.index)
      if (response.code === 0) {
        toast.success(`员工 "${staffToDelete.name}" 删除成功`)
        setIsDeleteDialogOpen(false)
        // 刷新列表，处理边界情况（删除的是当前页最后一条）
        if (staffs.length === 1 && currentPage > 1) {
          // 如果删除的是当前页最后一条且不是第一页，跳转到前一页
          setCurrentPage(currentPage - 1)
        } else {
          // 否则刷新当前页
          fetchPaginatedStaffs(currentPage, debouncedSearchTerm)
        }
      } else {
        toast.error(`删除员工失败: ${response.msg}`)
        setIsDeleteDialogOpen(false) // 即使失败也关闭确认框
      }
    } catch (error) {
      console.error("删除员工错误:", error)
      toast.error("删除员工时发生错误，请稍后重试")
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
      setStaffToDelete(null) // 清理状态
    }
  }
  
  // 处理保存客户
  const handleSaveStaff = async (staffData: Partial<StaffDetail> & { index?: string }) => {
    setIsSaving(true)
    try {
      if (staffData.index) {
        // 编辑现有员工
        const updateData: StaffOperation = {
          name: staffData.name || '',
          phone: staffData.phone || '',
          email: staffData.email || '',
          remark: staffData.remark || '',
          gender: staffData.gender || 0,
          department: staffData.department?.id || 0,
          position: staffData.position?.id || 0,
          join_date: staffData.join_date || '',
          contract_expiry_date: staffData.contract_expiry_date || '',
        }
        
        const response = await updateStaffRequest(staffData.index, updateData)
        
        if (response.code === 0 && response.data) {
          toast.success(`员工 "${response.data.name}" 更新成功`)
          // 更新本地状态
          setStaffs(prevStaffs => 
            prevStaffs.map(staff => 
              staff.index === staffData.index 
                ? { ...staff, ...response.data } // 使用返回的数据更新
                : staff
            )
          )
          setDialogOpen(false)
        } else {
          toast.error(`更新员工失败: ${response.msg}`)
        }
      } else {
        // 新增 员工
        const createData: StaffOperation = {
          name: staffData.name || '',
          phone: staffData.phone || '',
          email: staffData.email || '',
          remark: staffData.remark || '',
          gender: staffData.gender || 0,
          department: staffData.department?.id || 0,
          position: staffData.position?.id || 0,
          join_date: staffData.join_date || '',
          contract_expiry_date: staffData.contract_expiry_date || '',
        }
        const response = await createStaffRequest(createData)
        if (response.code === 0) {
          toast.success(`员工 "${createData.name}" 创建成功`)
          setDialogOpen(false)
          // 刷新列表到第一页
          if (currentPage === 1) {
            fetchPaginatedStaffs(1, debouncedSearchTerm)
          } else {
            setCurrentPage(1)
          }
        } else {
          toast.error(`创建员工失败: ${response.msg}`)
        }
      }
    } catch (error) {
      console.error("保存员工错误:", error)
      toast.error("保存员工时发生错误，请稍后重试")
    } finally {
      setIsSaving(false)
    }
  }

  // 显示全页面加载状态
  // 注意：只在没有搜索词且首次加载时显示全屏加载
  // 如果是带搜索词的加载或者翻页加载，使用表格内的加载状态
  if (isLoading && staffs.length === 0 && !debouncedSearchTerm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">正在加载员工数据...</p>
        </div>
      </div>
    )
  }

  return (
    <>
        <StaffsSearch 
          onSearch={handleSearchInputChange} 
          onAddClick={handleAddClick} 
        />
        
        <StaffsTable 
          staffs={staffs} 
          isLoading={isLoading && staffs.length === 0} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        
        <StaffsManagementDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          staff={currentStaff}
          onSave={handleSaveStaff}
          title={dialogTitle}
          isSaving={isSaving}
        />

        <ConfirmDeleteDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          staff={staffToDelete}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
    </>
  )
} 