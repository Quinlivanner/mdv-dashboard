"use client"

import {useCallback, useEffect, useState} from 'react'
import {ExtendedRawMaterialInfo, RawMaterialOperation, RequestRawMaterialInfo} from '@/api/suppliers/types'
import {RawMaterialsTable} from './RawMaterialsTable'
import {RawMaterialsSearch} from './RawMaterialsSearch'
import {RawMaterialsDialog} from './RawMaterialsDialog'
import {ConfirmDeleteDialog} from './ConfirmDeleteDialog'
import {toast} from 'sonner'
import {Loader2} from 'lucide-react'
import {useDebounce} from '@/hooks/use-debounce'
import {
    createRawMaterialRequest,
    deleteRawMaterialRequest,
    getPaginatedRawMaterialListRequest,
    updateRawMaterialRequest
} from '@/api/suppliers/api'


export function RawMaterialsList() {
  const [raw_materials, setRawMaterials] = useState<ExtendedRawMaterialInfo[]>([])
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
  const [currentRawMaterial, setCurrentRawMaterial] = useState<ExtendedRawMaterialInfo | undefined>(undefined)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false) // 删除确认对话框状态
  const [rawMaterialToDelete, setRawMaterialToDelete] = useState<ExtendedRawMaterialInfo | null>(null) // 要删除的客户信息

  // 获取分页客户列表
  const fetchPaginatedRawMaterials = useCallback(async (page: number, search: string) => {
    setIsLoading(true) // 初始加载/翻页加载
    try {
      const response = await getPaginatedRawMaterialListRequest(page, pageSize, search)
      if (response.code === 0 && response.data) {
        const rawMaterialsWithId = response.data.raw_materials.map((raw_material, idx) => ({
          ...raw_material,
          id: idx + (page - 1) * pageSize
        }));
        setRawMaterials(rawMaterialsWithId)
        setTotalPages(Math.max(1, Math.ceil(response.data.total / pageSize)))
      } else {
        toast.error(`获取原材料列表失败: ${response.msg}`)
        setRawMaterials([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error("获取原材料列表错误:", error)
      toast.error("获取原材料列表失败，请稍后重试")
      setRawMaterials([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }, [pageSize])
  
  // 初始化加载和页面变化时加载数据
  useEffect(() => {
    fetchPaginatedRawMaterials(currentPage, debouncedSearchTerm)
  }, [currentPage, debouncedSearchTerm, fetchPaginatedRawMaterials])
  
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
    setCurrentRawMaterial(undefined)
    setDialogTitle('新增原材料')
    setDialogOpen(true)
  }
  
  // 打开编辑客户对话框
  const handleEditClick = (raw_material: ExtendedRawMaterialInfo) => {
    setCurrentRawMaterial(raw_material)
    setDialogTitle('编辑原材料')
    setDialogOpen(true)
  }
  
  // 修改 handleDeleteClick 以打开确认对话框
  const handleDeleteClick = (raw_material: ExtendedRawMaterialInfo) => {
    console.log('raw_material=>', raw_material)
    setRawMaterialToDelete(raw_material)
    setIsDeleteDialogOpen(true)
  }
  
  // 新增 handleConfirmDelete 函数处理确认删除逻辑
  const handleConfirmDelete = async () => {
    if (!rawMaterialToDelete) return;

    setIsDeleting(true)
    try {
      const response = await deleteRawMaterialRequest(rawMaterialToDelete.index)
      if (response.code === 0) {
        toast.success(`原材料 "${rawMaterialToDelete.name}" 删除成功`)
        setIsDeleteDialogOpen(false)
        // 刷新列表，处理边界情况（删除的是当前页最后一条）
        if (raw_materials.length === 1 && currentPage > 1) {
          // 如果删除的是当前页最后一条且不是第一页，跳转到前一页
          setCurrentPage(currentPage - 1)
        } else {
          // 否则刷新当前页
          fetchPaginatedRawMaterials(currentPage, debouncedSearchTerm)
        }
      } else {
        toast.error(`删除原材料失败: ${response.msg}`)
        setIsDeleteDialogOpen(false) // 即使失败也关闭确认框
      }
    } catch (error) {
      console.error("删除原材料错误:", error)
      toast.error("删除原材料时发生错误，请稍后重试")
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
      setRawMaterialToDelete(null) // 清理状态
    }
  }
  
  // 处理保存原材料
  const handleSaveRawMaterial = async (rawMaterialData: Partial<RequestRawMaterialInfo> & { index?: string }) => {
    setIsSaving(true)
    try {
      if (rawMaterialData.index) {
        // 编辑现有原材料
        const updateData: RawMaterialOperation = {
          name: rawMaterialData.name || '',
          supplier: rawMaterialData.supplier || '',
          scientific_name: rawMaterialData.scientific_name || '',
          internal_number: rawMaterialData.internal_number || '',
          unit: rawMaterialData.unit || '',
          molecular_formula: rawMaterialData.molecular_formula || '',
          description: rawMaterialData.description || '',
        }
        
        const response = await updateRawMaterialRequest(rawMaterialData.index, updateData)
        
        if (response.code === 0 && response.data) {
          toast.success(`原材料 "${response.data.name}" 更新成功`)
          //更新本地状态
          setDialogOpen(false)
          // 刷新列表到当前页
          fetchPaginatedRawMaterials(currentPage, debouncedSearchTerm)
        } else {
          toast.error(`更新原材料失败: ${response.msg}`)
        }
      } else {
        // 新增原材料
        const createData: RawMaterialOperation = {
          name: rawMaterialData.name || '',
          supplier: rawMaterialData.supplier || '',
          scientific_name: rawMaterialData.scientific_name || '',
          internal_number: rawMaterialData.internal_number || '',
          unit: rawMaterialData.unit || '',
          molecular_formula: rawMaterialData.molecular_formula || '',
          description: rawMaterialData.description || '',
        }
        const response = await createRawMaterialRequest(createData)
        if (response.code === 0) {
          toast.success(`原材料 "${createData.name}" 创建成功`)
          setDialogOpen(false)
          // 如果搜索框有内容，就清空
          setSearchTerm('')
          // 刷新列表到第一页
          if (currentPage === 1) {
            fetchPaginatedRawMaterials(1, debouncedSearchTerm)
          } else {
            setCurrentPage(1)
          }
        } else {
          toast.error(`创建原材料失败: ${response.msg}`)
        }
      }
    } catch (error) {
      console.error("保存原材料错误:", error)
      toast.error("保存原材料时发生错误，请稍后重试")
    } finally {
      setIsSaving(false)
    }
  }

  // 显示全页面加载状态
  // 注意：只在没有搜索词且首次加载时显示全屏加载
  // 如果是带搜索词的加载或者翻页加载，使用表格内的加载状态
  if (isLoading && raw_materials.length === 0 && !debouncedSearchTerm) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">正在加载原材料数据...</p>
        </div>
      </div>
    )
  }

  return (
    <>
        <RawMaterialsSearch 
          onSearch={handleSearchInputChange} 
          onAddClick={handleAddClick} 
        />
        
        <RawMaterialsTable 
          raw_materials={raw_materials} 
          isLoading={isLoading && raw_materials.length === 0} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        
        <RawMaterialsDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          raw_material={currentRawMaterial}
          onSave={handleSaveRawMaterial}
          title={dialogTitle}
          isSaving={isSaving} // 传递 isSaving 状态
        />

        <ConfirmDeleteDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          raw_material={rawMaterialToDelete}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
</>
  )
} 