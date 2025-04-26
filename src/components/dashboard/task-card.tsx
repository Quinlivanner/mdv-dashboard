"use client"

import {Badge} from "../ui/badge";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {CheckCircle2, Clock3, Loader2, XCircle} from "lucide-react";
import {Progress} from "../ui/progress";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardShowTaskProgress } from "@/api/rad/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { ShareConfirmDialog } from "../share/confirm-dialog copy";
import { taskMilestoneNextStageRequest } from "@/api/rad/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



// 定义优先级图标和样式
const priorityIcons = {
    '高': <Badge variant="outline" className="ml-4 bg-[#FEF2F2] text-[#B45308] border-[#FECACA] text-xs">
        高
    </Badge>,
    '中': <Badge variant="outline" className="ml-4 bg-[#FFFBEB] text-[#B91B1C] border-[#FECACA] text-xs">
        中
    </Badge>,
    '低': <Badge variant="outline" className="ml-4 bg-[#D1FAE5] text-[#065F46] border-[#34D399] text-xs"> 低 
    </Badge>
}

// 进度状态
const progressStatus = {
    inProgress: <Badge variant="outline" className="ml-4 bg-[#FFFBEB] text-[#B45308] border-[#FDE68A] text-xs">
        <Clock3 className="w-4 h-4 mr-1"/>
        进行中
    </Badge>,
    // 绿色
    completed: <Badge variant="outline" className="ml-4 bg-[#D1FAE5] text-[#065F46] border-[#34D399] text-xs">
    <CheckCircle2 className="w-4 h-4 mr-1"/>
    已完成
</Badge>
}

// 配方状态
const formulaStatus = {
    "合格": <Badge variant="outline" className="absolute right-2 top-2 bg-green-50 text-green-600 border-green-100 text-xs">
    合格
</Badge>,
    "不合格": <Badge variant="outline" className="absolute right-2 top-2 bg-red-50 text-red-600 border-red-100 text-xs">
    不合格
</Badge>,
    "待定": <Badge variant="outline" className="absolute right-2 top-2 bg-red-50 bg-[#F5F5F5] text-[#64748B] border-[#E2E8F0] text-xs">
    待定
</Badge>,
}


interface TaskCardProps {
    data: DashboardShowTaskProgress
}


export function TaskCard({data}: TaskCardProps) {

    const router = useRouter()
    
    // 将props data转换为本地状态
    const [taskData, setTaskData] = useState<DashboardShowTaskProgress>(data);

    // 当外部data变化时，同步更新本地状态
    useEffect(() => {
        setTaskData(data);
    }, [data]);

    // 确认进入下一个阶段 dialog
    const [openNextStage, setOpenNextStage] = useState(false)
    // 提交请求下一阶段 loading
    const [isLoading, setIsLoading] = useState(false)


    // handle confirm
    const handleConfirm = () => {
        setOpenNextStage(false)
        setIsLoading(true)

        taskMilestoneNextStageRequest(taskData.index).then((res) => {
            console.log(res)
            if (res.code == 0 && res.data) {
                toast.success("进入下一阶段成功")
                setTaskData(res.data) // 使用setState更新本地状态
            } else{
                toast.error("进入下一阶段失败,原因：" + res.msg)
            }
        }).catch((err) => {
            toast.error("进入下一阶段失败,原因：" + err.message)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <>
        <Card className="shadow-md w-full gap-2 h-full flex flex-col justify-between transition-transform hover:scale-[0.99] @container/card" onClick={() => router.push(`/dashboard/design-tasks/${taskData.index}`)}>
            <CardHeader className="pb-0 @3xl:p-3">
                <div className="flex items-center">
                    <CardTitle className="text-lg flex items-center @3xl:text-base">
                    {taskData.srf_code} | {taskData.customer_name}
                    </CardTitle>
                    {taskData.progress == 100 ? (
                        progressStatus.completed
                    ) : (
                        progressStatus.inProgress
                    )}
                </div>
                <CardDescription>
                    <div className="flex flex-row text-xs">
                        <span className="text-sm @3xl:text-xs">负责人: {taskData.sales_name} / {taskData.engineer_name} | 优先级:</span>
                        {priorityIcons[taskData.priority_text as keyof typeof priorityIcons]}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="@3xl:p-3">
                <div className="productProgres flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span className="text-sm @3xl:text-xs">项目进度</span>
                        <span className="text-sm @3xl:text-xs">{taskData.progress}%</span>
                    </div>
                    <Progress value={taskData.progress} className="w-full"/>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs/6 text-muted-foreground">开始: {taskData.take_time}</span>
                    <span className="text-xs/6 text-muted-foreground">计划完成: {taskData.plan_end_date}</span>
                </div>
            </CardContent>
            
            <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-[5px] h-auto px-6 @3xl:px-3 @3xl:py-2">
                <div className="w-full h-full flex flex-col gap-2 p-3 @3xl:p-2 rounded-md">
                    <span className="text-sm font-bold @3xl:text-xs">里程碑</span>
                    <div
                        className="mileToneBox h-full w-full rounded-md p-2 overflow-y-auto max-h-[190px] @3xl:max-h-[150px] hover-scroll">
                        <ul className="flex flex-col gap-2 ">
                            {taskData.milestone.map((milestone, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm @3xl:text-xs">
                                    {milestone.is_finished ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 @3xl:w-3 @3xl:h-3"/>
                                    ) : (
                                        <Clock3 className="w-4 h-4 text-[#F59E0B] @3xl:w-3 @3xl:h-3"/>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="dark:text-white">{milestone.milestone_text}</span>
                                        <span className="text-xs @3xl:text-[10px] text-gray-500">{milestone.finished_time}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="w-full h-full flex flex-col gap-2 p-3 @3xl:p-2 rounded-md">
                    <span className="text-sm font-bold @3xl:text-xs">配方迭代</span>
                    <div className="h-full w-full rounded-md p-2 overflow-y-auto max-h-[190px] @3xl:max-h-[150px] hover-scroll">
                        <div className="flex flex-col gap-3 h-full">
                        {taskData.sample_formula.map((sample, index) => (
                                sample.status === "不合格" ? (
                                    <TooltipProvider key={index}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="relative p-3 @3xl:p-2 rounded-md border cursor-pointer hover:bg-slate-50 transition-colors hover:text-black">
                                                    {formulaStatus[sample.status as keyof typeof formulaStatus]}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm @3xl:text-xs font-medium">{sample.version}</span>
                                                        <span className="text-xs @3xl:text-[10px] text-gray-500 mt-1">{sample.create_at}</span>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className=" w-[280px] p-3 shadow-lg border border-border">
                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <span className="font-bold text-xs text-red-500">不合格原因：</span>
                                                        <p className="text-xs mt-1 ml-3">{sample.unqualified_reason || "无"}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-xs text-blue-500">AI分析：</span>
                                                        <p className="text-xs mt-1 ml-3">{sample.ai_analysis_unqualified_reason || "无分析"}</p>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <div key={index} className="relative p-3 @3xl:p-2 rounded-md border">
                                        {formulaStatus[sample.status as keyof typeof formulaStatus]}
                                        <div className="flex flex-col">
                                            <span className="text-sm @3xl:text-xs font-medium">{sample.version}</span>
                                            <span className="text-xs @3xl:text-[10px] text-gray-500 mt-1">{sample.create_at}</span>
                                        </div>
                                    </div>
                                )
                            ))}
                            {
                                taskData.sample_formula.length === 0 && (
                                    <div className="flex flex-col gap-2 h-full justify-center items-center shadow rounded-md p-3 @3xl:p-2">
                                        <span className="text-lg @3xl:text-sm text-muted-foreground">暂无配方迭代</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </CardFooter>
            <div className="w-[98%] mx-auto mt-auto mb-2">
                <Separator className="w-[90%]"/>
            </div>
            {
                taskData.status < 7 ? (
                    <Button onClick={(e) => {e.stopPropagation(); setOpenNextStage(true)}} className="w-[95%] mx-auto cursor-pointer @3xl:text-xs @3xl:h-8" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 ml-2 animate-spin"/>
                        ) : (
                            taskData.status_text + "完成"
                        )}
                    </Button>
                ):(
                    <Button disabled className="w-[95%] mx-auto cursor-pointer @3xl:text-xs @3xl:h-8">流程已完结</Button>
                )
            }
        </Card>

        <ShareConfirmDialog
            open={openNextStage}
            onOpenChange={setOpenNextStage}
            title="是否确认进入下一个阶段？"
            description={`该操作无法撤销，下一阶段为：${taskData.next_status}`}
            onConfirm={handleConfirm}
        />
        </>
    )
}