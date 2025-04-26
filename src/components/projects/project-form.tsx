"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FormImageUploader } from "@/components/share/form/form-image-uploader"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

// 表单验证模式
const projectFormSchema = z.object({
  // 基本信息
  projectName: z.string().min(2, { message: "项目名称至少需要2个字符" }),
  projectType: z.string({ required_error: "请选择项目类型" }),
  projectLocation: z.string({ required_error: "请输入项目所在地" }),
  totalUnits: z.string().min(1, { message: "请输入总台数" }),
  projectOwner: z.string({ required_error: "请选择项目所属人" }),
  salesAssistant: z.string({ required_error: "请选择项目销售助理" }),
  isBulkPurchase: z.boolean().default(false),
  
  // 非必填基本信息
  projectNumber: z.string().optional(),
  entryPerson: z.string().optional(),
  salesContact: z.string().optional(),
  projectStage: z.string().optional(),
  customerType: z.string().optional(),
  totalBidAmount: z.string().optional(),
  contractNumber: z.string().optional(),
  elevatorType: z.string().optional(),
  projectAddress: z.string().optional(),
  clientName: z.string().optional(),
  contactPhone: z.string().optional(),
  email: z.string().email({ message: "请输入有效的邮箱地址" }).optional().or(z.literal("")),
  freightDescription: z.string().optional(),
  paymentTerms: z.string().optional(),
  bulkName: z.string().optional(),
  bulkContractNumber: z.string().optional(),
  businessUnit: z.string().optional(),
  engineeringType: z.string().optional(),
  industryClassification: z.string().optional(),
  
  // 报价信息
  quotationName: z.string({ required_error: "请输入方案名称" }),
  quotationNumber: z.string().optional(),
  creationDate: z.string().optional(),
  installationContractType: z.string({ required_error: "请选择安装合同类型" }),
  tradeTerms: z.string({ required_error: "请选择贸易术语" }),
  warrantyPeriod: z.string({ required_error: "请输入质保期" }),
  maintenancePeriod: z.string().optional(),
  freightElevatorPackaging: z.string({ required_error: "请选择货梯包装类别" }),
  solutionDescription: z.string().optional(),
  designatedSubcontractor: z.string({ required_error: "请选择指定分包" }),
  packagingStandard: z.string({ required_error: "请选择包装标准" }),
  
  // 项目图片
  projectImages: z.array(z.string()).optional(),
  contractAttachments: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// 默认值
const defaultValues: Partial<ProjectFormValues> = {
  isBulkPurchase: false,
  projectImages: [],
  contractAttachments: [],
};

export function ProjectForm({ 
  initialData, 
  onSubmit 
}: { 
  initialData?: Partial<ProjectFormValues>,
  onSubmit: (data: ProjectFormValues) => void
}) {
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialData || defaultValues,
  });

  function handleSubmit(data: ProjectFormValues) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="quotation">报价信息</TabsTrigger>
            <TabsTrigger value="attachments">附件管理</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>项目基本信息</CardTitle>
                <CardDescription>填写电梯项目的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>项目名称 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="输入项目名称" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>项目类型 <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择项目类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">住宅</SelectItem>
                            <SelectItem value="commercial">商业</SelectItem>
                            <SelectItem value="industrial">工业</SelectItem>
                            <SelectItem value="publicBuilding">公共建筑</SelectItem>
                            <SelectItem value="renovation">改造项目</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>项目所在地 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="输入项目所在地" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="totalUnits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>总台数 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="输入总台数" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectOwner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>项目所属人 <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择项目所属人" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user1">销售顾问1</SelectItem>
                            <SelectItem value="user2">销售顾问2</SelectItem>
                            <SelectItem value="user3">销售顾问3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salesAssistant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>项目销售助理 <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择项目销售助理" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="assistant1">销售助理1</SelectItem>
                            <SelectItem value="assistant2">销售助理2</SelectItem>
                            <SelectItem value="assistant3">销售助理3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isBulkPurchase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            是否大盘采购 <span className="text-red-500">*</span>
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>项目编号</FormLabel>
                        <FormControl>
                          <Input placeholder="输入项目编号" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>客户类型</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择客户类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="developer">开发商</SelectItem>
                            <SelectItem value="contractor">承包商</SelectItem>
                            <SelectItem value="agent">代理商</SelectItem>
                            <SelectItem value="endUser">终端用户</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contractNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>合同编号</FormLabel>
                        <FormControl>
                          <Input placeholder="输入合同编号" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="projectAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>项目地址</FormLabel>
                        <FormControl>
                          <Textarea placeholder="详细项目地址" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="freightDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>运费描述</FormLabel>
                        <FormControl>
                          <Textarea placeholder="请输入运费描述信息" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            {form.watch("isBulkPurchase") && (
              <Card>
                <CardHeader>
                  <CardTitle>大盘采购信息</CardTitle>
                  <CardDescription>大盘采购相关信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bulkName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>大盘名称</FormLabel>
                          <FormControl>
                            <Input placeholder="输入大盘名称" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bulkContractNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>大盘合同号</FormLabel>
                          <FormControl>
                            <Input placeholder="输入大盘合同号" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="quotation" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>报价信息</CardTitle>
                <CardDescription>项目报价相关信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="quotationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>方案名称 <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="输入方案名称" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quotationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>报价单编号</FormLabel>
                        <FormControl>
                          <Input placeholder="输入报价单编号" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="installationContractType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>有无安装合同类型 <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择安装合同类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="withInstallation">带安装</SelectItem>
                            <SelectItem value="withoutInstallation">不带安装</SelectItem>
                            <SelectItem value="onlyInstallation">纯安装</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tradeTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>贸易术语 <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择贸易术语" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FOB">FOB</SelectItem>
                            <SelectItem value="CIF">CIF</SelectItem>
                            <SelectItem value="EXW">EXW</SelectItem>
                            <SelectItem value="DDP">DDP</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="warrantyPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>质保期(月) <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="输入质保期" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maintenancePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>维保期(月)</FormLabel>
                        <FormControl>
                          <Input placeholder="输入维保期" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="freightElevatorPackaging"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>货梯包装类别 <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择货梯包装类别" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">标准包装</SelectItem>
                            <SelectItem value="reinforced">加固包装</SelectItem>
                            <SelectItem value="export">出口包装</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="designatedSubcontractor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>指定分包 <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择指定分包" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">是</SelectItem>
                            <SelectItem value="no">否</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="packagingStandard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>包装标准 <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择包装标准" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="domestic">国内标准</SelectItem>
                            <SelectItem value="international">国际标准</SelectItem>
                            <SelectItem value="custom">定制包装</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="solutionDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>方案描述</FormLabel>
                      <FormControl>
                        <Textarea placeholder="请输入方案详细描述" className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attachments" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>项目附件</CardTitle>
                <CardDescription>上传项目相关图片和合同附件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>项目图片</FormLabel>
                      <FormDescription>
                        上传项目相关图片，最多5张
                      </FormDescription>
                      <FormImageUploader
                        form={form}
                        name="projectImages"
                        label="项目图片"
                        maxImages={5}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contractAttachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>合同附件</FormLabel>
                      <FormDescription>
                        上传项目合同相关附件，最多3张
                      </FormDescription>
                      <FormImageUploader
                        form={form}
                        name="contractAttachments"
                        label="合同附件"
                        maxImages={3}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              if (activeTab === "basic") {
                // 如果是第一个tab，可能是返回上一页
              } else if (activeTab === "quotation") {
                setActiveTab("basic");
              } else if (activeTab === "attachments") {
                setActiveTab("quotation");
              }
            }}
          >
            {activeTab === "basic" ? "取消" : "上一步"}
          </Button>
          
          <Button 
            type={activeTab === "attachments" ? "submit" : "button"}
            onClick={() => {
              if (activeTab === "basic") {
                setActiveTab("quotation");
              } else if (activeTab === "quotation") {
                setActiveTab("attachments");
              }
              // 如果是最后一个tab，按钮类型是submit，会自动触发表单提交
            }}
          >
            {activeTab === "attachments" ? "提交" : "下一步"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 