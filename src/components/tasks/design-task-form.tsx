"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {useEffect, useState} from "react"
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from "next/navigation"

import {Button} from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {FormDatePickFiled, FormTextAreaField, FromInputField} from "../share/form/form-filed"
import {FormSearchSelectField} from "../share/form/simple-form"
import { FormImageUploader } from "@/components/share/form/form-image-uploader"
import {toast} from "sonner"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, AlertCircle } from "lucide-react"

// 定义表单验证模式
const formSchema = z.object({
  // 基本信息
  projectCode: z.string().min(1, "项目编号不能为空"),
  // 项目名称，必填
  projectName: z.string().min(1, "项目名称不能为空"),
  // 创建日期,必填
  createDate: z.string().min(1, "创建日期不能为空"),
  // 预计签约日期,必填
  expectedSignDate: z.string().min(1, "预计签约日期不能为空"),
  // 交货期(天)
  deliveryPeriod: z.string().optional(),
  // 客户,必填
  customerId: z.string().min(1, "客户不能为空"),
  // 项目经理,必填
  projectManagerId: z.string().min(1, "项目经理不能为空"),
  // 录入人
  creatorId: z.string().optional(),
  // 销售员,必填
  salesId: z.string().min(1, "销售员不能为空"),
  // 销售助理，必填
  salesAssistantId: z.string().min(1, "销售助理不能为空"),
  // 合同编号
  contractCode: z.string().optional(),
  // 优先级,必填
  priority: z.string().min(1, "优先级不能为空"),
  // 项目类型,必填
  projectTypeId: z.string().min(1, "项目类型不能为空"),
  // 客户类型,必填
  customerTypeId: z.string().min(1, "客户类型不能为空"),
  // 项目所在地,必填
  projectLocationId: z.string().min(1, "项目所在地不能为空"),
  // 项目地址
  projectAddress: z.string().optional(),
  // 项目阶段(土建)
  projectStageId: z.string().optional(),
  // 工程类型,必填
  engineeringTypeId: z.string().min(1, "工程类型不能为空"),
  // 行业分类,必填
  industryTypeId: z.string().min(1, "行业分类不能为空"),
  // 项目描述
  projectDescription: z.string().optional(),
  // 客户需求
  customerRequirements: z.string().optional(),
  // 备注
  remarks: z.string().optional(),
  // 项目图片
  projectImages: z.array(z.string().url()).optional(),
  // 预计金额,必填
  estimatedAmount: z.string().min(1, "预计金额不能为空"),
  // 电梯总台数,必填
  elevatorCount: z.string().min(1, "电梯总台数不能为空"),
  // 是否大盘采购,必填
  isLargeProject: z.string().min(1, "请选择是否大盘采购"),
  // 大盘名称
  largePlatformName: z.string().optional(),
  // 大盘合同号
  largePlatformContractCode: z.string().optional(),
  // 联系人电话
  contactPhone: z.string().optional(),
  // 联系人邮箱
  contactEmail: z.string().optional(),
  // 付款条件
  paymentTerms: z.string().optional(),
  // 运费描述
  freightDescription: z.string().optional(),
  // 业务单元
  businessUnitId: z.string().optional(),
  // 所属区域
  regionId: z.string().optional(),
  // 所属分公司
  branchId: z.string().optional(),
  // 开发商名称
  developerName: z.string().optional(),
  // 是否跨区
  isCrossRegion: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

interface OpportunityFormProps {
  onSubmit?: (values: FormValues) => void
  defaultValues?: Partial<FormValues>
  isSubmitting?: boolean
}

// 初始化本地存储
const initLocalStorage = () => {
  // 初始化客户数据
  if (!localStorage.getItem('customers')) {
    localStorage.setItem('customers', JSON.stringify([
      { id: "1", name: "万科地产" },
      { id: "2", name: "碧桂园" },
      { id: "3", name: "恒大集团" },
      { id: "4", name: "龙湖地产" },
      { id: "5", name: "保利发展" }
    ]));
  }

  // 初始化项目经理数据
  if (!localStorage.getItem('projectManagers')) {
    localStorage.setItem('projectManagers', JSON.stringify([
      { id: "1", name: "张三" },
      { id: "2", name: "李四" },
      { id: "3", name: "王五" }
    ]));
  }

  // 初始化销售员数据
  if (!localStorage.getItem('salesPersons')) {
    localStorage.setItem('salesPersons', JSON.stringify([
      { id: "1", name: "赵一" },
      { id: "2", name: "钱二" },
      { id: "3", name: "孙三" }
    ]));
  }

  // 初始化销售助理数据
  if (!localStorage.getItem('salesAssistants')) {
    localStorage.setItem('salesAssistants', JSON.stringify([
      { id: "1", name: "助理A" },
      { id: "2", name: "助理B" },
      { id: "3", name: "助理C" }
    ]));
  }

  // 初始化项目类型
  if (!localStorage.getItem('projectTypes')) {
    localStorage.setItem('projectTypes', JSON.stringify([
      { id: "1", name: "新梯项目" },
      { id: "2", name: "旧梯改造" },
      { id: "3", name: "维保项目" },
      { id: "4", name: "更新项目" }
    ]));
  }

  // 初始化客户类型
  if (!localStorage.getItem('customerTypes')) {
    localStorage.setItem('customerTypes', JSON.stringify([
      { id: "1", name: "外销" },
      { id: "2", name: "内销" },
      { id: "3", name: "代理商" }
    ]));
  }

  // 初始化项目所在地
  if (!localStorage.getItem('locations')) {
    localStorage.setItem('locations', JSON.stringify([
      { id: "1", name: "上海" },
      { id: "2", name: "北京" },
      { id: "3", name: "广州" },
      { id: "4", name: "深圳" },
      { id: "5", name: "杭州" }
    ]));
  }

  // 初始化项目阶段
  if (!localStorage.getItem('projectStages')) {
    localStorage.setItem('projectStages', JSON.stringify([
      { id: "1", name: "请选择" },
      { id: "2", name: "规划阶段" },
      { id: "3", name: "方案设计" },
      { id: "4", name: "初步设计" },
      { id: "5", name: "施工图设计" },
      { id: "6", name: "土建施工" }
    ]));
  }

  // 初始化工程类型
  if (!localStorage.getItem('engineeringTypes')) {
    localStorage.setItem('engineeringTypes', JSON.stringify([
      { id: "1", name: "住宅电梯" },
      { id: "2", name: "商用电梯" },
      { id: "3", name: "观光电梯" },
      { id: "4", name: "货梯" },
      { id: "5", name: "扶梯" }
    ]));
  }

  // 初始化行业分类
  if (!localStorage.getItem('industryTypes')) {
    localStorage.setItem('industryTypes', JSON.stringify([
      { id: "1", name: "房地产" },
      { id: "2", name: "政府机构" },
      { id: "3", name: "商业中心" },
      { id: "4", name: "医院" },
      { id: "5", name: "学校" }
    ]));
  }

  // 初始化业务单元
  if (!localStorage.getItem('businessUnits')) {
    localStorage.setItem('businessUnits', JSON.stringify([
      { id: "1", name: "请选择" },
      { id: "2", name: "东区业务" },
      { id: "3", name: "西区业务" },
      { id: "4", name: "南区业务" },
      { id: "5", name: "北区业务" }
    ]));
  }

  // 初始化优先级
  if (!localStorage.getItem('priorities')) {
    localStorage.setItem('priorities', JSON.stringify([
      { id: "1", name: "高" },
      { id: "2", name: "中" },
      { id: "3", name: "低" }
    ]));
  }

  // 初始化是否大盘
  if (!localStorage.getItem('isLargeOptions')) {
    localStorage.setItem('isLargeOptions', JSON.stringify([
      { id: "1", name: "是" },
      { id: "2", name: "否" }
    ]));
  }

  // 初始化是否跨区
  if (!localStorage.getItem('isCrossRegionOptions')) {
    localStorage.setItem('isCrossRegionOptions', JSON.stringify([
      { id: "1", name: "是" },
      { id: "2", name: "否" }
    ]));
  }

  // 初始化所属区域
  if (!localStorage.getItem('regions')) {
    localStorage.setItem('regions', JSON.stringify([
      { id: "1", name: "请选择" },
      { id: "2", name: "华东地区" },
      { id: "3", name: "华南地区" },
      { id: "4", name: "华北地区" },
      { id: "5", name: "华中地区" },
      { id: "6", name: "西南地区" },
      { id: "7", name: "西北地区" },
      { id: "8", name: "东北地区" }
    ]));
  }

  // 初始化所属分公司
  if (!localStorage.getItem('branches')) {
    localStorage.setItem('branches', JSON.stringify([
      { id: "1", name: "请选择" },
      { id: "2", name: "上海分公司" },
      { id: "3", name: "北京分公司" },
      { id: "4", name: "广州分公司" },
      { id: "5", name: "深圳分公司" }
    ]));
  }

  // 初始化默认商机数据
  if (!localStorage.getItem('opportunities')) {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    
    localStorage.setItem('opportunities', JSON.stringify([
      {
        id: "1001",
        projectCode: "ELV-2025-1001",
        projectName: "万科城市之光",
        customerName: "万科地产",
        projectManagerName: "张三",
        salesName: "李四",
        salesAssistantName: "赵六",
        priorityName: "高",
        progress: 75,
        status: "合同录入",
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
        status: "快速算价",
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
        status: "商机获取",
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
        status: "申请折扣",
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
      }
    ]));
  }
  
  // 初始化录入人
  if (!localStorage.getItem('creators')) {
    localStorage.setItem('creators', JSON.stringify([
      { id: "1", name: "张三" },
      { id: "2", name: "李四" },
      { id: "3", name: "王五" },
      { id: "4", name: "赵六" }
    ]));
  }

  // 初始化付款条件
  if (!localStorage.getItem('paymentTerms')) {
    localStorage.setItem('paymentTerms', JSON.stringify([
      { id: "1", name: "T/T" },
      { id: "2", name: "L/C" },
      { id: "3", name: "D/P" },
      { id: "4", name: "D/A" }
    ]));
  }

  // 初始化运费描述
  if (!localStorage.getItem('freightDescriptions')) {
    localStorage.setItem('freightDescriptions', JSON.stringify([
      { id: "1", name: "CIF" },
      { id: "2", name: "FOB" },
      { id: "3", name: "CFR" },
      { id: "4", name: "EXW" }
    ]));
  }
}

/**
 * 商机创建表单
 */
export function DesignTaskForm({ 
  onSubmit,
  defaultValues = {},
  isSubmitting = false
}: OpportunityFormProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<{id: string, name: string}[]>([])
  const [projectManagers, setProjectManagers] = useState<{id: string, name: string}[]>([])
  const [salesPersons, setSalesPersons] = useState<{id: string, name: string}[]>([])
  const [salesAssistants, setSalesAssistants] = useState<{id: string, name: string}[]>([])
  const [projectTypes, setProjectTypes] = useState<{id: string, name: string}[]>([])
  const [customerTypes, setCustomerTypes] = useState<{id: string, name: string}[]>([])
  const [locations, setLocations] = useState<{id: string, name: string}[]>([])
  const [projectStages, setProjectStages] = useState<{id: string, name: string}[]>([])
  const [engineeringTypes, setEngineeringTypes] = useState<{id: string, name: string}[]>([])
  const [industryTypes, setIndustryTypes] = useState<{id: string, name: string}[]>([])
  const [businessUnits, setBusinessUnits] = useState<{id: string, name: string}[]>([])
  const [priorities, setPriorities] = useState<{id: string, name: string}[]>([])
  const [isLargeOptions, setIsLargeOptions] = useState<{id: string, name: string}[]>([])
  const [isCrossRegionOptions, setIsCrossRegionOptions] = useState<{id: string, name: string}[]>([])
  const [regions, setRegions] = useState<{id: string, name: string}[]>([])
  const [branches, setBranches] = useState<{id: string, name: string}[]>([])
  const [creators, setCreators] = useState<{id: string, name: string}[]>([])
  const [paymentTerms, setPaymentTerms] = useState<{id: string, name: string}[]>([])
  const [freightDescriptions, setFreightDescriptions] = useState<{id: string, name: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLargeProject, setIsLargeProject] = useState("2") // 默认不是大盘

  // 初始化本地存储和加载数据
  useEffect(() => {
    initLocalStorage();
    
    // 从localStorage加载数据
    setCustomers(JSON.parse(localStorage.getItem('customers') || '[]'));
    setProjectManagers(JSON.parse(localStorage.getItem('projectManagers') || '[]'));
    setSalesPersons(JSON.parse(localStorage.getItem('salesPersons') || '[]'));
    setSalesAssistants(JSON.parse(localStorage.getItem('salesAssistants') || '[]'));
    setProjectTypes(JSON.parse(localStorage.getItem('projectTypes') || '[]'));
    setCustomerTypes(JSON.parse(localStorage.getItem('customerTypes') || '[]'));
    setLocations(JSON.parse(localStorage.getItem('locations') || '[]'));
    setProjectStages(JSON.parse(localStorage.getItem('projectStages') || '[]'));
    setEngineeringTypes(JSON.parse(localStorage.getItem('engineeringTypes') || '[]'));
    setIndustryTypes(JSON.parse(localStorage.getItem('industryTypes') || '[]'));
    setBusinessUnits(JSON.parse(localStorage.getItem('businessUnits') || '[]'));
    setPriorities(JSON.parse(localStorage.getItem('priorities') || '[]'));
    setIsLargeOptions(JSON.parse(localStorage.getItem('isLargeOptions') || '[]'));
    setIsCrossRegionOptions(JSON.parse(localStorage.getItem('isCrossRegionOptions') || '[]'));
    setRegions(JSON.parse(localStorage.getItem('regions') || '[]'));
    setBranches(JSON.parse(localStorage.getItem('branches') || '[]'));
    setCreators(JSON.parse(localStorage.getItem('creators') || '[]'));
    setPaymentTerms(JSON.parse(localStorage.getItem('paymentTerms') || '[]'));
    setFreightDescriptions(JSON.parse(localStorage.getItem('freightDescriptions') || '[]'));
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectCode: defaultValues.projectCode || "ELV-" + new Date().getFullYear().toString() + "-" + Math.floor(1000 + Math.random() * 9000),
      projectName: defaultValues.projectName || "",
      createDate: defaultValues.createDate || new Date().toISOString().split('T')[0],
      expectedSignDate: defaultValues.expectedSignDate || "",
      deliveryPeriod: defaultValues.deliveryPeriod || "",
      customerId: defaultValues.customerId || "",
      projectManagerId: defaultValues.projectManagerId || "",
      creatorId: defaultValues.creatorId || "1", // 默认创建者
      salesId: defaultValues.salesId || "",
      salesAssistantId: defaultValues.salesAssistantId || "",
      contractCode: defaultValues.contractCode || "",
      projectTypeId: defaultValues.projectTypeId || "",
      customerTypeId: defaultValues.customerTypeId || "",
      projectLocationId: defaultValues.projectLocationId || "",
      projectAddress: defaultValues.projectAddress || "",
      projectStageId: defaultValues.projectStageId || "",
      engineeringTypeId: defaultValues.engineeringTypeId || "",
      industryTypeId: defaultValues.industryTypeId || "",
      projectDescription: defaultValues.projectDescription || "",
      customerRequirements: defaultValues.customerRequirements || "",
      remarks: defaultValues.remarks || "",
      projectImages: defaultValues.projectImages || [],
      estimatedAmount: defaultValues.estimatedAmount || "",
      elevatorCount: defaultValues.elevatorCount || "",
      isLargeProject: defaultValues.isLargeProject || "2", // 默认否
      largePlatformName: defaultValues.largePlatformName || "",
      largePlatformContractCode: defaultValues.largePlatformContractCode || "",
      contactPhone: defaultValues.contactPhone || "",
      contactEmail: defaultValues.contactEmail || "",
      paymentTerms: defaultValues.paymentTerms || "",
      freightDescription: defaultValues.freightDescription || "",
      businessUnitId: defaultValues.businessUnitId || "",
      regionId: defaultValues.regionId || "",
      branchId: defaultValues.branchId || "",
      developerName: defaultValues.developerName || "",
      isCrossRegion: defaultValues.isCrossRegion || "2" // 默认否
    },
  })

  // 监听大盘选择变化
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'isLargeProject') {
        setIsLargeProject(value.isLargeProject || "2");
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleSubmit = (values: FormValues) => {
    setIsLoading(true);
    
    try {
      // 获取现有商机
      const existingOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      
      // 创建新商机对象
      const newOpportunity = {
        id: uuidv4(),
        ...values,
        status: "商机获取",
        progress: 10,
        createdAt: new Date().toISOString(),
        customerName: customers.find(c => c.id === values.customerId)?.name || "",
        projectManagerName: projectManagers.find(p => p.id === values.projectManagerId)?.name || "",
        salesName: salesPersons.find(s => s.id === values.salesId)?.name || "",
        salesAssistantName: salesAssistants.find(s => s.id === values.salesAssistantId)?.name || "",
        projectTypeName: projectTypes.find(p => p.id === values.projectTypeId)?.name || "",
        customerTypeName: customerTypes.find(c => c.id === values.customerTypeId)?.name || "",
        locationName: locations.find(l => l.id === values.projectLocationId)?.name || "",
        engineeringTypeName: engineeringTypes.find(e => e.id === values.engineeringTypeId)?.name || "",
        industryTypeName: industryTypes.find(i => i.id === values.industryTypeId)?.name || "",
        priorityName: priorities.find(p => p.id === values.priority)?.name || "",
        isLargeProjectName: isLargeOptions.find(i => i.id === values.isLargeProject)?.name || "否",
        creatorName: creators.find(c => c.id === values.creatorId)?.name || ""
      };
      
      // 添加到商机列表
      existingOpportunities.push(newOpportunity);
      
      // 保存回localStorage
      localStorage.setItem('opportunities', JSON.stringify(existingOpportunities));
      
      toast.success("商机创建成功！");
      
      // 如果有自定义的提交处理函数，调用它
      if (onSubmit) {
        onSubmit(values);
      } else {
        // 否则导航到dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("保存商机失败:", error);
      toast.error("商机创建失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[95%]">
        <Card className="shadow-sm">
          <CardHeader className="px-4 md:px-6 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              项目基本信息
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              <span className="text-red-500">*</span> 表示必填项
            </div>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FromInputField
                title="项目编号"
                placeholder="自动生成"
                form={form}
                name="projectCode"
                disabled={false}
              />
              <FormSearchSelectField
                label="录入人"
                form={form}
                name="creatorId"
                isLoading={isLoading}
                filteredItems={creators}
                disabled={false}
              />
              <FormSearchSelectField
                label="对接销售人员"
                form={form}
                name="salesId"
                isLoading={isLoading}
                filteredItems={salesPersons}
                required
              />
              <FromInputField
                title="项目名称"
                placeholder="请输入项目名称"
                form={form}
                name="projectName"
                required
              />
              <FormSearchSelectField
                form={form}
                label="项目类型"
                name="projectTypeId"
                isLoading={isLoading}
                filteredItems={projectTypes}
                required
              />
              <FormSearchSelectField
                form={form}
                label="项目阶段(土建)"
                name="projectStageId"
                isLoading={isLoading}
                filteredItems={projectStages}
              />
              <FormSearchSelectField
                label="客户类型"
                form={form}
                name="customerTypeId"
                isLoading={isLoading}
                filteredItems={customerTypes}
                required
              />
              <FromInputField
                title="总投标额(万元)"
                placeholder="请输入总投标额"
                form={form}
                name="estimatedAmount"
                required
              />
              <FromInputField
                title="总台数"
                placeholder="请输入电梯总台数"
                form={form}
                name="elevatorCount"
                required
              />
              <FromInputField
                title="合同编号"
                placeholder="请输入合同编号"
                form={form}
                name="contractCode"
              />
              <FormDatePickFiled 
                label="创建日期"
                form={form}
                name="createDate"
                required
              />
              <FormDatePickFiled 
                label="预计签约日期"
                form={form}
                name="expectedSignDate"
                required
              />
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSearchSelectField
                form={form}
                label="梯型信息"
                name="engineeringTypeId"
                isLoading={isLoading}
                filteredItems={engineeringTypes}
                required
              />
              <FormSearchSelectField
                form={form}
                label="项目所在地"
                name="projectLocationId"
                isLoading={isLoading}
                filteredItems={locations}
                required
              />
              <FromInputField
                title="项目地址"
                placeholder="请输入详细地址"
                form={form}
                name="projectAddress"
              />
              <FormSearchSelectField
                label="客户"
                form={form}
                name="customerId"
                isLoading={isLoading}
                filteredItems={customers}
                required
              />
              <FormSearchSelectField
                label="项目经理"
                form={form}
                name="projectManagerId"
                isLoading={isLoading}
                filteredItems={projectManagers}
                required
              />
              <FormSearchSelectField
                label="销售助理"
                form={form}
                name="salesAssistantId"
                isLoading={isLoading}
                filteredItems={salesAssistants}
                required
              />
              <FromInputField
                title="联系人电话"
                placeholder="请输入联系人电话"
                form={form}
                name="contactPhone"
              />
              <FromInputField
                title="联系人邮箱"
                placeholder="请输入联系人邮箱"
                form={form}
                name="contactEmail"
              />
              <FormSearchSelectField
                form={form}
                label="付款条件"
                name="paymentTerms"
                isLoading={isLoading}
                filteredItems={paymentTerms}
              />
              <FormSearchSelectField
                form={form}
                label="运费描述"
                name="freightDescription"
                isLoading={isLoading}
                filteredItems={freightDescriptions}
              />
            <FormSearchSelectField
                  form={form}
                label="是否大盘采购"
                name="isLargeProject"
                  isLoading={isLoading}
                filteredItems={isLargeOptions}
                required
              />
              <FromInputField
                title="交货期(天)"
                placeholder="请输入交货期"
                form={form}
                name="deliveryPeriod"
              />
            </div>
            
            {isLargeProject === "1" && (
              <>
                <Separator className="my-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FromInputField
                    title="大盘名称"
                    placeholder="请输入大盘名称"
                    form={form}
                    name="largePlatformName"
                  />
                  <FromInputField
                    title="大盘合同号"
                    placeholder="请输入大盘合同号"
                    form={form}
                    name="largePlatformContractCode"
                  />
                </div>
              </>
            )}
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSearchSelectField
                form={form}
                label="业务单元"
                name="businessUnitId"
                isLoading={isLoading}
                filteredItems={businessUnits}
              />
              <FormSearchSelectField
                form={form}
                label="工程类型"
                name="engineeringTypeId"
                isLoading={isLoading}
                filteredItems={engineeringTypes}
                required
              />
              <FormSearchSelectField
                form={form}
                label="行业分类"
                name="industryTypeId"
                isLoading={isLoading}
                filteredItems={industryTypes}
                required
              />
            <FormSearchSelectField
                  form={form}
                  label="优先级"
                  name="priority"
                  isLoading={isLoading}
                filteredItems={priorities}
                required
              />
              <FormSearchSelectField
                form={form}
                label="所属区域"
                name="regionId"
                isLoading={isLoading}
                filteredItems={regions}
              />
              <FormSearchSelectField
                form={form}
                label="所属分公司"
                name="branchId"
                isLoading={isLoading}
                filteredItems={branches}
              />
              <FromInputField
                title="开发商名称"
                placeholder="请输入开发商名称"
                form={form}
                name="developerName"
              />
              <FormSearchSelectField
                form={form}
                label="是否跨区"
                name="isCrossRegion"
                isLoading={isLoading}
                filteredItems={isCrossRegionOptions}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-lg font-semibold">项目详情</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="grid grid-cols-1 gap-4">
              <FormTextAreaField 
                form={form}
                label="项目描述"
                name="projectDescription"
              />
              <FormTextAreaField 
                form={form}
                label="客户需求"
                name="customerRequirements"
              />
              <FormTextAreaField 
                form={form}
                label="备注"
                name="remarks"
              />
              {/* 项目图片上传 */}
              <FormImageUploader
                form={form}
                label="项目图片"
                name="projectImages"
                maxImages={10}
                acceptedFileTypes="image/*"
                maxFileSize={5}
                />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end px-2">
          <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="submit" disabled={isLoading || isSubmitting}>
            {isSubmitting ? "提交中..." : "创建商机"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
