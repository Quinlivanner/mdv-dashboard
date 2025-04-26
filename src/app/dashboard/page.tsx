"use client"
import {SectionCards} from "@/components/dashboard/section-cards"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Search, Plus} from "lucide-react"
import {Input} from "@/components/ui/input"
import {useEffect, useState} from "react"
import { toast } from "sonner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InboxIcon } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { OpportunityCard, OpportunityData } from "@/components/dashboard/opportunity-card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('')
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([])
  const [filter, setFilter] = useState("all")
  
  // 使用防抖处理搜索词，默认延迟300ms
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // 初始化应用数据
  const initAppData = () => {
    // 检查并初始化商机数据
    if (!localStorage.getItem('opportunities') || JSON.parse(localStorage.getItem('opportunities') || '[]').length === 0) {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      // 创建默认商机数据
      const defaultOpportunities = [
        {
          id: "1001",
          projectCode: "ELV-2025-1001",
          projectName: "万科城市之光",
          customerName: "万科地产",
          projectManagerName: "张三",
          salesName: "李四",
          salesAssistantName: "赵六",
          priorityName: "高",
          progress: 85,
          status: "合同签订",
          createdAt: today.toISOString(),
          expectedSignDate: nextMonth.toISOString(),
          estimatedAmount: "380",
          elevatorCount: "12",
          projectTypeName: "新梯项目",
          customerTypeName: "外销",
          locationName: "上海",
          projectAddress: "上海市浦东新区陆家嘴环路1000号",
          engineeringTypeName: "住宅电梯",
          industryTypeName: "房地产",
          isLargeProjectName: "否",
          contractCode: "CNT-2025-10001",
          contactPhone: "13912345678",
          contactEmail: "contact@example.com"
        },
        {
          id: "1002",
          projectCode: "ELV-2025-1002",
          projectName: "碧桂园黄金时代",
          customerName: "碧桂园",
          projectManagerName: "王五",
          salesName: "张三",
          salesAssistantName: "赵六",
          priorityName: "中",
          progress: 40,
          status: "初步报价",
          createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expectedSignDate: new Date(nextMonth.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedAmount: "210",
          elevatorCount: "8",
          projectTypeName: "新梯项目",
          customerTypeName: "外销",
          locationName: "北京",
          projectAddress: "北京市朝阳区建国路88号",
          engineeringTypeName: "商用电梯",
          industryTypeName: "商业中心",
          isLargeProjectName: "是",
          contractCode: "",
          contactPhone: "13987654321",
          contactEmail: "business@example.com"
        },
        {
          id: "1003",
          projectCode: "ELV-2025-1003",
          projectName: "保利未来城",
          customerName: "保利发展",
          projectManagerName: "李四",
          salesName: "王五",
          salesAssistantName: "张三",
          priorityName: "低",
          progress: 15,
          status: "需求收集",
          createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          expectedSignDate: new Date(nextMonth.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedAmount: "150",
          elevatorCount: "5",
          projectTypeName: "旧梯改造",
          customerTypeName: "内销",
          locationName: "广州",
          projectAddress: "广州市天河区天河路101号",
          engineeringTypeName: "货梯",
          industryTypeName: "政府机构",
          isLargeProjectName: "否",
          contractCode: "",
          contactPhone: "13511223344",
          contactEmail: "contact2@example.com"
        },
        {
          id: "1004",
          projectCode: "ELV-2025-1004",
          projectName: "龙湖天街广场",
          customerName: "龙湖地产",
          projectManagerName: "赵六",
          salesName: "李四",
          salesAssistantName: "王五",
          priorityName: "高",
          progress: 60,
          status: "投标确认",
          createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          expectedSignDate: new Date(nextMonth.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedAmount: "420",
          elevatorCount: "15",
          projectTypeName: "新梯项目",
          customerTypeName: "外销",
          locationName: "深圳",
          projectAddress: "深圳市福田区中心区8号",
          engineeringTypeName: "观光电梯",
          industryTypeName: "商业中心",
          isLargeProjectName: "是",
          contractCode: "",
          contactPhone: "13866778899",
          contactEmail: "business2@example.com"
        },
        {
          id: "1005",
          projectCode: "ELV-2025-1005",
          projectName: "恒大云端",
          customerName: "恒大集团",
          projectManagerName: "张三",
          salesName: "王五",
          salesAssistantName: "李四",
          priorityName: "高",
          progress: 25,
          status: "方案设计",
          createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          expectedSignDate: new Date(nextMonth.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedAmount: "290",
          elevatorCount: "10",
          projectTypeName: "新梯项目",
          customerTypeName: "外销",
          locationName: "杭州",
          projectAddress: "杭州市西湖区文三路500号",
          engineeringTypeName: "住宅电梯",
          industryTypeName: "房地产",
          isLargeProjectName: "是",
          contractCode: "",
          contactPhone: "13599887766",
          contactEmail: "contact3@example.com"
        },
        {
          id: "1006",
          projectCode: "ELV-2025-1006",
          projectName: "中海国际中心",
          customerName: "中海地产",
          projectManagerName: "赵六",
          salesName: "张三",
          salesAssistantName: "王五",
          priorityName: "中",
          progress: 75,
          status: "商务谈判",
          createdAt: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          expectedSignDate: new Date(nextMonth.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedAmount: "530",
          elevatorCount: "18",
          projectTypeName: "新梯项目",
          customerTypeName: "外销",
          locationName: "北京",
          projectAddress: "北京市朝阳区建国门外大街1号",
          engineeringTypeName: "观光电梯",
          industryTypeName: "商业中心",
          isLargeProjectName: "是",
          contractCode: "",
          contactPhone: "13455667788",
          contactEmail: "business3@example.com"
        },
        {
          id: "1007",
          projectCode: "ELV-2025-1007",
          projectName: "复宏医院大楼",
          customerName: "复宏医院",
          projectManagerName: "李四",
          salesName: "赵六",
          salesAssistantName: "张三",
          priorityName: "低",
          progress: 50,
          status: "方案优化",
          createdAt: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          expectedSignDate: new Date(nextMonth.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedAmount: "180",
          elevatorCount: "6",
          projectTypeName: "新梯项目",
          customerTypeName: "内销",
          locationName: "上海",
          projectAddress: "上海市虹口区四川北路1500号",
          engineeringTypeName: "医用电梯",
          industryTypeName: "医院",
          isLargeProjectName: "否",
          contractCode: "",
          contactPhone: "13911223344",
          contactEmail: "hospital@example.com"
        },
        {
          id: "1008",
          projectCode: "ELV-2025-1008",
          projectName: "星河湾别墅区",
          customerName: "星河湾集团",
          projectManagerName: "王五",
          salesName: "张三",
          salesAssistantName: "李四",
          priorityName: "高",
          progress: 100,
          status: "售后服务",
          createdAt: new Date(today.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          expectedSignDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedAmount: "320",
          elevatorCount: "24",
          projectTypeName: "新梯项目",
          customerTypeName: "外销",
          locationName: "广州",
          projectAddress: "广州市番禺区星河湾社区1号",
          engineeringTypeName: "家用电梯",
          industryTypeName: "房地产",
          isLargeProjectName: "是",
          contractCode: "CNT-2024-55201",
          contactPhone: "13788996655",
          contactEmail: "villas@example.com"
        }
      ];
      
      // 保存默认商机数据到localStorage
      localStorage.setItem('opportunities', JSON.stringify(defaultOpportunities));
      console.log('已初始化默认商机数据');
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  // 从localStorage获取商机数据
  const fetchOpportunities = () => {
    try {
      const storedOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      
      // 应用过滤器
      let filteredOpportunities = [...storedOpportunities];
      
      // 搜索过滤
      if (debouncedSearchTerm) {
        filteredOpportunities = filteredOpportunities.filter(opp => 
          (opp.projectCode?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
          (opp.customerName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
          (opp.projectManagerName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
          (opp.salesName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
          (opp.projectName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        );
      }
      
      // 应用tab过滤器
      if (filter === "highPriority") {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.priorityName === "高");
      } else if (filter === "progress") {
        filteredOpportunities.sort((a, b) => b.progress - a.progress);
      }
      
      setOpportunities(filteredOpportunities);
    } catch (error) {
      console.error("获取商机数据失败:", error);
      toast.error("获取商机数据失败");
    }
  }

  // 创建新商机
  const handleCreateOpportunity = () => {
    router.push('/create-opportunity');
    
  }

  useEffect(() => {
    // 初始化应用数据
    initAppData();
    
    // 获取商机数据
    fetchOpportunities();
  }, [debouncedSearchTerm, filter]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex justify-between items-center py-4 px-4 sm:px-6">
          <h1 className="text-2xl font-bold">电梯商机管理</h1>
          <Button onClick={handleCreateOpportunity}>
            <Plus className="h-4 w-4 mr-1" />
            新建商机
          </Button>
        </div>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2">
          <SectionCards/>
          <Tabs defaultValue="allProjects" className="w-full sm:px-6 px-4">
            <div className="flex flex-col sm:flex-row gap-7 w-full items-center mb-4">
              <TabsList className="sm:mb-0 flex w-full sm:w-auto">
                <TabsTrigger value="allProjects" className="flex-1" onClick={() => setFilter("all")}>全部商机</TabsTrigger>
                <TabsTrigger value="highPriority" className="flex-1" onClick={() => setFilter("highPriority")}>高优先级</TabsTrigger>
                <TabsTrigger value="progressSort" className="flex-1" onClick={() => setFilter("progress")}>进度排序</TabsTrigger>
              </TabsList>
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索商机..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9 w-full"
                />
              </div>
            </div>
            {
              opportunities.length === 0 ? (
                <Card className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-20 h-20 mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                    <InboxIcon className="h-10 w-10 text-muted-foreground/70" />
                  </div>
                  <CardTitle className="text-xl font-medium text-center mb-2">这里空空如也</CardTitle>
                  <CardDescription className="text-center max-w-md">
                    <p className="text-muted-foreground">暂时还没有任何商机数据。点击"新建商机"按钮创建您的第一个商机。</p>
                  </CardDescription>
                </Card>
              ):(
                <>
                  <TabsContent value="allProjects">
                    <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4">
                      {opportunities.map((item) => (
                        <OpportunityCard key={item.id} data={item} onUpdate={fetchOpportunities}/>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="highPriority">
                    <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4">
                      {opportunities.map((item) => (
                        <OpportunityCard key={item.id} data={item} onUpdate={fetchOpportunities}/>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="progressSort">
                    <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4">
                      {opportunities.map((item) => (
                        <OpportunityCard key={item.id} data={item} onUpdate={fetchOpportunities}/>
                      ))}
                    </div>
                  </TabsContent>
                </>
              )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
