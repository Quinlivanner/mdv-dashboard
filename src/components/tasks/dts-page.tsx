"use client"

import {useEffect, useState} from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import Task from "@/components/task-detail/Task"
import Sample from "@/components/task-detail/Sample"
import {DesignTaskDetail, DesignTaskDetailInfo} from "@/api/rad/types"
import {getDesignTaskDetailRequest, updateDesignTaskRequest} from "@/api/rad/api"
import {toast} from "sonner"
import SampleFormula from "@/components/task-detail/Sample-Formula"

interface ddtPageProps {
    index: string
}

export default function DesignTasksPage({index}: ddtPageProps) {

    console.log('params.index => ',index)

    const [designTaskDetail, setDesignTaskDetail] = useState<DesignTaskDetailInfo | null>(null)
    const [loading, setLoading] = useState(true)

    // 格式化后的数据，供组件使用
    const [taskData, setTaskData] = useState<DesignTaskDetailInfo | null>(null)

    const [samplesData, setSamplesData] = useState<any[]>([])


    // 获取设计任务详情
    const fetchDesignTaskDetail = async () => {
        try {
            setLoading(true)
            const res = await getDesignTaskDetailRequest(index)
            if (res.code === 0 && res.data) {
                console.log('res.data => ',res.data)
                setDesignTaskDetail(res.data)
                setTaskData(res.data)
            } else {
                toast.error(res.msg || "获取设计任务详情失败")
            }
        } catch (error) {
            console.error("获取设计任务详情出错:", error)
            toast.error("获取设计任务详情失败，请重试")
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchDesignTaskDetail()
    }, [index])

    //保存任务修改
    const handleTaskSave = async (updatedTask: any) => {
        // 这里将来会调用API保存更改
        // setTaskData(updatedTask)
        console.log('updatedTask => ',updatedTask)
        try {
            // 调用API更新数据
            const response = await updateDesignTaskRequest(index, updatedTask);
            if (response.code === 0) {
              toast.success("设计任务书更新成功");  
              setTaskData(response.data)
              return response.data
            } else {
              toast.error(`更新失败: ${response.msg}`);
              return null
            }
          } catch (error) {
            toast.error("更新失败，请稍后重试");
            return null
          }
    }

    //处理样品列表更新
    const handleSamplesChange = (updatedSamples: any[]) => {
        // 这里将来会调用API保存更改
        setSamplesData(updatedSamples)
    }

    if (loading) {
        // 用转圈
        return <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative w-12 h-12">
                <div className="absolute w-full h-full border-4 border-muted rounded-full"></div>
                <div
                    className="absolute w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    }

    if (!designTaskDetail || !taskData) {
        return <div className="flex items-center justify-center min-h-[60vh]">未找到设计任务详情</div>
    }

    return (
        <div className="container mx-auto py-4 px-3 sm:px-4 sm:py-6">
            <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">{taskData.srf_code}</h1>
                <p className="text-muted-foreground">状态: {taskData.status_text}</p>
            </div>

            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="mb-4 sm:mb-6 w-full flex">
                    <TabsTrigger value="basic-info" className="flex-1">基本信息</TabsTrigger>
                    <TabsTrigger value="sample-details" className="flex-1">样品列表</TabsTrigger>
                    <TabsTrigger value="sample-formula" className="flex-1">配方表</TabsTrigger>
                </TabsList>

                {/* 基本信息标签内容 */}
                <TabsContent value="basic-info">
                    <Task task={taskData} onSave={handleTaskSave}/>
                </TabsContent>

                {/* 样品详情标签内容 */}
                <TabsContent value="sample-details">
                    <Sample designTaskIndex={index}  onSamplesChange={handleSamplesChange}/>
                </TabsContent>

                {/* 样品配方表标签内容 */}
                <TabsContent value="sample-formula">
                    <SampleFormula designTaskIndex={index}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}
