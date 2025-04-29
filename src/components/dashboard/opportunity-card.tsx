"use client"

import {Badge} from "../ui/badge";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {CheckCircle2, Clock3, Loader2, Calculator, Edit, ArrowRight, Building, Phone, Mail, MapPin,Captions, ChevronDown, Pencil, MoreHorizontal, CircleDashed, ReceiptText, Download} from "lucide-react";
import {Progress} from "../ui/progress";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hasElevatorSelection, isElevatorSelectionSubmitted } from '@/lib/elevator-selection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// 定义优先级图标和样式 - 使用 Midea 颜色
const priorityIcons = {
    '高': <Badge variant="outline" className="ml-4 bg-[#F8BBD0]/50 text-[#E91E63] border-[#F8BBD0] text-xs">
        高
    </Badge>,
    '中': <Badge variant="outline" className="ml-4 bg-[#FFECB3]/50 text-[#FF9800] border-[#FFECB3] text-xs">
        中
    </Badge>,
    '低': <Badge variant="outline" className="ml-4 bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB] text-xs"> 低 
    </Badge>
}

// 进度状态 - 使用 Midea 颜色
const progressStatus = {
    inProgress: <Badge variant="outline" className="ml-4 bg-[#FFECB3]/50 text-[#FF9800] border-[#FFECB3] text-xs">
        <Clock3 className="w-4 h-4 mr-1 text-[#FF9800]"/>
        进行中
    </Badge>,
    completed: <Badge variant="outline" className="ml-4 bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB] text-xs">
        <CheckCircle2 className="w-4 h-4 mr-1 text-[#00B4AA]"/>
        已完成
    </Badge>
}

// 流程阶段状态 - 使用 Midea 颜色
const stageStatus = {
    "需求收集": <Badge variant="outline" className="bg-[#B2EBF2]/50 text-[#0092D8] border-[#B2EBF2] text-xs">
        需求收集
    </Badge>,
    "方案设计": <Badge variant="outline" className="bg-[#D1C4E9]/50 text-[#8353B4] border-[#D1C4E9] text-xs">
        方案设计
    </Badge>,
    "技术交流": <Badge variant="outline" className="bg-[#FFF9C4]/50 text-[#FFC107] border-[#FFF9C4] text-xs">
        技术交流
    </Badge>,
    "初步报价": <Badge variant="outline" className="bg-[#F8BBD0]/50 text-[#E91E63] border-[#F8BBD0] text-xs">
        初步报价
    </Badge>,
    "方案优化": <Badge variant="outline" className="bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB] text-xs">
        方案优化
    </Badge>,
    "投标确认": <Badge variant="outline" className="bg-[#D1C4E9]/50 text-[#8353B4] border-[#D1C4E9] text-xs">
        投标确认
    </Badge>,
    "商务谈判": <Badge variant="outline" className="bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB] text-xs">
        商务谈判
    </Badge>,
    "合同签订": <Badge variant="outline" className="bg-[#B2EBF2]/50 text-[#0092D8] border-[#B2EBF2] text-xs">
        合同签订
    </Badge>,
    "设计确认": <Badge variant="outline" className="bg-[#F8BBD0]/50 text-[#E91E63] border-[#F8BBD0] text-xs">
        设计确认
    </Badge>,
    "生产制造": <Badge variant="outline" className="bg-[#FFF9C4]/50 text-[#FFC107] border-[#FFF9C4] text-xs">
        生产制造
    </Badge>,
    "安装交付": <Badge variant="outline" className="bg-[#FFECB3]/50 text-[#FF9800] border-[#FFECB3] text-xs">
        安装交付
    </Badge>,
    "售后服务": <Badge variant="outline" className="bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB] text-xs">
        售后服务
    </Badge>
}

// 商机数据类型
export interface OpportunityData {
    id: string;
    projectCode: string;
    projectName: string;
    customerName: string;
    projectManagerName: string;
    salesName: string;
    salesAssistantName?: string;
    priorityName: string;
    progress: number;
    status: string;
    createdAt: string;
    expectedSignDate: string;
    estimatedAmount: string;
    elevatorCount: string;
    projectTypeName: string;
    customerTypeName?: string;
    locationName?: string;
    projectAddress?: string;
    engineeringTypeName?: string;
    industryTypeName?: string;
    isLargeProjectName?: string;
    contractCode?: string;
    contactPhone?: string;
    contactEmail?: string;
    // 其他字段...
}

interface OpportunityCardProps {
    data: OpportunityData;
    onUpdate: () => void;
}

// 修改进度的schema
const updateProgressSchema = z.object({
    progress: z.string().refine((val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0 && num <= 100;
    }, {
        message: "进度必须是0-100之间的数字",
    }),
});

// 编辑商机的schema
const editOpportunitySchema = z.object({
    projectName: z.string().min(2, { message: "项目名称至少需要2个字符" }),
    customerName: z.string().min(2, { message: "客户名称至少需要2个字符" }),
    projectTypeName: z.string().min(1, { message: "请选择项目类型" }),
    elevatorCount: z.string().min(1, { message: "请输入电梯数量" }),
    estimatedAmount: z.string().min(1, { message: "请输入投标额" }),
    projectAddress: z.string().optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email({ message: "请输入有效的邮箱地址" }).optional().or(z.literal("")),
});

export function OpportunityCard({ data, onUpdate }: OpportunityCardProps) {
    const router = useRouter();
    const [opportunityData, setOpportunityData] = useState<OpportunityData>(data);
    const [openProgressDialog, setOpenProgressDialog] = useState(false);
    const [openNextStageDialog, setOpenNextStageDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openContractDialog, setOpenContractDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectionSubmitted, setIsSelectionSubmitted] = useState(false);

    // 当外部data变化时，同步更新本地状态
    useEffect(() => {
        setOpportunityData(data);
    }, [data]);

    // 检查电梯选型状态
    useEffect(() => {
        // 检查是否已提交选型
        setIsSelectionSubmitted(isElevatorSelectionSubmitted(opportunityData.id));
        
        // 为第一个商机（万科城市之光，ID: 1001）设置一个默认的已提交电梯选型
        if (opportunityData.id === "1001" && !isElevatorSelectionSubmitted("1001")) {
            // 创建默认的电梯选型数据
            const defaultElevatorSelection = {
                liftModel: "MK8000",
                capacity: 1000,
                speed: 1.75,
                travelHeight: 60,
                carWidth: 1600,
                carDepth: 1500,
                carHeight: 2300,
                cwtPosition: "SIDE",
                cwtSafetyGear: false,
                doorOpening: "CO",
                doorWidth: 900,
                doorHeight: 2100,
                throughDoor: false,
                glassDoor: false,
                standard: "EN81",
                doorCenterPosition: "CENTERED",
                floorExceedCode: false,
                shaftTolerance: "NORMAL",
                marbleFloorThickness: 40,
                isSubmitted: true,
                submittedAt: new Date().toISOString()
            };
            
            // 保存到localStorage
            localStorage.setItem(`elevatorSelectionData-1001`, JSON.stringify(defaultElevatorSelection));
            
            // 更新提交状态映射表
            let submittedOpportunities: {[key: string]: boolean} = {};
            try {
                const saved = localStorage.getItem('submittedElevatorSelections');
                if (saved) {
                    submittedOpportunities = JSON.parse(saved);
                }
            } catch (e) {
                console.error('读取提交状态失败', e);
            }
            
            // 添加1001商机的提交状态
            submittedOpportunities["1001"] = true;
            localStorage.setItem('submittedElevatorSelections', JSON.stringify(submittedOpportunities));
            
            // 重新检查状态
            setIsSelectionSubmitted(true);
        }
    }, [opportunityData.id]);

    // 进度表单
    const progressForm = useForm<{ progress: string }>({
        resolver: zodResolver(updateProgressSchema),
        defaultValues: {
            progress: opportunityData.progress.toString(),
        },
    });

    // 编辑表单
    const editForm = useForm<z.infer<typeof editOpportunitySchema>>({
        resolver: zodResolver(editOpportunitySchema),
        defaultValues: {
            projectName: opportunityData.projectName,
            customerName: opportunityData.customerName,
            projectTypeName: opportunityData.projectTypeName,
            elevatorCount: opportunityData.elevatorCount,
            estimatedAmount: opportunityData.estimatedAmount,
            projectAddress: opportunityData.projectAddress || "",
            contactPhone: opportunityData.contactPhone || "",
            contactEmail: opportunityData.contactEmail || "",
        },
    });

    // 流程阶段映射
    const stageFlow = [
        "需求收集", "方案设计", "技术交流", "初步报价", 
        "方案优化", "投标确认", "商务谈判", "合同签订", 
        "设计确认", "生产制造", "安装交付", "售后服务"
    ];

    // 获取下一个阶段
    const getNextStage = (currentStage: string) => {
        const currentIndex = stageFlow.indexOf(currentStage);
        if (currentIndex < stageFlow.length - 1) {
            return stageFlow[currentIndex + 1];
        }
        return null;
    };

    // 更新进度
    const handleUpdateProgress = (values: { progress: string }) => {
        setIsLoading(true);
        try {
            // 获取现有商机
            const existingOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
            // 找到并更新当前商机
            const updatedOpportunities = existingOpportunities.map((opp: OpportunityData) => 
                opp.id === opportunityData.id 
                    ? { ...opp, progress: parseInt(values.progress) } 
                    : opp
            );
            // 保存回localStorage
            localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
            
            // 更新本地状态
            setOpportunityData({
                ...opportunityData,
                progress: parseInt(values.progress)
            });
            
            toast.success("进度更新成功！");
            onUpdate(); // 通知父组件刷新数据
            setOpenProgressDialog(false);
        } catch (error) {
            console.error("更新进度失败:", error);
            toast.error("更新进度失败，请重试");
        } finally {
            setIsLoading(false);
        }
    };

    // 进入下一阶段
    const handleNextStage = () => {
        setIsLoading(true);
        try {
            const nextStage = getNextStage(opportunityData.status);
            if (!nextStage) {
                toast.error("已经是最后一个阶段");
                setOpenNextStageDialog(false);
                setIsLoading(false);
                return;
            }

            // 获取现有商机
            const existingOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
            
            // 根据阶段设置新的进度
            const stageIndex = stageFlow.indexOf(nextStage);
            const newProgress = Math.min(Math.round(((stageIndex + 1) / stageFlow.length) * 100), 100);
            
            // 找到并更新当前商机
            const updatedOpportunities = existingOpportunities.map((opp: OpportunityData) => 
                opp.id === opportunityData.id 
                    ? { ...opp, status: nextStage, progress: newProgress } 
                    : opp
            );
            
            // 保存回localStorage
            localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
            
            // 更新本地状态
            setOpportunityData({
                ...opportunityData,
                status: nextStage,
                progress: newProgress
            });
            
            toast.success(`已进入${nextStage}阶段`);
            onUpdate(); // 通知父组件刷新数据
            setOpenNextStageDialog(false);
        } catch (error) {
            console.error("更新阶段失败:", error);
            toast.error("更新阶段失败，请重试");
        } finally {
            setIsLoading(false);
        }
    };

    // 编辑商机信息
    const handleEditOpportunity = (values: z.infer<typeof editOpportunitySchema>) => {
        setIsLoading(true);
        try {
            // 获取现有商机
            const existingOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
            
            // 找到并更新当前商机
            const updatedOpportunities = existingOpportunities.map((opp: OpportunityData) => 
                opp.id === opportunityData.id 
                    ? { 
                        ...opp, 
                        projectName: values.projectName,
                        customerName: values.customerName,
                        projectTypeName: values.projectTypeName,
                        elevatorCount: values.elevatorCount,
                        estimatedAmount: values.estimatedAmount,
                        projectAddress: values.projectAddress,
                        contactPhone: values.contactPhone,
                        contactEmail: values.contactEmail
                      } 
                    : opp
            );
            
            // 保存回localStorage
            localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
            
            // 更新本地状态
            setOpportunityData({
                ...opportunityData,
                projectName: values.projectName,
                customerName: values.customerName,
                projectTypeName: values.projectTypeName,
                elevatorCount: values.elevatorCount,
                estimatedAmount: values.estimatedAmount,
                projectAddress: values.projectAddress,
                contactPhone: values.contactPhone,
                contactEmail: values.contactEmail
            });
            
            toast.success("商机信息更新成功！");
            onUpdate(); // 通知父组件刷新数据
            setOpenEditDialog(false);
        } catch (error) {
            console.error("更新商机信息失败:", error);
            toast.error("更新商机信息失败，请重试");
        } finally {
            setIsLoading(false);
        }
    };

    // 前往电梯选型页面
    const handleGoToSelection = () => {
        router.push(`/dashboard/opportunity/${opportunityData.id}/elevator-selection`);
    };

    // 前往报价页面
    const handleGoToQuotation = () => {
        router.push(`/dashboard/opportunity/${opportunityData.id}/quotation`);
    };

    // 处理查看合同
    const handleViewContract = () => {
        setOpenContractDialog(true);
    };

    // 处理下载合同
    const handleDownloadContract = () => {
        // 创建一个链接指向PDF文件
        const link = document.createElement('a');
        link.href = '/data/SCAN - 越南京东方整机二期项目设备合同-货梯.pdf';
        link.download = 'SCAN - 越南京东方整机二期项目设备合同-货梯.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Card className="shadow-md w-full gap-2 h-full flex flex-col justify-between transition-transform hover:scale-[0.99] @container/card">
                <CardHeader className="pb-0 @3xl:p-3">
                    <div className="flex items-center">
                        <CardTitle className="text-lg flex items-center @3xl:text-base">
                            {opportunityData.projectName || "未命名项目"}
                        </CardTitle>
                        {opportunityData.progress == 100 ? (
                            progressStatus.completed
                        ) : (
                            progressStatus.inProgress
                        )}
                    </div>
                    <CardDescription>
                        <div className="flex flex-row items-center text-xs">
                            <span className="text-sm @3xl:text-xs font-medium mr-1">项目号:</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* 保留前10个字符..补全*/}
                                        <span className="text-sm @3xl:text-xs font-bold">{opportunityData.projectCode.slice(0, 10)}...</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <span className="text-sm @3xl:text-xs font-bold">{opportunityData.projectCode}</span>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            {/* <span className="text-sm @3xl:text-xs font-bold">{opportunityData.projectCode}</span> */}
                            <span className="mx-2 text-[#E8E8E8]">|</span>
                            <span className="text-sm @3xl:text-xs font-medium mr-1">客户:</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* 保留前10个字符 */}
                                        <span className="text-sm @3xl:text-xs">{opportunityData.customerName.slice(0, 10)}...</span>
                                        </TooltipTrigger>
                                    <TooltipContent>
                                    <span className="text-sm @3xl:text-xs">{opportunityData.customerName}</span>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            <span className="mx-2 text-[#E8E8E8]">|</span>
                            {priorityIcons[opportunityData.priorityName as keyof typeof priorityIcons]}
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="@3xl:p-3 mt-2">
                    <div className="productProgres flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span className="text-sm @3xl:text-xs">项目进度</span>
                            <span className="text-sm @3xl:text-xs">{opportunityData.progress}%</span>
                        </div>
                        <Progress value={opportunityData.progress} className="w-full h-2 [&>div]:bg-[#00B4AA]"/>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                            {isSelectionSubmitted ? (
                                <Badge variant="outline" className="bg-[#FFD7CD]/50 text-[#F56428] border-[#F56428] flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-1 text-[#F56428]" />
                                    已提交选型等待报价审批
                                </Badge>
                            ) : data.id === "1003" ? (
                                <Badge variant="outline" className="bg-[#C8F0F0]/50 text-[#00B4AA] border-[#00B4AA] flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-1 text-[#00B4AA]" />
                                    报价已审批等待合同签订
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-[#D7D2E6]/50 text-[#6E50B4] border-[#6E50B4] flex items-center">
                                    <CircleDashed className="w-3 h-3 mr-1 text-[#6E50B4]" />
                                    商机已建立待选型
                                </Badge>
                            )}
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenProgressDialog(true);
                                }}
                            >
                                <Edit className="h-3 w-3 mr-1" />
                                进度
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                            <div className="flex items-center gap-1 text-[#505050]">
                                <Building className="h-3.5 w-3.5" />
                                <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                    {opportunityData.engineeringTypeName || "未指定"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-[#505050] justify-end">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                    {opportunityData.locationName || "未指定"}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-[#505050]">项目类型</span>
                                <span className="text-sm font-medium">{opportunityData.projectTypeName}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs text-[#505050]">电梯数量</span>
                                <span className="text-sm font-medium">{opportunityData.elevatorCount}台</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-[#505050]">总投标额</span>
                                <span className="text-sm font-medium">{opportunityData.estimatedAmount}万元</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs text-[#505050]">预计签约</span>
                                <span className="text-sm font-medium">{opportunityData.expectedSignDate.split('T')[0]}</span>
                            </div>
                        </div>
                    </div>
                    
                    <Separator className="my-3 bg-[#E8E8E8]" />
                    
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">负责人:</span>
                            <span className="text-xs">{opportunityData.salesName} / {opportunityData.projectManagerName}</span>
                        </div>
                        {opportunityData.salesAssistantName && (
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">销售助理:</span>
                                <span className="text-xs">{opportunityData.salesAssistantName}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">创建日期:</span>
                            <span className="text-xs">{new Date(opportunityData.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-2 pt-2">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-2">

                            {/* <Button 
                                className="flex-1 cursor-pointer @3xl:text-xs h-9 bg-[#E11E50] hover:bg-[#F0D2DC] hover:text-[#E11E50]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenNextStageDialog(true);
                                }}
                                disabled={getNextStage(opportunityData.status) === null}
                            >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                下一阶段
                            </Button> */}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                        <Button 
                                className="flex-1 cursor-pointer @3xl:text-xs h-9"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/dashboard/opportunity/${opportunityData.id}`);
                                }}
                            >
                                <Calculator className="w-4 h-4 mr-2" />
                                查看详情
                            </Button>
                            {
                                data.id === "1003" ? (
                                    <>
                                    <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center"
                                    onClick={handleGoToQuotation}
                                >
                                    <Calculator className="mr-1 h-4 w-4" />
                                   查看报价
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center bg-[#005FC8] text-white hover:bg-[#005FC8]/80 hover:text-white hover:cursor-pointer"
                                    onClick={handleViewContract}
                                >   
                                    <ReceiptText className="mr-1 h-4 w-4" />
                                    生成合同
                                </Button>
                                    </>
                                )   :(
                                <Button 
                                size="sm" 
                                variant="outline"
                                className="flex items-center"
                                onClick={handleGoToSelection}
                            >
                                <Calculator className="mr-1 h-4 w-4" />
                                {isSelectionSubmitted ? "查看选型" : "电梯选型"}
                            </Button>
                            )
                            }
                        </div>
                    </div>
                </CardFooter>
            </Card>

            {/* 修改进度对话框 */}
            <Dialog open={openProgressDialog} onOpenChange={setOpenProgressDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>修改项目进度</DialogTitle>
                    </DialogHeader>
                    <Form {...progressForm}>
                        <form onSubmit={progressForm.handleSubmit(handleUpdateProgress)} className="space-y-4">
                            <FormField
                                control={progressForm.control}
                                name="progress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>进度 (0-100)</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" min="0" max="100" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "更新中..." : "更新进度"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* 进入下一阶段对话框 */}
            <Dialog open={openNextStageDialog} onOpenChange={setOpenNextStageDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>进入下一阶段</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>当前阶段: {opportunityData.status}</p>
                        <p className="mt-2">下一阶段: {getNextStage(opportunityData.status)}</p>
                        <p className="mt-4 text-[#FF9800]">确认要进入下一阶段吗？此操作无法撤销。</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenNextStageDialog(false)}>
                            取消
                        </Button>
                        <Button onClick={handleNextStage} disabled={isLoading}>
                            {isLoading ? "处理中..." : "确认"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* 编辑商机信息对话框 */}
            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>编辑商机信息</DialogTitle>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEditOpportunity)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={editForm.control}
                                    name="projectName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>项目名称</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>客户名称</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="projectTypeName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>项目类型</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="选择项目类型" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="住宅">住宅</SelectItem>
                                                    <SelectItem value="商业">商业</SelectItem>
                                                    <SelectItem value="工业">工业</SelectItem>
                                                    <SelectItem value="公共建筑">公共建筑</SelectItem>
                                                    <SelectItem value="改造项目">改造项目</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="elevatorCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>电梯数量</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="estimatedAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>总投标额(万元)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="projectAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>项目地址</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="contactPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>联系电话</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="contactEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>联系邮箱</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpenEditDialog(false)} type="button">
                                    取消
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "更新中..." : "保存修改"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* 查看合同对话框 */}
            <Dialog open={openContractDialog} onOpenChange={setOpenContractDialog}>
                <DialogContent className="max-w-[95vw] max-h-[90vh] w-[1400px] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>合同文件</DialogTitle> 
                    </DialogHeader>
                    <div className="flex-1 overflow-auto p-1 min-h-[700px]">
                        <iframe 
                            src="/data/SCAN - 越南京东方整机二期项目设备合同-货梯.pdf" 
                            width="100%" 
                            height="100%" 
                            style={{ minHeight: '700px', border: 'none' }}
                        />
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={handleDownloadContract} variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            下载合同
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 