"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Printer, FileText, CheckCircle } from "lucide-react"
import { toast } from "sonner"

// 商机数据类型
interface OpportunityData {
  id: string
  projectCode: string
  projectName: string
  customerName: string
  projectManagerName: string
  salesName: string
  priorityName: string
  progress: number
  status: string
  // 其他字段
}

// 报价项目数据
interface QuotationItem {
  id: number
  description: string
  type: string
  specs: string[]
  quantity: number
  unitPrice: number
  totalPrice: number
}

export default function QuotationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [opportunityData, setOpportunityData] = useState<OpportunityData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 固定报价数据
  const [quotationItems] = useState<QuotationItem[]>([
    {
      id: 1,
      description: "中特舍 - 载客梯（货梯）",
      type: "电梯类别: 电力乘用梯",
      specs: [
        "电机功率: 20Kw",
        "数量: 2台",
        "速度: 0.6m/S",
        "轿厢尺寸: 1.4*2.4*2.5",
        "开门方式: 中分",
        "层/站/门: 2/2/2",
      ],
      quantity: 2,
      unitPrice: 43665000,
      totalPrice: 87330000
    },
    {
      id: 2,
      description: "中特舍 - 载客梯（货梯）",
      type: "电梯类别: 电力乘用梯",
      specs: [
        "电机功率: 13Kw",
        "数量: 1台",
        "速度: 1.6m",
        "轿厢尺寸: 1.4*2.4*2.5",
        "开门方式: 侧分",
        "层/站/门: 4/4/4",
      ],
      quantity: 1,
      unitPrice: 49015000,
      totalPrice: 49015000
    },
    {
      id: 3,
      description: "中特舍 - 载客梯（货梯）",
      type: "电梯类别: 电力乘用梯",
      specs: [
        "电机功率: 13Kw",
        "数量: 1台",
        "速度: 0.25m",
        "轿厢尺寸: 3.0*1.0*1.2",
        "开门方式: 侧分",
        "层/站/门: 3/3/3",
      ],
      quantity: 1,
      unitPrice: 28250000,
      totalPrice: 28250000
    }
  ])

  // 报价总金额
  const totalAmount = quotationItems.reduce((sum, item) => sum + item.totalPrice, 0)
  
  // 当组件加载时，从localStorage获取商机数据
  useEffect(() => {
    const fetchOpportunityData = () => {
      try {
        setIsLoading(true)
        const allOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]')
        const opportunity = allOpportunities.find((opp: any) => opp.id === params.id)
        
        if (opportunity) {
          setOpportunityData(opportunity)
        } else {
          toast.error("未找到商机信息")
          router.push('/dashboard')
        }
      } catch (error) {
        console.error("获取商机数据失败:", error)
        toast.error("获取商机数据失败")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOpportunityData()
  }, [params.id, router])

  // 处理下载报价单
  const handleDownloadQuotation = () => {
    toast.success("报价单下载中...")
    // 实际项目中这里可以生成PDF并下载
  }

  // 处理打印报价单
  const handlePrintQuotation = () => {
    window.print()
  }

  // 返回上一页
  const handleGoBack = () => {
    router.back()
  }

  // 加载中状态
  if (isLoading || !opportunityData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-[#00B4AA] rounded-full border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl print:py-0">
      {/* 顶部操作栏 - 打印时隐藏 */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" onClick={handleGoBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintQuotation} className="gap-2">
            <Printer className="h-4 w-4" />
            打印报价单
          </Button>
          <Button onClick={handleDownloadQuotation} className="bg-[#00B4AA] hover:bg-[#009B92] gap-2">
            <Download className="h-4 w-4" />
            下载报价单
          </Button>
        </div>
      </div>

      {/* 报价单内容 */}
      <Card className="shadow-sm border-t-4 border-t-[#00B4AA]">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-xl text-[#00B4AA]">报价单</CardTitle>
              <p className="text-sm text-muted-foreground">报价日期: {new Date().toLocaleDateString()}</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal">
              <CheckCircle className="h-3 w-3 mr-1" />
              报价已审批
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {/* 商机信息 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium mb-3">商机信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium w-24">项目名称:</span>
                  <span>{opportunityData.projectName}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">项目编号:</span>
                  <span>{opportunityData.projectCode}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">客户名称:</span>
                  <span>{opportunityData.customerName}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">项目状态:</span>
                  <span>{opportunityData.status}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">联系信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium w-24">销售人员:</span>
                  <span>{opportunityData.salesName}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">项目经理:</span>
                  <span>{opportunityData.projectManagerName}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">报价单号:</span>
                  <span>QT-{opportunityData.id}-{new Date().getFullYear()}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">有效期:</span>
                  <span>30天</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* 报价项目表格 */}
          <h3 className="text-sm font-medium mb-4">报价明细</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F7F7F7]">
                  <th className="text-left p-3 text-sm font-medium border">产品描述</th>
                  <th className="text-center p-3 text-sm font-medium border">数量</th>
                  <th className="text-right p-3 text-sm font-medium border">单价 (元)</th>
                  <th className="text-right p-3 text-sm font-medium border">金额 (元)</th>
                </tr>
              </thead>
              <tbody>
                {quotationItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 text-sm border">
                      <div className="font-medium">{item.description}</div>
                      <div className="text-muted-foreground text-xs mt-1">{item.type}</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                        {item.specs.map((spec, index) => (
                          <div key={index} className="text-xs text-muted-foreground">{spec}</div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-center border">{item.quantity}</td>
                    <td className="p-3 text-sm text-right border">{item.unitPrice.toLocaleString()}</td>
                    <td className="p-3 text-sm text-right border">{item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-[#F7F7F7]">
                  <td colSpan={2} className="p-3 text-sm border">
                    <div className="font-medium">小计</div>
                  </td>
                  <td className="p-3 border"></td>
                  <td className="p-3 text-sm font-medium text-right border">{totalAmount.toLocaleString()}</td>
                </tr>
                <tr className="bg-[#F7F7F7]">
                  <td colSpan={2} className="p-3 text-sm border">
                    <div className="font-medium">总计</div>
                  </td>
                  <td className="p-3 border"></td>
                  <td className="p-3 text-sm font-bold text-right border">{totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">备注</h3>
              <p className="text-sm text-muted-foreground">
                1. 产品的质量必须符合各国标准规格和相关使用要求。<br />
                2. 本报价不包含运费、安装、调试等费用，若需相关服务需另行协商。<br />
                3. 根据合同协定，本报价已经过客户确认无误。<br />
                4. A类配置，本价格不包含增值税。<br />
                5. 报价有效期自报价日起30天内有效。<br />
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* 页脚 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-muted-foreground mt-4">
            <div className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              <span>此报价单已通过审批，如有疑问请联系销售人员。</span>
            </div>
            <div>编号: QT-{params.id}-{new Date().getFullYear()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 