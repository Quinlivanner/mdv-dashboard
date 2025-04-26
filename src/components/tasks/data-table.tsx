"use client"

import * as React from "react"
import {useEffect, useRef, useState} from "react"
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    type UniqueIdentifier,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconGripVertical,
    IconLoader,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {toast} from "sonner"
import {z} from "zod"
import {format} from "date-fns"
import {CalendarIcon} from "lucide-react"
import {cn} from "@/lib/utils"

import {useIsMobile} from "@/hooks/use-mobile"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"

import {Checkbox} from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Tabs, TabsContent,} from "@/components/ui/tabs"
import {Textarea} from "../ui/textarea"
import {StaffBaseInfo} from "@/api/staff/types"
import {CustomerBaseInfo} from "@/api/customer/types"
import {getStaffListRequest} from "@/api/staff/api"
import {getSampleDirectionListRequest, updateDesignTaskRequest} from "@/api/rad/api"
import {StaffType} from "@/api/types"
import {getCustomerListRequest} from "@/api/customer/api"
import {DesignTaskListDetail, SampleDirectionBaseInfo} from "@/api/rad/types"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {useRouter} from "next/navigation"

export const developer_design_task_schema = z.object({
  id: z.number(),
  customer: z.object({
    id: z.number(),
    name: z.string(),
  }),
  engineer: z.object({
    id: z.number(),
    name: z.string(),
  }),
  sales: z.object({
    id: z.number(),
    name: z.string(),
  }),
  sample_direction: z.object({
    id: z.number(),
    name: z.string(),
  }),
  index: z.string(),
  status: z.number(),
  status_text: z.string(),
  srf_code: z.string(),
  take_time: z.string(),
  finished_time: z.string().nullable(),
  project_background: z.string(),
  special_requirements: z.string(),
  remark: z.string(),
})

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  sample_direction: z.string(),
  status: z.number(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})


const columns: ColumnDef<DesignTaskListDetail>[] = [
  {
    accessorKey: "plan_end_date",
    header: "计划交期",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.plan_end_date || '暂无'}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "customer",
    header: "客户",
    cell: ({ row }) => (
      <div >
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.customer.name}
        </Badge>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "srf_code",
    header: "样油编号",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "color",
    header: "涂层颜色",
    cell: ({ row }) => {
      return (
        <div>
           {row.original.sample_info.color || '暂无'}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "paint_number",
    header: "样油数量",
    cell: ({ row }) => {
      return (
        <div>
           {row.original.sample_info.paint_number || '暂无'}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "sample_number",
    header: "工件数量",
    cell: ({ row }) => {
      return (
        <div>
           {row.original.sample_info.sample_number || '暂无'}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "remark",
    header: "备注",
    cell: ({ row }) => {
      return (
        <div>
           {row.original.remark || '暂无'}
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === 7 ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status_text}
      </Badge>
    ),
  },
  {
    accessorKey: "sales",
    header: "销售员",
    cell: ({ row }) => (
      <div>
        {row.original.sales.name}
      </div>
    ),
  },
  {
    accessorKey: "engineer",
    header: "工程师",
    cell: ({ row }) => (
      <div>
        {row.original.engineer.name}
      </div>
    ),
  },
  {
    accessorKey: "take_time",
    header: "接收时间",
    cell: ({ row }) => (
      <div>
        {row.original.take_time}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <TableActions row={row} />
    ),
  },
]

function DraggableRow({ row }: { row: Row<DesignTaskListDetail> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="text-center">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// 创建TableActions组件来正确使用useRouter钩子
function TableActions({ row }: { row: Row<DesignTaskListDetail> }) {
  const router = useRouter()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">打开菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => {
          router.push(`/dashboard/design-tasks/${row.original.index}`)
        }}>编辑</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          navigator.clipboard.writeText(row.original.srf_code)
            .then(() => toast.success("已复制编号到剪贴板"))
            .catch(() => toast.error("复制失败，请手动复制"))
        }}>
          复制编号
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 创建一个上下文来共享回调函数
const DataUpdateContext = React.createContext<(() => void) | undefined>(undefined);

export function DataTable({
  data: initialData,
  onDataUpdate,
}: {
  data: DesignTaskListDetail[]
  onDataUpdate?: () => void
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  })
  const sortableId = React.useId()
  const tableRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Effect to control column visibility based on screen size
  React.useEffect(() => {
    if (isMobile) {
      table.setColumnVisibility({
        srf_code: true,
        status: true,
        actions: true,
        // Explicitly hide others on mobile
        sample_direction: false,
        sales: false,
        engineer: false,
        take_time: false,
        select: false, // Hide select on mobile
        drag: false,   // Hide drag handle on mobile
      })
    } else {
      // Reset to default visibility on larger screens (all columns visible unless configured otherwise)
      table.setColumnVisibility({})
    }
    // Ensure table.setColumnVisibility is stable or correctly memoized if needed
  }, [isMobile, table.setColumnVisibility])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  // 当initialData变化时更新内部状态
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <DataUpdateContext.Provider value={onDataUpdate}>
      <Tabs
        defaultValue="outline"
        className="w-full flex-col justify-start gap-6"
      >
        <TabsContent
          value="outline"
          className="relative flex flex-col gap-4 px-4 lg:px-6"
        >
          <div className="overflow-hidden rounded-lg border" ref={tableRef}>
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan} className="text-center">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        没有数据
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
          <div className="flex items-center justify-center px-4">
            <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
                  已选择 {Object.keys(rowSelection).length} 个
                </span>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">转到第一页</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">上一页</span>
                <IconChevronLeft />
              </Button>
              
              <div className="flex items-center justify-center text-sm font-medium">
                页面 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </div>
              
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">下一页</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">转到最后一页</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="past-performance"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent
          value="focus-documents"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
      </Tabs>
    </DataUpdateContext.Provider>
  )
}

function TableCellViewer({ item }: { item: DesignTaskListDetail }) {
  
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [customers, setCustomers] = useState<CustomerBaseInfo[]>([])
  const [developers, setDevelopers] = useState<StaffBaseInfo[]>([])
  const [sales, setSales] = useState<StaffBaseInfo[]>([])
  const [sampleDirections, setSampleDirections] = useState<SampleDirectionBaseInfo[]>([])
  
  // 表单状态
  const [formValues, setFormValues] = useState<{
    srf_code: string;
    take_time: string;
    plan_end_date: string | null;
    customer: number;
    engineer: number;
    sales: number;
    sample_direction: number;
    project_background: string;
    special_requirements: string;
    remark: string;
    sample_image: string[];
    priority: string;
    priority_text: string;
  }>({
    srf_code: item.srf_code,
    take_time: item.take_time,
    plan_end_date: item.plan_end_date,
    customer: item.customer.id,
    engineer: item.engineer.id,
    sales: item.sales.id,
    sample_direction: item.sample_direction.id,
    project_background: item.project_background,
    special_requirements: item.special_requirements,
    remark: item.remark,
    sample_image: item.sample_image,
    priority: item.priority.toString()  ,
    priority_text: item.priority_text
  })
  
  // 记录哪些字段发生了变化
  const [changedFields, setChangedFields] = useState<Record<string, any>>({})
  
  // 原始值引用，用于比较
  const originalValues = useRef({
    srf_code: item.srf_code,
    take_time: item.take_time,
    plan_end_date: item.plan_end_date,
    customer: item.customer.id,
    engineer: item.engineer.id,
    sales: item.sales.id,
    sample_direction: item.sample_direction.id,
    project_background: item.project_background,
    special_requirements: item.special_requirements,
    remark: item.remark,
    sample_image: item.sample_image,
    priority: item.priority.toString(),
    priority_text: item.priority_text
  })

  const k_map = {
    srf_code: 'SRF 编号',
    take_time: '接收日期',
    plan_end_date: '计划截止日期',
    customer: '客户',
    engineer: '项目工程师',
    sales: '项目销售员',
    sample_direction: '应用方向',
    project_background: '项目背景',
    special_requirements: '特殊要求',
    remark: '备注',
    sample_image: '图片',
    priority: '优先级'
  }
  
  // 处理表单值变化
  const handleFormChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 检测变化并更新changedFields
  useEffect(() => {
    const detectChanges = () => {
      const changes: Record<string, any> = {};
      
      // 比较每个字段
      Object.entries(formValues).forEach(([key, value]) => {
        // @ts-ignore
        const originalValue = originalValues.current[key];
        
        if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
          changes[key] = value;
        }
      });
      
      setChangedFields(changes);
    };
    
    detectChanges();
  }, [formValues]);
  
  // 获取接收数据，只在Drawer打开时执行
  useEffect(() => {
    // 只在抽屉打开时获取数据
    if (!isOpen) return;
    
    const fetchStaffs = async () => {
      try {
        const [developersResponse, salesResponse, sampleDirectionsResponse,customersResponse] = await Promise.all([
          getStaffListRequest(StaffType.DEVELOPER),
          getStaffListRequest(StaffType.SALES),
          getSampleDirectionListRequest(),
          getCustomerListRequest()
        ])
  
        if (developersResponse.code === 0 && developersResponse.data) {
          setDevelopers(developersResponse.data)
        } else {
          console.error("获取项目工程师列表失败:", developersResponse.msg)
        }
  
        if (salesResponse.code === 0 && salesResponse.data) {
          setSales(salesResponse.data)
        } else {
          console.error("获取销售列表失败:", salesResponse.msg)
        }

        if (sampleDirectionsResponse.code === 0 && sampleDirectionsResponse.data) {
          setSampleDirections(sampleDirectionsResponse.data)
        } else {
          console.error("获取应用方向列表失败:", sampleDirectionsResponse.msg)
        }
        if (customersResponse.code === 0 && customersResponse.data) {
          setCustomers(customersResponse.data)
        } else {
          console.error("获取客户列表失败:", customersResponse.msg)
        }
      } catch (error) {
        console.error("获取员工列表错误:", error)
      }
    }
  
    fetchStaffs()
  }, [isOpen]) // 只在isOpen变化时触发

  const onDataUpdate = React.useContext(DataUpdateContext);

  const handleSubmit = async () => {
    console.log("修改的字段:", changedFields);
    
    try {
      // 调用API更新数据
      const response = await updateDesignTaskRequest(item.index, changedFields);
      
      if (response.code === 0) {
        toast.success("表单已更新成功");
        
        // 手动移除inert属性，确保在抽屉关闭后页面可交互
        const tableContainer = document.querySelector('[data-slot="table-container"]');
        if (tableContainer) {
          tableContainer.removeAttribute('inert');
        }
        
        // 调用父组件的数据更新回调函数
        if (onDataUpdate) {
          onDataUpdate();
        }
        
        setIsOpen(false);
      } else {
        toast.error(`更新失败: ${response.msg}`);
      }
    } catch (error) {
      console.error("更新设计任务时出错:", error);
      toast.error("更新失败，请稍后重试");
    }
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      // 添加无障碍处理：当抽屉打开时，将表格设为inert状态
      const tableContainer = document.querySelector('[data-slot="table-container"]');
      if (tableContainer) {
        if (open) {
          tableContainer.setAttribute('inert', '');
        } else {
          tableContainer.removeAttribute('inert');
        }
      }
      
      // 如果关闭抽屉，重置changedFields
      if (!open) {
        setChangedFields({});
      }
    }}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.srf_code}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.srf_code}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">SRF 编号</Label>
              <Input 
                id="header" 
                value={formValues.srf_code}
                onChange={(e) => handleFormChange('srf_code', e.target.value)}
              />
            </div>

            <div className="grid gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="customer">优先级</Label>
                <Select 
                  value={formValues.priority.toString()}
                  onValueChange={(value) => handleFormChange('priority', parseInt(value))}
                >
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>

                  {/* 1 高 2 中 3 低 */}
                  <SelectItem value="1">高</SelectItem>
                  <SelectItem value="2">中</SelectItem>
                  <SelectItem value="3">低</SelectItem>

                  </SelectContent>
                </Select>
              </div>

            </div>
            
            <div className="grid gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="customer">客户</Label>
                <Select 
                  value={formValues.customer.toString()}
                  onValueChange={(value) => handleFormChange('customer', parseInt(value))}
                >
                  <SelectTrigger id="customer" className="w-full">
                    <SelectValue placeholder="选择客户" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
            <div className="grid  gap-4">
            <div className="flex flex-col gap-3">
                <Label htmlFor="take-date">接收日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="take-date"
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !formValues.take_time && "text-muted-foreground"
                      )}
                    >
                      {formValues.take_time ? (
                        format(new Date(formValues.take_time), "yyyy-MM-dd")
                      ) : (
                        <span>请选择日期</span>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        {formValues.take_time && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFormChange('take_time', "")
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation()
                                handleFormChange('take_time', "")
                              }
                            }}
                            className="rounded-full p-1 opacity-50 hover:opacity-100 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <span className="sr-only">清除日期</span>
                          </span>
                        )}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formValues.take_time ? new Date(formValues.take_time) : undefined}
                      onSelect={(date: Date | undefined) => handleFormChange('take_time', date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="finished-date">计划截止日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="finished-date"
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !formValues.plan_end_date && "text-muted-foreground"
                      )}
                    >
                      {formValues.plan_end_date ? (
                        format(new Date(formValues.plan_end_date), "yyyy-MM-dd")
                      ) : (
                        <span>请选择日期</span>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        {formValues.plan_end_date && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFormChange('plan_end_date', null)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation()
                                handleFormChange('plan_end_date', null)
                              }
                            }}
                            className="rounded-full p-1 opacity-50 hover:opacity-100 cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <span className="sr-only">清除日期</span>
                          </span>
                        )}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formValues.plan_end_date ? new Date(formValues.plan_end_date) : undefined}
                      onSelect={(date: Date | undefined) => handleFormChange('plan_end_date', date ? format(date, "yyyy-MM-dd") : null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">项目工程师</Label>
                <Select 
                  value={formValues.engineer.toString()}
                  onValueChange={(value) => handleFormChange('engineer', parseInt(value))}
                >
                  <SelectTrigger id="limit" className="w-full">
                    <SelectValue placeholder="选择项目工程师" />
                  </SelectTrigger>
                  <SelectContent> 
                    {developers.map((developer) => (
                      <SelectItem key={developer.id} value={developer.id.toString()}>
                        {developer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">项目销售员</Label>
              <Select 
                value={formValues.sales.toString()}
                onValueChange={(value) => handleFormChange('sales', parseInt(value))}
              >
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="选择项目销售员" />
                </SelectTrigger>
                <SelectContent>
                  {sales.map((sale) => (
                    <SelectItem key={sale.id} value={sale.id.toString()}>
                      {sale.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">应用方向</Label>
              <Select 
                value={formValues.sample_direction.toString()}
                onValueChange={(value) => handleFormChange('sample_direction', parseInt(value))}
              >
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="选择应用方向" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDirections.map((sampleDirection) => (
                    <SelectItem key={sampleDirection.id} value={sampleDirection.id.toString()}>
                      {sampleDirection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="project_background">项目背景</Label>
              <Textarea 
                id="project_background" 
                value={formValues.project_background}
                onChange={(e) => handleFormChange('project_background', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="special_requirements">特殊要求</Label>
              <Textarea 
                id="special_requirements" 
                value={formValues.special_requirements}
                onChange={(e) => handleFormChange('special_requirements', e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Label htmlFor="remark">备注</Label>
              <Textarea 
                id="remark" 
                value={formValues.remark}
                onChange={(e) => handleFormChange('remark', e.target.value)}
              />
            </div>
            
            {Object.keys(changedFields).length > 0 && (
              <div className="mt-4 p-4 border rounded-md bg-muted">
                <h4 className="text-sm font-medium mb-2">已修改数据:</h4>
                <div className="space-y-2">
                  {Object.entries(changedFields).map(([field, value], index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium">{k_map[field as keyof typeof k_map]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={Object.keys(changedFields).length === 0}>
            更新 {Object.keys(changedFields).length > 0 ? `(${Object.keys(changedFields).length}项改动)` : ''}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">返回</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
