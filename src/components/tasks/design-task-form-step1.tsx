"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {useEffect, useState} from "react"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {getCustomerListRequest} from "@/api/customer/api"
import {CustomerBaseInfo} from "@/api/customer/types"
import {getStaffListRequest} from "@/api/staff/api"
import {StaffBaseInfo} from "@/api/staff/types"
import {StaffType} from "@/api/types"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CalendarIcon} from "@radix-ui/react-icons"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {getSampleDirectionListRequest} from "@/api/rad/api"
import {SampleDirectionBaseInfo} from "@/api/rad/types"

// 定义表单验证模式
const formSchema = z.object({
  // 基本信息
  srfCode: z.string().min(1, "SRF编号不能为空"),
  // 接收日期,必填
  receiveDate: z.string().min(1, "接收日期不能为空"),
  // 完结日期,选填
  finishDate: z.string().optional(),
  // 客户,必填
  customerID: z.string().min(1, "客户不能为空"),
  // 项目工程师,必填
  projectDeveloperID: z.string().min(1, "项目工程师不能为空"),
  // 项目销售员,必填
  projectSalesID: z.string().min(1, "项目销售员不能为空"),
  // 应用方向,必填
  sampleDirectionID: z.string().min(1, "应用方向不能为空"),
  // 项目背景,必填
  projectBackground: z.string().min(1, "项目背景不能为空"),
  // 特殊要求,必填
  specialRequirements: z.string().min(1, "特殊要求不能为空"),
  // 备注,必填
  remarks: z.string().min(1, "备注不能为空"),
})


type FormValues = z.infer<typeof formSchema>

interface DesignTaskFormStep1Props {
  onSubmit: (values: FormValues) => void
  defaultValues?: Partial<FormValues>
  isSubmitting?: boolean
}

export function DesignTaskFormStep1({ 
  onSubmit,
  defaultValues = {},
  isSubmitting = false
}: DesignTaskFormStep1Props) {
  const [customers, setCustomers] = useState<CustomerBaseInfo[]>([])
  const [developers, setDevelopers] = useState<StaffBaseInfo[]>([])
  const [sales, setSales] = useState<StaffBaseInfo[]>([])
  const [sampleDirections, setSampleDirections] = useState<SampleDirectionBaseInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 获取客户列表
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true)
      try {
        const response = await getCustomerListRequest()
        if (response.code === 0 && response.data) {
          setCustomers(response.data)
        } else {
          console.error("获取客户列表失败:", response.message)
        }
      } catch (error) {
        console.error("获取客户列表错误:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // 获取项目工程师和项目销售员列表
  useEffect(() => {
    const fetchStaffs = async () => {
      setIsLoading(true)
      try {
        const [developersResponse, salesResponse, sampleDirectionsResponse] = await Promise.all([
          getStaffListRequest(StaffType.DEVELOPER),
          getStaffListRequest(StaffType.SALES),
          getSampleDirectionListRequest()
        ])
  
        if (developersResponse.code === 0 && developersResponse.data) {
          setDevelopers(developersResponse.data)
        } else {
          console.error("获取项目工程师列表失败:", developersResponse.message)
        }
  
        if (salesResponse.code === 0 && salesResponse.data) {
          setSales(salesResponse.data)
        } else {
          console.error("获取销售列表失败:", salesResponse.message)
        }

        if (sampleDirectionsResponse.code === 0 && sampleDirectionsResponse.data) {
          setSampleDirections(sampleDirectionsResponse.data)
        } else {
          console.error("获取应用方向列表失败:", sampleDirectionsResponse.message)
        }
      } catch (error) {
        console.error("获取员工列表错误:", error)
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchStaffs()
  }, [])


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      srfCode: defaultValues.srfCode || "N-HS-" + new Date().getFullYear().toString().slice(2) + "-",
      receiveDate: defaultValues.receiveDate || "",
      finishDate: defaultValues.finishDate || "",
      customerID: defaultValues.customerID || "",
      projectDeveloperID: defaultValues.projectDeveloperID || "",
      projectSalesID: defaultValues.projectSalesID || "",
      sampleDirectionID: defaultValues.sampleDirectionID || "",
      projectBackground: defaultValues.projectBackground || "",
      specialRequirements: defaultValues.specialRequirements || "Pass the RoHS and REACH.",
      remarks: defaultValues.remarks || "记得喷涂直发器工作为色板留底，谢谢！",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xl font-bold">设计开发任务书</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="srfCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SRF编号</FormLabel>
                    <FormControl>
                      <Input placeholder="N-HS-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerID"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>客户</FormLabel>
                    <Select 
                      disabled={isLoading}
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择客户" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem 
                            key={customer.id} 
                            value={customer.id.toString()}
                          >
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiveDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>接收日期</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "yyyy-MM-dd")
                            ) : (
                              <span>请选择日期</span>
                            )}
                            <div className="ml-auto flex items-center gap-2">
                              {field.value && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    field.onChange("")
                                  }}
                                  className="rounded-full p-1 opacity-50 hover:opacity-100"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                  <span className="sr-only">清除日期</span>
                                </button>
                              )}
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </div>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="finishDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>完结日期</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "yyyy-MM-dd")
                            ) : (
                              <span>请选择日期</span>
                            )}
                            <div className="ml-auto flex items-center gap-2">
                              {field.value && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    field.onChange("")
                                  }}
                                  className="rounded-full p-1 opacity-50 hover:opacity-100"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                  <span className="sr-only">清除日期</span>
                                </button>
                              )}
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </div>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectDeveloperID"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>项目工程师</FormLabel>
                    <Select 
                      disabled={isLoading}
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择项目工程师" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {developers.map((developer) => (
                          <SelectItem 
                            key={developer.id} 
                            value={developer.id.toString()}
                          >
                            {developer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectSalesID"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>项目销售员</FormLabel>
                    <Select 
                      disabled={isLoading}
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择项目销售员" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sales.map((sales) => (
                          <SelectItem 
                            key={sales.id} 
                            value={sales.id.toString()}
                          >
                            {sales.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-lg font-semibold">样品需求</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="grid grid-cols-1 gap-4">
            <FormField
                control={form.control}
                name="sampleDirectionID"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>应用方向</FormLabel>
                    <Select 
                      disabled={isLoading}
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择应用方向" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleDirections.map((sampleDirection) => (
                          <SelectItem 
                            key={sampleDirection.id} 
                            value={sampleDirection.id.toString()}
                          >
                            {sampleDirection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectBackground"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目背景</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="项目背景描述"
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                            <FormField
                control={form.control}
                name="specialRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>特殊要求</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="特殊要求描述"
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                            <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="备注"
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
        </Card>

        <div className="flex justify-end px-2">
          <Button type="submit" disabled={isLoading || isSubmitting}>
            {isSubmitting ? "提交中..." : "下一步"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 