import {ChangeEvent, useEffect, useRef, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Droplets, Edit, Layers, Plus, PlusCircle, Trash2, Upload, X} from "lucide-react"
import {toast} from "sonner"
import {createSampleRequest, deleteSampleRequest, getSampleListRequest, getSampleParameterListRequest, updateSampleRequest, uploadSampleImageRequest} from "@/api/rad/api"
import {SampleParameter, Sample, ParameterItem} from "@/api/rad/types"
import { ShareConfirmDeleteDialog } from "../share/confirm-delete-dialog"


interface SampleProps {
    designTaskIndex: string 
    onSamplesChange: (updatedSamples: any[]) => void
}

// 删除配方
interface DeleteSample {
  list_index: number;
  version: string;
  index: string;
}





export default function SamplePage({ designTaskIndex, onSamplesChange }: SampleProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentSample, setCurrentSample] = useState<any>(null)
  const [availableParameters, setAvailableParameters] = useState<any[]>([])
  const [newParameterId, setNewParameterId] = useState<string>("")
  const [validationError, setValidationError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sampleParameterList, setSampleParameterList] = useState<SampleParameter[]>([])
  const [samples, setSamples] = useState<any[]>([])


  // 删除样品对话框
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)
  const [DeleteSampleData, setDeleteSampleData] = useState<DeleteSample>({
    list_index: -1,
    version: "",
    index: ""
  });

  // 图片预览Dialog状态
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("")

  useEffect(() => {
    getSampleParameterListRequest().then((res) => {
      setSampleParameterList(res.data)
    })
    getSampleListRequest(designTaskIndex).then((res) => {
      setSamples(res.data)
    })
  }, [])

  // 添加新样品
  const addNewSample = () => {
    createSampleRequest(designTaskIndex).then((res) => {
      // 倒序
      setSamples([res.data, ...samples])
      toast.success("创建样品成功")
    }).catch((err) => {
      toast.error("创建样品失败:"+err.response.data.msg)
    })
  }



  // 打开样品编辑对话框
  const openSampleEditDialog = (sample: any) => {
    // 确保sample.parameters_list存在，且是一个数组
    const sampleWithParams = {
      ...sample,
      // 如果parameters_list不是数组或不存在，则初始化为空数组
      parameters_list: Array.isArray(sample.parameters_list) ? sample.parameters_list : [],
      // 初始化image属性为image_url，用于编辑对话框显示
      image: sample.image_url
    }
    setCurrentSample(sampleWithParams)
    // 计算可用参数（尚未添加到样品中的参数）
    calculateAvailableParameters(sampleWithParams)
    setEditDialogOpen(true)
  }

  // 计算可用参数列表
  const calculateAvailableParameters = (sample: any) => {
    // 从parameters_list中提取已使用的参数名称
    const currentParameterNames = sample.parameters_list.map((p: ParameterItem) => p.name)
    // 过滤出尚未使用的参数
    const available = sampleParameterList.filter(
      option => !currentParameterNames.includes(option.name)
    )
    setAvailableParameters(available)
    setNewParameterId(available.length > 0 ? available[0].id.toString() : "")
  }

  // 保存样品修改
  const saveSampleChanges = () => {
    if (!currentSample) return
    
    // 清除之前的错误信息
    setValidationError("")
    
    // 验证参数值不能为空
    const hasEmptyParameter = currentSample.parameters_list.some((param: ParameterItem) => 
      !param.value || param.value.trim() === ''
    )
    
    if (hasEmptyParameter) {
      // 显示错误提示
      setValidationError("所有参数必须有值，请检查并填写所有参数")
      return
    }
    
    setSamples(samples.map(sample => 
      sample.id === currentSample.id ? currentSample : sample
    ))

    updateSampleRequest(currentSample.index, currentSample).then((res) => {
      if (res.code === 0) {
        // 更新 res data
        setSamples(samples.map(sample => 
          sample.index === currentSample.index ? res.data : sample
        ))
        toast.success("更新样品成功")
      } else {
        toast.error("更新样品失败:"+res.msg)
      }
    })
    setCurrentSample(null)
    setEditDialogOpen(false)
  }

  // 更新样品参数值
  const updateParameterValue = (paramName: string, value: string) => {
    if (!currentSample) return
    
    setCurrentSample({
      ...currentSample,
      parameters_list: currentSample.parameters_list.map((param: ParameterItem) => 
        param.name === paramName ? {...param, value} : param
      )
    })
  }

  // 添加参数
  const addParameter = () => {
    if (!currentSample || !newParameterId) return
    
    const paramToAdd = sampleParameterList.find(p => p.id === parseInt(newParameterId))
    if (!paramToAdd) return
    
    // 创建新的参数对象，使用JSON格式
    const newParam = {
      name: paramToAdd.name,
      value: ""
    }
    
    setCurrentSample({
      ...currentSample,
      parameters_list: [...currentSample.parameters_list, newParam]
    })

    // 重新计算可用参数
    calculateAvailableParameters({
      ...currentSample,
      parameters_list: [...currentSample.parameters_list, newParam]
    })
  }

  // 删除参数
  const deleteParameter = (paramName: string) => {
    if (!currentSample) return
    
    setCurrentSample({
      ...currentSample,
      parameters_list: currentSample.parameters_list.filter((param: ParameterItem) => param.name !== paramName)
    })

    // 重新计算可用参数
    calculateAvailableParameters({
      ...currentSample,
      parameters_list: currentSample.parameters_list.filter((param: ParameterItem) => param.name !== paramName)
    })
  }

  // 处理图片上传
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentSample) return
    
    const file = e.target.files[0]
    const reader = new FileReader()
    
    // 保留本地预览功能
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        setCurrentSample({
          ...currentSample,
          image: event.target.result as string
        })
      }
    }
    
    reader.readAsDataURL(file)
    
    // 调用API上传图片
    try {
      const response = await uploadSampleImageRequest(file)
      if (response.code === 0) {
        // 更新样品图片信息（根据服务器返回图片URL）
        setCurrentSample((prev: any) => {
          if (!prev) return prev
          return {
            ...prev,
            image_url: response.data.url,
            // 上传成功后将image_url同时设置为image，保持一致性
            image: response.data.url
          }
        })

        toast.success("图片上传成功")
      } else {
        toast.error(response.msg || "图片上传失败")
      }
    } catch (error) {
      console.error('上传样品图片失败:', error)
      toast.error("图片上传失败，请重试")
    }
  }

  // 触发文件选择
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleConfirmDelete = (list_index: number,version: string, index: string) => {
    setDeleteSampleData({
      list_index: list_index,
      version: version,
      index: index
    })
    setOpenConfirmDeleteDialog(true)
  }

  // 删除样品
  const deleteSample = () => {
    deleteSampleRequest(DeleteSampleData.index).then((res) => {
      if (res.code === 0) {
        setSamples(samples.filter(sample => sample.index !== DeleteSampleData.index))
        toast.success("删除成功")
      }else{
        toast.error("删除失败:"+res.msg)
      }
    }).catch((err) => {
      toast.error("删除失败:"+err)
    }).finally(() => {
      setOpenConfirmDeleteDialog(false)
      setDeleteSampleData({
        list_index: -1,
        version: "",
        index: ""
      })
    })
  }

  // 打开图片预览
  const openImagePreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl)
    setImagePreviewOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">样品列表</h2>
        <Button onClick={addNewSample} className="flex items-center gap-1">
          <PlusCircle size={16} />
          <span>添加样品</span>
        </Button>
      </div>

      {samples.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-10">
            <p className="text-muted-foreground mb-4">暂无样品信息</p>
            <Button onClick={addNewSample}>添加第一个样品</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {samples.map((sample: Sample, index: number) => (
            <Card key={sample.id} className="shadow-sm">
              <CardHeader className="px-3 sm:px-4 pb-1 flex flex-row justify-between items-start">
                <CardTitle className="text-base sm:text-lg font-semibold">样品 #{sample.version}</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openSampleEditDialog(sample)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleConfirmDelete(index, sample.version || "", sample.index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* 样品图片 */}
                  <div className="border rounded-md p-2 sm:p-3 flex flex-col items-center justify-center bg-muted/20">
                    {sample.image_url ? (
                      <img 
                        src={sample.image_url} 
                        alt={`样品 #${samples.indexOf(sample) + 1}`} 
                        className="max-h-32 object-contain cursor-pointer"
                        onClick={() => openImagePreview(sample.image_url)}
                      />
                    ) : (
                      <div className="bg-muted h-24 sm:h-32 w-full flex items-center justify-center rounded-md">
                        <p className="text-muted-foreground">无工件图片</p>
                      </div>
                    )}
                  </div>
                  
                  {/* 参数显示 */}
                  <div>
                    <h3 className="text-base font-medium mb-2">参数信息</h3>
                    <div className="border rounded-md overflow-hidden">
                      <div className="block sm:hidden max-h-[250px] overflow-y-auto">
                        {Array.isArray(sample.parameters_list) && sample.parameters_list.map((param: ParameterItem, index: number) => (
                          <div key={`${param.name}-${index}`} className="border-b border-gray-100 last:border-0">
                            <div className="py-1.5 px-2 bg-gray-50 font-medium">{param.name}</div>
                            <div className="py-0.5 px-2">{param.value || '未设置'}</div>
                          </div>
                        ))}
                        {(!Array.isArray(sample.parameters_list) || sample.parameters_list.length === 0) && (
                          <div className="flex items-center justify-center h-[100px] text-center text-muted-foreground">
                            请在编辑模式下添加参数
                          </div>
                        )}
                      </div>
                      <div className="hidden sm:block max-h-[250px] overflow-y-auto">
                        {(!Array.isArray(sample.parameters_list) || sample.parameters_list.length === 0) ? (
                          <div className="flex items-center justify-center min-h-[100px] text-center text-muted-foreground">
                            请在编辑模式下添加参数
                          </div>
                        ) : (
                          Array.isArray(sample.parameters_list) && sample.parameters_list.map((param: ParameterItem, index: number) => (
                            <div key={`${param.name}-${index}`} className="flex border-b border-gray-100 last:border-0">
                              <div className="py-2 px-3 border-r border-gray-100 w-1/3 font-medium shrink-0 bg-white">{param.name}</div>
                              <div className="py-2 px-3 flex-1 break-words min-w-0">{param.value || '未设置'}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 涂料和样板数量 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="border rounded-md py-2 px-3">
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">涂料数量</p>
                      </div>
                      <p className="text-lg font-medium mt-0.5">{sample.paint_number || "未设置"}</p>
                    </div>
                    <div className="border rounded-md py-2 px-3">
                      <div className="flex items-center">
                        <Layers className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">样板数量</p>
                      </div>
                      <p className="text-lg font-medium mt-0.5">{sample.sample_number || "未设置"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 样品编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto w-[95%]">
          <DialogHeader>
            <DialogTitle>编辑样品</DialogTitle>
          </DialogHeader>
          {currentSample && (
            <div className="space-y-4 sm:space-y-5 mt-2">
              {/* 样品图片上传 */}
              <div className="space-y-2">
                <Label>工件图片</Label>
                <div className="border rounded-md p-3 sm:p-4 flex flex-col items-center justify-center">
                  {currentSample.image ? (
                    <div className="relative w-full">
                      <img 
                        src={currentSample.image} 
                        alt="样品图片" 
                        className="max-h-40 mx-auto object-contain"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="absolute top-0 right-0"
                        onClick={() => setCurrentSample({...currentSample, image: '', image_url: ''})}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-muted h-20 w-full flex items-center justify-center rounded-md">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*" 
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button variant="outline" size="sm" onClick={triggerFileInput}>
                        上传图片
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 参数编辑 */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <Label>参数信息</Label>
                  {availableParameters.length > 0 && (
                    <div className="flex sm:flex-nowrap items-center gap-2">
                      <Select value={newParameterId} onValueChange={setNewParameterId}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="选择参数" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableParameters.map(param => (
                            <SelectItem key={param.id} value={param.id.toString()}>
                              {param.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={addParameter}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  {/* 移动端视图 - 编辑模式 */}
                  <div className="block sm:hidden min-h-[250px] max-h-[250px] overflow-y-auto">
                    {Array.isArray(currentSample.parameters_list) && currentSample.parameters_list.map((param: ParameterItem, index: number) => (
                      <div key={`${param.name}-${index}`} className="border-b border-gray-100 last:border-0">
                        <div className="py-2 px-3 bg-gray-50 flex items-center justify-between">
                          <span className="font-medium">{param.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => deleteParameter(param.name)}
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="py-1 px-2">
                          <Input 
                            value={param.value} 
                            onChange={(e) => updateParameterValue(param.name, e.target.value)} 
                            className="border-0 shadow-none focus-visible:ring-0 h-8"
                            placeholder="请输入"
                          />
                        </div>
                      </div>
                    ))}
                    {(!Array.isArray(currentSample.parameters_list) || currentSample.parameters_list.length === 0) && (
                      <div className="py-4 text-center text-muted-foreground">
                        请添加参数
                      </div>
                    )}
                  </div>
                  
                  {/* 桌面端视图 - 编辑模式 */}
                  <div className="hidden sm:block min-h-[250px] max-h-[250px] overflow-y-auto">
                    <table className="w-full h-full">
                      <tbody>
                        {Array.isArray(currentSample.parameters_list) && currentSample.parameters_list.map((param: ParameterItem, index: number) => (
                          <tr key={`${param.name}-${index}`} className="border-b border-gray-100 last:border-0">
                            <td className="py-3 px-4 border-r border-gray-100 w-1/3 sticky left-0 bg-white">
                              <div className="flex items-center justify-between">
                                <span>{param.name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0" 
                                  onClick={() => deleteParameter(param.name)}
                                >
                                  <X className="h-3 w-3 text-muted-foreground" />
                                </Button>
                              </div>
                            </td>
                            <td className="py-1 px-2">
                              <Input 
                                value={param.value} 
                                onChange={(e) => updateParameterValue(param.name, e.target.value)} 
                                className="border-0 shadow-none focus-visible:ring-0 h-8"
                                placeholder="请输入"
                              />
                            </td>
                          </tr>
                        ))}
                        {(!Array.isArray(currentSample.parameters_list) || currentSample.parameters_list.length === 0) && (
                          <tr>
                            <td colSpan={2} className="py-4 text-center text-muted-foreground">
                              请添加参数
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* 涂料和样板数量 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>涂料数量</Label>
                  </div>
                  <Input 
                    value={currentSample.paint_number} 
                    onChange={(e) => setCurrentSample({
                      ...currentSample, 
                      paint_number: e.target.value
                    })} 
                    placeholder="例如: 200ml"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label>样板数量</Label>
                  </div>
                  <Input 
                    value={currentSample.sample_number} 
                    onChange={(e) => setCurrentSample({
                      ...currentSample, 
                      sample_number: e.target.value
                    })} 
                    placeholder="例如: 5"
                  />
                </div>
              </div>
              
              {/* 编辑对话框底部按钮和错误提示 */}
              <div className="space-y-2">
                {validationError && (
                  <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
                    {validationError}
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button onClick={saveSampleChanges}>
                    保存
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 图片预览对话框 */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh]">
          <div className="relative">
            <img 
              src={previewImageUrl} 
              alt="图片预览" 
              className="w-full h-auto"
            />
            <Button 
              className="absolute top-2 right-2" 
              size="sm" 
              variant="secondary" 
              onClick={() => setImagePreviewOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ShareConfirmDeleteDialog
        open={openConfirmDeleteDialog}
        onOpenChange={setOpenConfirmDeleteDialog}
        title="删除样品"
        description={`您确定要删除 ${DeleteSampleData.version} 版本样品吗？该操作无法撤销。`}
        onConfirm={deleteSample}
      />
    </>
  )
} 