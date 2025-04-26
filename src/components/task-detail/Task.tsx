import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {
    AlertCircle,
    Building,
    ChevronDown,
    ChevronsDown,
    ChevronsUp,
    ChevronUp,
    CopyX,
    Edit,
    FileText,
    GalleryHorizontalEnd,
    ImageUp,
    Maximize,
    Save,
    Tag,
    Trash2,
    User,
    Waypoints,
    X,
    Siren
} from "lucide-react"
import {getStaffListRequest} from "@/api/staff/api"
import {StaffType} from "@/api/types"
import {getSampleDirectionListRequest} from "@/api/rad/api"
import {getCustomerListRequest} from "@/api/customer/api"
import {CustomerBaseInfo, DesignTaskDetailInfo, DesignTaskInfo, SampleDirectionBaseInfo, StaffBaseInfo} from "@/api/rad/types"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {CalendarIcon} from "@radix-ui/react-icons"
import {Badge} from "../ui/badge"
import {Dialog, DialogClose, DialogContent, DialogHeader} from "@/components/ui/dialog"
import { FormImageUploader } from "../share/form/form-image-upload"
import { NormalImageUploader } from "../share/form/image-upload"

interface TaskProps {
    task: DesignTaskDetailInfo
    onSave: (updatedTask: any) => Promise<DesignTaskDetailInfo>
}

export default function Task({task: initialTask, onSave}: TaskProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [task, setTask] = useState(initialTask)

    // 添加ID字段用于select组件
    const [formState, setFormState] = useState({
        customerID:  "",
        projectDeveloperID: "",
        projectSalesID: "",
        sampleDirectionID: "",
        priority: ""
    })

    const [customer, setCustomer] = useState<CustomerBaseInfo[]>([])
    const [developers, setDevelopers] = useState<StaffBaseInfo[]>([])
    const [sales, setSales] = useState<StaffBaseInfo[]>([])
    const [sampleDirections, setSampleDirections] = useState<SampleDirectionBaseInfo[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isBasicInfoCollapsed, setIsBasicInfoCollapsed] = useState(false);
    const [isSampleRequirementsCollapsed, setIsSampleRequirementsCollapsed] = useState(false);
    const [isImageCollapsed, setIsImageCollapsed] = useState(false)
    // 添加图片预览状态
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)


    // 切换编辑模式
    const toggleEditMode = () => {
        // setIsBasicInfoCollapsed(false);
        // setIsSampleRequirementsCollapsed(false);
        // setIsImageCollapsed(false);
        if (!isEditing) {
            // 进入编辑模式时，尝试匹配名称与ID
            const customerItem = customer.find(c => c.name === task.customer.name)
            const developerItem = developers.find(d => d.name === task.engineer.name)
            const salesItem = sales.find(s => s.name === task.sales.name)
            const directionItem = sampleDirections.find(d => d.name === task.sample_direction.name)

            setFormState({
                customerID: customerItem ? customerItem.id.toString() : "",
                projectDeveloperID: developerItem ? developerItem.id.toString() : "",
                projectSalesID: salesItem ? salesItem.id.toString() : "",
                sampleDirectionID: directionItem ? directionItem.id.toString() : "",
                priority: task.priority.toString()
            })
        }
        setIsEditing(!isEditing)
    }

    // 保存任务修改
    const saveTaskChanges = async () => {
        // 找到选中项的名称
        const customerItem = customer.find(c => c.id.toString() === formState.customerID)
        const developerItem = developers.find(d => d.id.toString() === formState.projectDeveloperID)
        const salesItem = sales.find(s => s.id.toString() === formState.projectSalesID)
        const directionItem = sampleDirections.find(d => d.id.toString() === formState.sampleDirectionID)

        // 更新任务对象，同时包含ID和名称
        const updatedTask :DesignTaskInfo = {
            srf_code: task.srf_code,
            take_time: task.take_time,
            plan_end_date: task.plan_end_date,
            priority: task.priority,
            customer: task.customer.id,
            engineer: task.engineer.id,
            sales: task.sales.id,
            sample_direction: task.sample_direction.id,
            project_background: task.project_background,
            special_requirements: task.special_requirements,
            remark: task.remark,
            sample_image: task.sample_image,
        }
        const data = await onSave(updatedTask); 
        if (data !== null) { 
            console.log('data => ',data)
            setTask(data)
            setIsEditing(false); 
        } else {
            console.error("保存任务失败，请检查父组件日志或网络请求。");
        }
    }

    // 获取项目工程师和项目销售员列表
    useEffect(() => {
        const fetchStaffs = async () => {
            setIsLoading(true)
            try {
                const [developersResponse, salesResponse, sampleDirectionsResponse, customerResponse] = await Promise.all([
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

                if (customerResponse.code === 0 && customerResponse.data) {
                    setCustomer(customerResponse.data)
                } else {
                    console.error("获取客户列表失败:", customerResponse.msg)
                }
            } catch (error) {
                console.error("获取员工列表错误:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStaffs()
    }, [])

    // 添加全局折叠/展开处理函数
    const toggleAllCards = () => {
        // 如果有任何一个卡片处于展开状态，则全部折叠
        if (!isBasicInfoCollapsed || !isSampleRequirementsCollapsed) {
            setIsBasicInfoCollapsed(true);
            setIsSampleRequirementsCollapsed(true);
            setIsImageCollapsed(true);
        } else {
            // 如果全部都已折叠，则全部展开
            setIsBasicInfoCollapsed(false);
            setIsSampleRequirementsCollapsed(false);
            setIsImageCollapsed(false);
        }
    };

    return (
        <>
            <div className="flex justify-end mb-4 gap-2">
                <Button
                    variant="secondary"
                    onClick={toggleAllCards}
                    className="flex items-center gap-1.5"
                >
                    {(!isBasicInfoCollapsed || !isSampleRequirementsCollapsed) ? (
                        <>
                            <ChevronsUp className="h-4 w-4"/>
                            <span>折叠全部</span>
                        </>
                    ) : (
                        <>
                            <ChevronsDown className="h-4 w-4"/>
                            <span>展开全部</span>
                        </>
                    )}
                </Button>
                {isEditing ? (
                    <>
                        <Button onClick={saveTaskChanges}>
                            <Save className="mr-2 h-4 w-4"/>
                            保存更改
                        </Button>
                        <Button variant="outline" onClick={toggleEditMode} className="ml-2">
                            <CopyX className="mr-2 h-4 w-4"/>
                            退出更改
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" onClick={toggleEditMode}>
                        <Edit className="mr-2 h-4 w-4"/>
                        编辑任务书
                    </Button>
                )}

            </div>

            <Card className="shadow-sm mb-6 overflow-hidden border  rounded-xl">
                <CardHeader className=" px-4 py-3 sm:px-6 border-b ">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-slate-500"/>
                            基本信息
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setIsBasicInfoCollapsed(!isBasicInfoCollapsed)}
                        >
                            {isBasicInfoCollapsed ? (
                                <ChevronDown className="h-5 w-5 text-slate-500"/>
                            ) : (
                                <ChevronUp className="h-5 w-5 text-slate-500"/>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className={cn(
                    "px-4 pt-5 pb-6 sm:px-6 transition-all duration-300 ease-in-out",
                    isBasicInfoCollapsed ? "hidden" : "block"
                )}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">SRF编号</h3>
                            </div>
                            {isEditing ? (
                                <Input
                                    value={task.srf_code}
                                    onChange={(e) => setTask({...task, srf_code: e.target.value})}
                                    className="border-slate-300"
                                />
                            ) : (
                                <p className="text-lg font-semibold  pl-6">{task.srf_code}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">客户</h3>
                            </div>
                            {isEditing ? (
                                <Select
                                    disabled={isLoading}
                                    value={task.customer.id.toString()}
                                    onValueChange={(value) => setTask({...task, customer: {id: parseInt(value), name: customer.find(c => c.id.toString() === value)?.name || ""}})}
                                >
                                    <SelectTrigger className="w-full border-slate-300">
                                        <SelectValue placeholder="请选择客户"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customer.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="pl-6">
                                    <Badge
                                        className="font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 px-3 py-1">
                                        {task.customer.name}
                                    </Badge>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">接收日期</h3>
                            </div>
                            {isEditing ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal border-slate-300",
                                                !task.take_time && "text-muted-foreground",
                                            )}
                                        >
                                            {task.take_time ? (
                                                format(new Date(task.take_time), "yyyy-MM-dd")
                                            ) : (
                                                <span>请选择日期</span>
                                            )}
                                            <div className="ml-auto flex items-center gap-2">
                                                {task.take_time && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setTask({...task, take_time: ""})
                                                        }}
                                                        className="rounded-full p-1 opacity-50 hover:opacity-100"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="h-4 w-4"
                                                        >
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                        <span className="sr-only">清除日期</span>
                                                    </button>
                                                )}
                                                <CalendarIcon className="h-4 w-4 opacity-50"/>
                                            </div>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={task.take_time ? new Date(task.take_time) : undefined}
                                            onSelect={(date: Date | undefined) =>
                                                setTask({...task, take_time: date ? format(date, "yyyy-MM-dd") : ""})
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <div className="pl-6 flex items-center">
                                    <div className="flex items-center gap-1.5 ">
                                        {/* <CalendarIcon className="h-3.5 w-3.5 "/> */}
                                        <span className="font-medium">{task.take_time || "未设置"}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">计划截止日期</h3>
                            </div>
                            {isEditing ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal border-slate-300",
                                                !task.plan_end_date && "text-muted-foreground",
                                            )}
                                        >
                                            {task.plan_end_date ? format(new Date(task.plan_end_date), "yyyy-MM-dd") :
                                                <span>请选择日期</span>}
                                            <div className="ml-auto flex items-center gap-2">
                                                {task.plan_end_date && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setTask({...task, plan_end_date: ""})
                                                        }}
                                                        className="rounded-full p-1 opacity-50 hover:opacity-100"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="h-4 w-4"
                                                        >
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                        <span className="sr-only">清除日期</span>
                                                    </button>
                                                )}
                                                <CalendarIcon className="h-4 w-4 opacity-50"/>
                                            </div>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={task.plan_end_date ? new Date(task.plan_end_date) : undefined}
                                            onSelect={(date: Date | undefined) =>
                                                setTask({...task, plan_end_date: date ? format(date, "yyyy-MM-dd") : ""})
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <div className="pl-6 flex items-center">
                                    <div className="flex items-center gap-1.5 ">
                                        {/* <CalendarIcon className="h-3.5 w-3.5 "/> */}
                                        <span className="font-medium">{task.plan_end_date || "未设置"}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">项目工程师</h3>
                            </div>
                            {isEditing ? (
                                <Select
                                    disabled={isLoading}
                                    value={task.engineer.id.toString()}
                                    onValueChange={(value) => setTask({...task, engineer: {id: parseInt(value), name: developers.find(d => d.id.toString() === value)?.name || ""}})}
                                >
                                    <SelectTrigger className="w-full border-slate-300">
                                        <SelectValue placeholder="请选择项目工程师"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {developers.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="pl-6 flex items-center gap-2">
                                    <span className="font-medium ">{task.engineer.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">项目销售员</h3>
                            </div>
                            {isEditing ? (
                                <Select
                                    disabled={isLoading}
                                    value={task.sales.id.toString()}
                                    onValueChange={(value) => setTask({...task, sales: {id: parseInt(value), name: sales.find(s => s.id.toString() === value)?.name || ""}})}
                                >
                                    <SelectTrigger className="w-full border-slate-300">
                                        <SelectValue placeholder="请选择项目销售员"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sales.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="pl-6 flex items-center gap-2">
                                    <span className="font-medium ">{task.sales.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Siren className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">优先级</h3>
                            </div>
                            {isEditing ? (
                        <div className="space-y-1.5">
                            <Select
                                    disabled={isLoading}
                                    value={task.priority.toString()}
                                    onValueChange={(value) => setTask({...task, priority: parseInt(value)})}
                                >
                                    <SelectTrigger className="w-full border-slate-300">
                                        <SelectValue placeholder="请选择优先级"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">高</SelectItem>
                                        <SelectItem value="2">中</SelectItem>
                                        <SelectItem value="3">低</SelectItem>
                                    </SelectContent>
                                </Select>
                        </div>
                            ) : (
                                <div className="pl-6 flex items-center gap-2">
                                    <span className="font-medium ">{task.priority_text}</span>
                                </div>
                            )}
                        </div>



                    </div>
                </CardContent>
            </Card>

            {/* 样品需求卡片 */}
            <Card className="shadow-sm mb-6 overflow-hidden border  rounded-xl">
                <CardHeader className=" px-4 py-3 sm:px-6 border-b ">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Tag className="h-5 w-5 text-slate-500"/>
                            样品需求
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setIsSampleRequirementsCollapsed(!isSampleRequirementsCollapsed)}
                        >
                            {isSampleRequirementsCollapsed ? (
                                <ChevronDown className="h-5 w-5 text-slate-500"/>
                            ) : (
                                <ChevronUp className="h-5 w-5 text-slate-500"/>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className={cn(
                    "px-4 pt-5 pb-6 sm:px-6 transition-all duration-300 ease-in-out",
                    isSampleRequirementsCollapsed ? "hidden" : "block"
                )}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2 p-4 rounded-lg border ">
                            <div className="flex items-center gap-2">
                                <Waypoints className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">应用方向</h3>
                            </div>
                            {isEditing ? (
                                <Select
                                    disabled={isLoading}
                                    value={formState.sampleDirectionID}
                                    onValueChange={(value) => setFormState({...formState, sampleDirectionID: value})}
                                >
                                    <SelectTrigger className="w-full md:w-1/2 border-slate-300">
                                        <SelectValue placeholder="请选择应用方向"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sampleDirections.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="pl-6">
                                    {task.sample_direction.name}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 p-4 rounded-lg border ">
                            <div className="flex items-center gap-2">
                                <GalleryHorizontalEnd className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">项目背景</h3>
                            </div>
                            {isEditing ? (
                                <Textarea
                                    value={task.project_background}
                                    onChange={(e) => setTask({...task, project_background: e.target.value})}
                                    className="min-h-[120px] border-slate-300"
                                    placeholder="请输入项目背景..."
                                />
                            ) : (
                                <div className="pl-6">
                                    <p className="whitespace-pre-line">{task.project_background || "暂无项目背景"}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2  p-4 rounded-lg border">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">特殊要求</h3>
                            </div>
                            {isEditing ? (
                                <Textarea
                                    value={task.special_requirements}
                                    onChange={(e) => setTask({...task, special_requirements: e.target.value})}
                                    className="min-h-[120px] border-slate-300"
                                    placeholder="请输入特殊要求..."
                                />
                            ) : (
                                <div className="pl-6">
                                    <p className="whitespace-pre-line">
                                        {task.special_requirements || "暂无特殊要求"}
                                    </p>
                                </div>
                            )}
                        </div>


                        <div className="space-y-2  p-4 rounded-lg border  mt-2">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 "/>
                                <h3 className="text-sm font-medium ">备注</h3>
                            </div>
                            {isEditing ? (
                                <Textarea
                                    value={task.remark}
                                    onChange={(e) => setTask({...task, remark: e.target.value})}
                                    className="min-h-[100px] border-amber-200 bg-white"
                                    placeholder="请输入备注信息..."
                                />
                            ) : (
                                <div className="pl-6">
                                    <p className="whitespace-pre-line">{task.remark || "暂无备注信息"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <NormalImageUploader 
                name="sample_image"
                label="样品图片"
                imageList={task.sample_image}
                onImagesChange={(images) => setTask({...task, sample_image: images})}
                isEditing={isEditing}
            />

        </>
    )
} 