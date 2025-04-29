"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CalendarIcon, Edit, Building, Phone, Mail, MapPin, Clock, CheckCircle2, Calculator, Users, Activity, StickyNote, FileText, Plus, Upload, Download, MoreVertical, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { OpportunityData } from "@/components/dashboard/opportunity-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, RefreshCcw } from "lucide-react"
import { Calendar } from "lucide-react"

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<OpportunityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOpportunityDetails = () => {
      try {
        const id = params.id as string
        // 从localStorage获取所有商机
        const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]')
        // 找到当前id的商机
        const currentOpportunity = opportunities.find((opp: OpportunityData) => opp.id === id)
        
        if (currentOpportunity) {
          setOpportunity(currentOpportunity)
        } else {
          toast.error("未找到该商机信息")
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      } catch (error) {
        console.error("获取商机详情失败:", error)
        toast.error("获取商机详情失败")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpportunityDetails()
  }, [params.id, router])

  // 获取优先级标签样式
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case '高':
        // 使用 Midea 红色系
        return <Badge variant="outline" className="bg-[#F8BBD0]/50 text-[#E91E63] border-[#F8BBD0]">高</Badge>
      case '中':
        // 使用 Midea 橙色系
        return <Badge variant="outline" className="bg-[#FFECB3]/50 text-[#FF9800] border-[#FFECB3]">中</Badge>
      case '低':
        // 使用 Midea 青色系
        return <Badge variant="outline" className="bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB]">低</Badge>
      default:
        // 使用 Midea 灰色系
        return <Badge variant="outline" className="bg-[#E8E8E8]/50 text-[#505050] border-[#E8E8E8]">未知</Badge>
    }
  }

  // 获取阶段标签样式
  const getStageBadge = (stage: string) => {
    // 映射到 Midea 强调色
    const stageStyles: Record<string, string> = {
      "需求收集": "bg-[#B2EBF2]/50 text-[#0092D8] border-[#B2EBF2]", // Midea 浅蓝 / 主蓝
      "方案设计": "bg-[#D1C4E9]/50 text-[#8353B4] border-[#D1C4E9]", // Midea 浅紫 / 紫
      "技术交流": "bg-[#FFF9C4]/50 text-[#FFC107] border-[#FFF9C4]", // Midea 浅黄 / 黄 (调整文本色)
      "初步报价": "bg-[#F8BBD0]/50 text-[#E91E63] border-[#F8BBD0]", // Midea 浅粉 / 红
      "方案优化": "bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB]", // Midea 浅青 / 青
      "投标确认": "bg-[#D1C4E9]/50 text-[#8353B4] border-[#D1C4E9]", // 复用浅紫 / 紫
      "商务谈判": "bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB]", // 复用浅青 / 青
      "合同签订": "bg-[#B2EBF2]/50 text-[#0092D8] border-[#B2EBF2]", // 复用浅蓝 / 主蓝
      "设计确认": "bg-[#F8BBD0]/50 text-[#E91E63] border-[#F8BBD0]", // 复用浅粉 / 红
      "生产制造": "bg-[#FFF9C4]/50 text-[#FFC107] border-[#FFF9C4]", // 复用浅黄 / 黄
      "安装交付": "bg-[#FFECB3]/50 text-[#FF9800] border-[#FFECB3]", // Midea 浅橙 / 橙
      "售后服务": "bg-[#B2DFDB]/50 text-[#00B4AA] border-[#B2DFDB]"  // 复用浅青 / 青
    }
    
    // 默认使用 Midea 灰色系
    return <Badge variant="outline" className={stageStyles[stage] || "bg-[#E8E8E8]/50 text-[#505050] border-[#E8E8E8]"}>
      {stage}
    </Badge>
  }

  // 模拟项目动态数据
  const activities = [
    {
      type: 'status',
      title: '项目状态更新',
      description: '项目已进入方案设计阶段',
      time: '今天 09:45'
    },
    {
      type: 'message',
      title: '客户反馈',
      description: '客户对初步方案表示满意，要求增加两台观光电梯',
      time: '昨天 16:30'
    },
    {
      type: 'document',
      title: '文档更新',
      description: '上传了新版电梯配置清单',
      fileName: '电梯配置清单V2.xlsx',
      time: '昨天 14:15'
    },
    {
      type: 'meeting',
      title: '会议安排',
      description: '安排与客户进行方案讨论会议',
      time: '04-24 10:00'
    }
  ];

  // 模拟备注数据
  const notes = [
    {
      author: '李工程师',
      authorAvatar: '/avatars/engineer.png',
      content: '客户对价格非常敏感，需要优化方案降低成本。建议考虑国产部件替代进口部件。',
      time: '04-25 16:45',
      tags: ['价格敏感', '成本控制']
    },
    {
      author: '张销售',
      authorAvatar: '/avatars/sales.png',
      content: '客户决策周期较长，需要提前准备多套方案以应对可能的需求变更。',
      time: '04-23 11:30',
      tags: ['决策慢', '备选方案']
    }
  ];

  // 模拟文档数据
  const documents = [
    {
      name: '项目需求说明书.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: '04-20'
    },
    {
      name: '初步方案设计.doc',
      type: 'doc',
      size: '1.8 MB',
      uploadedAt: '04-22'
    },
    {
      name: '电梯配置表.xls',
      type: 'xls',
      size: '756 KB',
      uploadedAt: '04-24'
    },
    {
      name: '项目进度计划.ppt',
      type: 'ppt',
      size: '3.2 MB',
      uploadedAt: '04-25'
    }
  ];

  // 模拟联系人数据
  const contacts = [
    {
      name: '王建国',
      position: '项目经理',
      phone: '13812345678',
      email: 'wjg@example.com',
      wechat: 'wjg_pm',
      avatar: '/avatars/contact1.png'
    },
    {
      name: '李明',
      position: '技术主管',
      phone: '13987654321',
      email: 'lm@example.com',
      avatar: '/avatars/contact2.png'
    }
  ];

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0092D8]"></div>
          <p className="text-sm text-[#505050]">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果没有找到商机数据
  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-4xl">😢</div>
        <h1 className="text-2xl font-bold">未找到商机</h1>
        <p className="text-[#505050]">该商机可能已被删除或不存在</p>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
          className='ml-2'
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">{opportunity.projectName}</h1>
          {getPriorityBadge(opportunity.priorityName)}
        </div>
        <div className="flex gap-2 mr-2 ml-2">
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            联系客户
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            编辑详情
          </Button>
        </div>
      </div>

      {/* 添加操作卡片 - 应用 Midea 颜色 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4   px-2">
        <Card className="bg-[#0092D8]/5 hover:bg-[#0092D8]/10 cursor-pointer transition-colors ">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Calculator className="h-4 w-4 mr-2 text-[#0092D8]" />
              生成报价
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-[#505050]">基于项目需求生成详细报价方案</CardDescription>
          </CardContent>
        </Card>
        
        <Card className="bg-[#B2DFDB]/50 hover:bg-[#B2DFDB]/80 cursor-pointer transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-[#00B4AA]" />
              更新状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-[#505050]">更新项目阶段和完成情况</CardDescription>
          </CardContent>
        </Card>
        
        <Card className="bg-[#D1C4E9]/50 hover:bg-[#D1C4E9]/80 cursor-pointer transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2 text-[#8353B4]" />
              安排团队
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-[#505050]">分配工程师和销售团队</CardDescription>
          </CardContent>
        </Card>
        
        <Card className="bg-[#FFECB3]/50 hover:bg-[#FFECB3]/80 cursor-pointer transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Mail className="h-4 w-4 mr-2 text-[#FF9800]" />
              发送文档
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-[#505050]">向客户发送项目文档和报价</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        {/* 第一列：项目概况 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">项目概况</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#505050]">项目编号</span>
                <span className="text-sm font-medium">{opportunity.projectCode}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#505050]">当前阶段</span>
                <div>{getStageBadge(opportunity.status)}</div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#505050]">项目进度</span>
                  <span className="text-sm font-medium">{opportunity.progress}%</span>
                </div>
                <Progress value={opportunity.progress} className="h-2 [&>div]:bg-[#00B4AA]" />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#505050]">项目类型</span>
                <span className="text-sm font-medium">{opportunity.projectTypeName}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#505050]">客户类型</span>
                <span className="text-sm font-medium">{opportunity.customerTypeName || "未设置"}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#505050]">总投标额</span>
                <span className="text-sm font-medium">{opportunity.estimatedAmount} 万元</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#505050]">电梯数量</span>
                <span className="text-sm font-medium">{opportunity.elevatorCount} 台</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#505050]">预计签约日期</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <CalendarIcon className="h-3.5 w-3.5 text-[#505050]" />
                  {new Date(opportunity.expectedSignDate).toLocaleDateString()}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#505050]">创建日期</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <CalendarIcon className="h-3.5 w-3.5 text-[#505050]" />
                  {new Date(opportunity.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 第二列：客户信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">客户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-4 bg-[#E8E8E8]/30 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-[#0092D8]/10 flex items-center justify-center mr-4">
                <Building className="h-6 w-6 text-[#0092D8]" />
              </div>
              <div>
                <h3 className="font-medium">{opportunity.customerName}</h3>
                <p className="text-sm text-[#505050]">{opportunity.customerTypeName || "客户"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#505050] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">项目地址</p>
                  <p className="text-sm text-[#505050]">{opportunity.projectAddress || "未提供"}</p>
                  <p className="text-sm text-[#505050] mt-1">
                    <Badge variant="outline" className="font-normal border-[#E8E8E8] text-[#505050]">
                      {opportunity.locationName || "未知地区"}
                    </Badge>
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#505050] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">联系电话</p>
                  <p className="text-sm text-[#505050]">{opportunity.contactPhone || "未提供"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#505050] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">联系邮箱</p>
                  <p className="text-sm text-[#505050]">{opportunity.contactEmail || "未提供"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 text-[#505050] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">工程类型</p>
                  <p className="text-sm text-[#505050]">{opportunity.engineeringTypeName || "未指定"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 text-[#505050] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">行业分类</p>
                  <p className="text-sm text-[#505050]">{opportunity.industryTypeName || "未指定"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#505050] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">大盘采购</p>
                  <p className="text-sm text-[#505050]">{opportunity.isLargeProjectName || "否"}</p>
                </div>
              </div>
              
              {opportunity.contractCode && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Calculator className="h-4 w-4 text-[#505050] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">合同编号</p>
                      <p className="text-sm text-[#505050]">{opportunity.contractCode}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* 第三列：重要时间点 - 应用 Midea 颜色 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">重要时间点</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center p-3 bg-[#E8E8E8]/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-[#B2DFDB]/50 flex items-center justify-center mr-3">
                  <CheckCircle2 className="h-5 w-5 text-[#00B4AA]" />
                </div>
                <div>
                  <p className="text-xs text-[#505050]">项目创建</p>
                  <p className="font-medium">{new Date(opportunity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-[#E8E8E8]/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-[#0092D8]/10 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-[#0092D8]" />
                </div>
                <div>
                  <p className="text-xs text-[#505050]">当前状态: {opportunity.status}</p>
                  <p className="font-medium">{opportunity.progress}%</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-[#E8E8E8]/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-[#FFECB3]/50 flex items-center justify-center mr-3">
                  <CalendarIcon className="h-5 w-5 text-[#FF9800]" />
                </div>
                <div>
                  <p className="text-xs text-[#505050]">预计签约</p>
                  <p className="font-medium">{new Date(opportunity.expectedSignDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 选项卡区域 */}
      <Tabs defaultValue="activity" className="mt-6 px-2">
        <TabsList className="bg-background border border-[#E8E8E8]">
          <TabsTrigger value="activity" className="data-[state=active]:bg-[#E8E8E8]/50">
            <Activity className="h-4 w-4 mr-2" />
            项目动态
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-[#E8E8E8]/50">
            <StickyNote className="h-4 w-4 mr-2" />
            备注记录
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-[#E8E8E8]/50">
            <FileText className="h-4 w-4 mr-2" />
            项目文档
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-[#E8E8E8]/50">
            <Users className="h-4 w-4 mr-2" />
            联系人
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-4 pt-4 first:pt-0">
                    <div className="relative">
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.type === 'message' ? 'bg-[#B2EBF2]/50' :  // Midea 浅蓝
                        activity.type === 'status' ? 'bg-[#B2DFDB]/50' :   // Midea 浅青
                        activity.type === 'document' ? 'bg-[#FFECB3]/50' : // Midea 浅橙
                        activity.type === 'meeting' ? 'bg-[#D1C4E9]/50' :  // Midea 浅紫
                        'bg-[#E8E8E8]/50' // Midea 浅灰
                      }`}>
                        {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-[#0092D8]" />}
                        {activity.type === 'status' && <RefreshCcw className="h-4 w-4 text-[#00B4AA]" />}
                        {activity.type === 'document' && <FileText className="h-4 w-4 text-[#FF9800]" />}
                        {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-[#8353B4]" />}
                      </span>
                      {index < activities.length - 1 && (
                        // 使用 Midea 浅灰作为分割线
                        <span className="absolute top-8 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-[#E8E8E8]" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.title}</p>
                        {/* 使用 Midea 深灰色 */}
                        <time className="text-sm text-[#505050]">{activity.time}</time>
                      </div>
                      <p className="text-sm text-[#505050]">{activity.description}</p>
                      {activity.type === 'document' && (
                        <div className="mt-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#505050]" />
                          {/* 使用 Midea 主蓝色作为链接颜色 */}
                          <span className="text-sm font-medium underline cursor-pointer hover:text-[#0092D8]">
                            {activity.fileName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">备注记录</CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                添加备注
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <div key={index} className="border rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={note.authorAvatar} />
                          <AvatarFallback>{note.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{note.author}</span>
                      </div>
                      <time className="text-xs text-[#505050]">{note.time}</time>
                    </div>
                    <p className="text-sm">{note.content}</p>
                    {note.tags && (
                      <div className="flex items-center gap-2">
                        {note.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs border-[#E8E8E8] text-[#505050]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">项目文档</CardTitle>
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-1" />
                上传文档
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-3">
                {documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-md flex items-center justify-center ${
                        document.type === 'pdf' ? 'bg-[#F8BBD0]/50' : // Midea 浅粉
                        document.type === 'doc' ? 'bg-[#B2EBF2]/50' : // Midea 浅蓝
                        document.type === 'xls' ? 'bg-[#B2DFDB]/50' : // Midea 浅青
                        document.type === 'ppt' ? 'bg-[#FFECB3]/50' : // Midea 浅橙
                        'bg-[#E8E8E8]/50' // Midea 浅灰
                      }`}>
                        <FileText className={`h-5 w-5 ${
                          document.type === 'pdf' ? 'text-[#E91E63]' : // Midea 红
                          document.type === 'doc' ? 'text-[#0092D8]' : // Midea 主蓝
                          document.type === 'xls' ? 'text-[#00B4AA]' : // Midea 青
                          document.type === 'ppt' ? 'text-[#FF9800]' : // Midea 橙
                          'text-[#505050]' // Midea 深灰
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{document.name}</p>
                        <div className="flex items-center gap-2 text-xs text-[#505050]">
                          <span>{document.size}</span>
                          <span>•</span>
                          <span>{document.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">客户联系人</CardTitle>
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-1" />
                添加联系人
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-[#505050]">{contact.position}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-[#505050]" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-[#505050]" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.wechat && (
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="h-3.5 w-3.5 text-[#505050]" />
                          <span>{contact.wechat}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        电话
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        邮件
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  ) 
} 