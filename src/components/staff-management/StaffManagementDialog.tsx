"use client"

import {useEffect, useState} from 'react'
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {CalendarIcon, Loader2} from 'lucide-react'
import {Department, Position, StaffDetail} from '@/api/staff/types'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'
import {getDepartmentListRequest, getPositionListRequest} from '@/api/staff/api'
import {toast} from 'sonner'
import {Calendar} from '../ui/calendar'
import {format} from "date-fns"
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover'
import {cn} from '@/lib/utils'


interface StaffDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    staff?: StaffDetail
    onSave: (staff: Partial<StaffDetail> & { index?: string }) => void
    title: string
    isSaving: boolean
}

export function StaffsManagementDialog({
                                 open,
                                 onOpenChange,
                                 staff,
                                 onSave,
                                 title,
                                 isSaving,
                             }: StaffDialogProps) {

    const [isLoading, setIsLoading] = useState(false)
    // 表单数据
    const [formData, setFormData] = useState<{
        name: string;
        gender: number | undefined;
        department: Department | undefined;
        position: Position | undefined;
        join_date: string;
        contract_expiry_date: string;
        phone: string;
        email: string;
        remark: string;
    }>({
        name: '',
        gender: undefined,
        department: undefined,
        position: undefined,
        join_date: '',
        contract_expiry_date: '',
        phone: '',
        email: '',
        remark: '',
    })

    // 部门列表
    const [departmentList, setDepartmentList] = useState<Department[]>([])
    // 职位列表
    const [positionList, setPositionList] = useState<Position[]>([])

    // 获取部门和职位列表
    useEffect(() => {
        const fetchStaffs = async () => {
            setIsLoading(true)
            try {
                const [departmentResponse, positionResponse] = await Promise.all([
                    getDepartmentListRequest(),
                    getPositionListRequest(),
                ])

                if (departmentResponse.code === 0 && departmentResponse.data) {
                    setDepartmentList(departmentResponse.data)
                } else {
                    console.error("获取部门列表失败:", departmentResponse.msg)
                }

                if (positionResponse.code === 0 && positionResponse.data) {
                    setPositionList(positionResponse.data)
                } else {
                    console.error("获取职位列表失败:", positionResponse.msg)
                }

            } catch (error) {
                toast.error("获取员工列表错误:", error || "未知错误")
            } finally {
                setIsLoading(false)
            }
        }

        fetchStaffs()
    }, [])

    // 错误信息
    const [errors, setErrors] = useState<{
        name?: string;
        gender?: string;
        department?: string;
        position?: string;
        join_date?: string;
        contract_expiry_date?: string;
        phone?: string;
    }>({})

    // 当staff变化时更新表单数据
    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.name || '',
                gender: staff.gender || undefined,
                department: staff.department || undefined,
                position: staff.position || undefined,
                join_date: staff.join_date || '',
                contract_expiry_date: staff.contract_expiry_date || '',
                phone: staff.phone || '',
                email: staff.email || '',
                remark: staff.remark || '',
            })
        } else {
            setFormData({
                name: '',
                gender: undefined,
                department: undefined,
                position: undefined,
                join_date: '',
                contract_expiry_date: '',
                phone: '',
                email: '',
                remark: '',
            })
        }
        // 重置错误
        setErrors({})
    }, [staff, open])

    // 验证表单
    const validateForm = (): boolean => {
        const newErrors: {
            name?: string;
            phone?: string;
            gender?: string;
            department?: string;
            position?: string;
            join_date?: string;
            contract_expiry_date?: string
        } = {}

        if (!formData.name.trim()) {
            newErrors.name = '员工名称不能为空'
        }
        // 性别错误
        if (formData.gender !== 1 && formData.gender !== 2) {
            newErrors.gender = '请选择新员工性别哦！'
        }
        // 电话
        if (!formData.phone.trim()) {
            newErrors.phone = '请填写新员工联系电话哦！'
        }
        // 部门
        if (!formData.department?.id) {
            newErrors.department = '请选择新员工部门哦！'
        }
        // 职位
        if (!formData.position?.id) {
            newErrors.position = '请选择新员工职位哦！'
        }
        // 加入日期
        if (!formData.join_date.trim()) {
            newErrors.join_date = '请填写新员工加入日期哦！'
        }
        // 合同到期日期
        if (!formData.contract_expiry_date.trim()) {
            newErrors.contract_expiry_date = '请填写新员工合同到期日期哦！'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // 提交表单
    const handleSubmit = () => {
        if (validateForm() && !isSaving) {
            onSave({
                ...(staff?.index ? {index: staff.index} : {}),
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                gender: formData.gender,
                department: formData.department,
                position: formData.position,
                join_date: formData.join_date,
                contract_expiry_date: formData.contract_expiry_date,
                remark: formData.remark.trim(),
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] max-h-[92%] overflow-y-auto [&::-webkit-scrollbar]:w-0">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="staff-name">
                            员工名称 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="staff-name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="请输入员工名称"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff-gender">
                            性别 <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.gender?.toString()}
                            onValueChange={(value) => setFormData({...formData, gender: parseInt(value)})}
                        >
                            <SelectTrigger
                                aria-invalid={!!errors.gender}
                            >
                                <SelectValue placeholder="请选择性别"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">男</SelectItem>
                                <SelectItem value="2">女</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && (
                            <p className="text-sm text-destructive">{errors.gender}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff-phone">
                            电话 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="staff-phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="请输入联系电话"
                            aria-invalid={!!errors.phone}
                        />
                        {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff-email">
                            邮箱
                        </Label>
                        <Input
                            id="staff-email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="请输入邮箱"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff-department">
                            部门 <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.department?.id.toString()}
                            onValueChange={(value) => {
                                const selectedDepartment = departmentList.find(d => d.id.toString() === value)
                                if (selectedDepartment) {
                                    setFormData({...formData, department: selectedDepartment})
                                }
                            }}
                        >
                            <SelectTrigger
                                aria-invalid={!!errors.department}
                            >
                                <SelectValue placeholder="请选择部门"/>
                            </SelectTrigger>
                            <SelectContent>
                                {departmentList.map((department) => (
                                    <SelectItem key={department.id} value={department.id.toString()}>
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.department && (
                            <p className="text-sm text-destructive">{errors.department}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff-position">
                            职位 <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.position?.id.toString()}
                            onValueChange={(value) => {
                                const selectedPosition = positionList.find(p => p.id.toString() === value)
                                if (selectedPosition) {
                                    setFormData({...formData, position: selectedPosition})
                                }
                            }}
                        >
                            <SelectTrigger
                                aria-invalid={!!errors.position}
                            >
                                <SelectValue placeholder="请选择职位"/>
                            </SelectTrigger>
                            <SelectContent>
                                {positionList.map((position) => (
                                    <SelectItem key={position.id} value={position.id.toString()}>
                                        {position.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.position && (
                            <p className="text-sm text-destructive">{errors.position}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff-join-date">
                            加入日期 <span className="text-destructive">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger aria-invalid={!!errors.join_date} asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !formData.join_date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon/>
                                    {formData.join_date ? (
                                        format(new Date(formData.join_date), "yyyy-MM-dd")
                                    ) : (
                                        <span>请选择日期</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.join_date ? new Date(formData.join_date) : undefined}
                                    onSelect={(date: Date | undefined) => setFormData({
                                        ...formData,
                                        join_date: date ? format(date, "yyyy-MM-dd") : ""
                                    })}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.join_date && (
                            <p className="text-sm text-destructive">{errors.join_date}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff-contract-expiry-date">
                            合同到期日期 <span className="text-destructive">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger aria-invalid={!!errors.contract_expiry_date} asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        " justify-start text-left font-normal",
                                        !formData.contract_expiry_date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon/>
                                    {formData.contract_expiry_date ? (
                                        format(new Date(formData.contract_expiry_date), "yyyy-MM-dd")
                                    ) : (
                                        <span>请选择日期</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.contract_expiry_date ? new Date(formData.contract_expiry_date) : undefined}
                                    onSelect={(date: Date | undefined) => setFormData({
                                        ...formData,
                                        contract_expiry_date: date ? format(date, "yyyy-MM-dd") : ""
                                    })}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.contract_expiry_date && (
                            <p className="text-sm text-destructive">{errors.contract_expiry_date}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="staff-remark">
                            备注
                        </Label>
                        <Textarea
                            id="staff-remark"
                            value={formData.remark}
                            onChange={(e) => setFormData({...formData, remark: e.target.value})}
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
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
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