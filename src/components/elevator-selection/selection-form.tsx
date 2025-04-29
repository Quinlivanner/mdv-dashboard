import React, { useState, useEffect } from 'react';
import { ElevatorSelectionData } from '@/lib/elevator-selection';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Save, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import modelData from '../../../data.json';

// 定义data.json的类型
interface ModelOptions {
  [key: string]: {
    Capacity: number[];
    Speed: number[];
    Travel_Height: number[];
    Car_Width: number[];
    Car_Depth: number[];
    Car_Height: number[];
    CWT_Position: string[];
    CWT_Safety_Gear: string[];
    Door_Opening: string[];
    Door_Width: number[];
    Door_Height: number[];
    Through_Door: string[];
    Glass_Door: string[];
    Standard: string[];
    Door_Center_from_Car_Center: string[];
    Car_Area_Exceed_Code: string[];
    Shaft_Tolerance: string[];
    Marble_Floor: number[];
  }
}

// 错误类型
interface FormErrors {
  [key: string]: string | undefined;
}

interface SelectionFormProps {
  data: ElevatorSelectionData;
  onChange: (data: Partial<ElevatorSelectionData>) => void;
}

export function SelectionForm({ data, onChange }: SelectionFormProps) {
  // 选项数据
  const [options, setOptions] = useState<any>(null);
  // 错误状态
  const [errors, setErrors] = useState<FormErrors>({});
  // 表单已提交状态
  const [submitted, setSubmitted] = useState(false);
  // 是否显示警告信息
  const [showWarning, setShowWarning] = useState(false);

  // 从缓存加载数据
  useEffect(() => {
    try {
      // 从URL路径获取商机ID，格式为/dashboard/opportunity/:id/elevator-selection
      const pathname = window.location.pathname;
      const matches = pathname.match(/\/dashboard\/opportunity\/([^\/]+)\/elevator-selection/);
      const opportunityId = matches ? matches[1] : null;
      
      if (opportunityId) {
        // 从localStorage获取数据时使用商机ID作为key
        const savedData = localStorage.getItem(`elevatorSelectionData-${opportunityId}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData) as ElevatorSelectionData;
          onChange(parsedData);
        }
      }
    } catch (error) {
      console.error('从缓存加载数据失败', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 移除onChange依赖，仅在组件挂载时执行一次

  // 当liftModel改变时，加载对应选项
  useEffect(() => {
    let shouldUpdateOptions = false;
    let newOptions = null;
    let newErrors = {...errors};
    
    if (data.liftModel && modelData[data.liftModel as keyof typeof modelData]) {
      newOptions = modelData[data.liftModel as keyof typeof modelData];
      // 清除liftModel的错误
      if (errors.liftModel) {
        newErrors = {...newErrors, liftModel: undefined};
      }
      shouldUpdateOptions = true;
    } else {
      newOptions = null;
      // 如果已提交且未选择liftModel，设置错误
      if (submitted && !errors.liftModel) {
        newErrors = {...newErrors, liftModel: '请先选择电梯型号'};
      }
      shouldUpdateOptions = true;
    }
    
    // 只有当options或errors真正需要更新时才更新状态
    if (shouldUpdateOptions && JSON.stringify(options) !== JSON.stringify(newOptions)) {
      setOptions(newOptions);
    }
    
    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.liftModel, submitted]); // 有意省略errors和options依赖，避免循环

  // 当Car Area Exceed Code改变时检查是否需要显示警告
  useEffect(() => {
    // 仅当状态值与当前显示状态不同时才更新
    if (showWarning !== (data.floorExceedCode === true)) {
      setShowWarning(data.floorExceedCode === true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.floorExceedCode]); // 有意省略showWarning依赖，避免循环

  const handleChange = (field: keyof ElevatorSelectionData, value: any) => {
    // 防止无限更新循环
    if (data[field] === value) {
      return; // 如果值没有变化，直接返回不触发更新
    }
    
    onChange({ [field]: value });
    
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
    
    // 如果正在修改liftModel，重置其他字段的错误
    if (field === 'liftModel' && value) {
      setErrors({});
    }
  };

  // 检查是否可以编辑其他字段
  const canEditOtherFields = !!data.liftModel && !!options;

  // 验证表单数据
  const validateForm = (): { isValid: boolean; errors: FormErrors } => {
    const newErrors: FormErrors = {};
    
    // 检查必填字段
    if (!data.liftModel) {
      newErrors.liftModel = '请选择电梯型号';
    }
    if (!data.capacity) {
      newErrors.capacity = '请选择载重';
    }
    if (!data.speed) {
      newErrors.speed = '请选择速度';
    }
    if (!data.travelHeight) {
      newErrors.travelHeight = '请选择行程高度';
    }
    if (!data.carWidth) {
      newErrors.carWidth = '请选择轿厢宽度';
    }
    if (!data.carDepth) {
      newErrors.carDepth = '请选择轿厢深度';
    }
    if (!data.carHeight) {
      newErrors.carHeight = '请选择轿厢高度';
    }
    if (!data.cwtPosition) {
      newErrors.cwtPosition = '请选择平衡重位置';
    }
    if (!data.doorOpening) {
      newErrors.doorOpening = '请选择门开启方式';
    }
    if (!data.doorWidth) {
      newErrors.doorWidth = '请选择门宽';
    }
    if (!data.doorHeight) {
      newErrors.doorHeight = '请选择门高';
    }
    if (!data.standard) {
      newErrors.standard = '请选择标准';
    }
    if (!data.doorCenterPosition) {
      newErrors.doorCenterPosition = '请选择门中心位置';
    }
    if (!data.shaftTolerance) {
      newErrors.shaftTolerance = '请选择井道公差';
    }
    if (!data.marbleFloorThickness) {
      newErrors.marbleFloorThickness = '请选择大理石地板厚度';
    }
    
    return { 
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  // 获取默认值
  const handleGetDefaultValue = () => {
    if (!canEditOtherFields) {
      setSubmitted(true);
      setErrors({liftModel: '请先选择电梯型号'});
      return;
    }
    // 这里需要实现获取默认值的逻辑
    console.log("获取默认值");
  };

  // 获取参考数据
  const handleGetReferenceData = () => {
    if (!canEditOtherFields) {
      setSubmitted(true);
      setErrors({liftModel: '请先选择电梯型号'});
      return;
    }
    // 这里需要实现获取参考数据的逻辑
    console.log("获取参考数据");
  };

  // 渲染Lift Model下拉选项
  const renderLiftModelOptions = () => {
    return Object.keys(modelData).map(model => (
      <SelectItem key={model} value={model}>{model}</SelectItem>
    ));
  };

  // 创建一个显示选中值的样式
  const renderSelectedValue = (value: string | number | undefined, placeholder: string) => {
    if (!value) return <span className="text-gray-400">{placeholder}</span>;
    return <span className="font-medium ]">{value}</span>;
  };

  // 保存到缓存
  const handleSave = () => {
    if (!canEditOtherFields) {
      // 避免重复设置相同状态
      if (!submitted) {
        setSubmitted(true);
      }
      
      // 避免重复设置相同错误
      if (errors.liftModel !== '请先选择电梯型号') {
        setErrors(prev => ({...prev, liftModel: '请先选择电梯型号'}));
      }
      
      toast.error('请先选择电梯型号');
      return;
    }
    
    // 验证表单
    const { isValid, errors: validationErrors } = validateForm();
    if (!isValid) {
      setErrors(validationErrors);
      setSubmitted(true);
      toast.error('表单填写不完整，请完成所有必填项');
      return;
    }
    
    try {
      // 从URL路径获取商机ID，格式为/dashboard/opportunity/:id/elevator-selection
      const pathname = window.location.pathname;
      const matches = pathname.match(/\/dashboard\/opportunity\/([^\/]+)\/elevator-selection/);
      const opportunityId = matches ? matches[1] : null;
      
      if (!opportunityId) {
        toast.error('无法保存：未找到商机ID！');
        return;
      }
      
      // 添加保存标记
      const dataToSave = {
        ...data,
        isSubmitted: true,
        submittedAt: new Date().toISOString()
      };
      
      // 使用商机ID作为key保存到localStorage
      localStorage.setItem(`elevatorSelectionData-${opportunityId}`, JSON.stringify(dataToSave));
      
      // 保存一个商机提交状态的映射表
      let submittedOpportunities: {[key: string]: boolean} = {};
      try {
        const saved = localStorage.getItem('submittedElevatorSelections');
        if (saved) {
          submittedOpportunities = JSON.parse(saved);
        }
      } catch (e) {
        console.error('读取提交状态失败', e);
      }
      
      // 更新该商机的提交状态
      submittedOpportunities[opportunityId] = true;
      localStorage.setItem('submittedElevatorSelections', JSON.stringify(submittedOpportunities));
      
      toast.success('保存成功：您的电梯选型参数已成功保存到本地！');
    } catch (error) {
      console.error('保存数据失败', error);
      toast.error('保存失败：无法将电梯选型参数保存到本地，请重试！');
    }
  };

  // 重置缓存数据
  const handleReset = () => {
    try {
      // 从URL路径获取商机ID，格式为/dashboard/opportunity/:id/elevator-selection
      const pathname = window.location.pathname;
      const matches = pathname.match(/\/dashboard\/opportunity\/([^\/]+)\/elevator-selection/);
      const opportunityId = matches ? matches[1] : null;
      
      if (opportunityId) {
        // 移除特定商机的数据
        localStorage.removeItem(`elevatorSelectionData-${opportunityId}`);
        
        // 从提交状态映射表中移除该商机
        let submittedOpportunities: {[key: string]: boolean} = {};
        try {
          const saved = localStorage.getItem('submittedElevatorSelections');
          if (saved) {
            submittedOpportunities = JSON.parse(saved);
            delete submittedOpportunities[opportunityId];
            localStorage.setItem('submittedElevatorSelections', JSON.stringify(submittedOpportunities));
          }
        } catch (e) {
          console.error('更新提交状态失败', e);
        }
      }
      
      // 避免重复设置默认状态
      const defaultData = {
        liftModel: '',
        capacity: undefined,
        speed: undefined,
        travelHeight: undefined,
        carWidth: undefined,
        carDepth: undefined,
        carHeight: undefined,
        cwtPosition: undefined,
        cwtSafetyGear: false,
        doorOpening: undefined,
        doorWidth: undefined,
        doorHeight: undefined,
        throughDoor: false,
        glassDoor: false,
        standard: undefined,
        doorCenterPosition: undefined,
        floorExceedCode: false,
        shaftTolerance: undefined,
        marbleFloorThickness: undefined,
      };
      
      // 只有当前数据与默认数据不同时才更新
      if (JSON.stringify(data) !== JSON.stringify(defaultData)) {
        onChange(defaultData);
      }
      
      // 避免重复设置空错误
      if (Object.keys(errors).length > 0) {
        setErrors({});
      }
      
      // 避免重复设置null选项
      if (options !== null) {
        setOptions(null);
      }
      
      // 避免重复设置submitted状态
      if (submitted) {
        setSubmitted(false);
      }
      
      toast.success('重置成功：所有电梯选型参数已清除并恢复默认状态！');
    } catch (error) {
      console.error('重置数据失败', error);
      toast.error('重置失败：无法清除本地保存的电梯选型参数，请重试！');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 固定的操作按钮组 */}
      <div className="fixed top-4 right-4 flex gap-3 z-50">
        <Button 
          onClick={handleSave}
          className="bg-[#00B4AA] text-white hover:bg-[#009B92] flex items-center gap-2 shadow-lg transition-all duration-200"
          size="default"
        >
          <Save className="h-4 w-4" />
          提交选型
        </Button>
        <Button 
          onClick={handleReset}
          className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 flex items-center gap-2 shadow-lg transition-all duration-200"
          size="default"
        >
          <RefreshCcw className="h-4 w-4" />
          重置选型
        </Button>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 头部信息 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#00B4AA] to-[#0092D8] text-white p-6">
            <h2 className="text-2xl font-semibold">电梯选型</h2>
            <p className="mt-2 text-white/80">ENGINEERING YOUR NEED, KNOW YOU MORE TOGETHER</p>
          </div>
        </div>

        {/* 警告信息 */}
        {showWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">注意</h3>
              <p className="text-amber-700 text-sm mt-1">当前选择的轿厢面积超出标准规范，请确认是否继续。</p>
            </div>
          </div>
        )}

        {/* 表单内容 - 基本参数 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">基本参数</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Lift Model */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Lift Model
                <span className="text-[#00B4AA] ml-1">*</span>
              </Label>
              <Select
                value={data.liftModel || ''}
                onValueChange={(value) => handleChange('liftModel', value)}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'} 
                    ${errors.liftModel ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择电梯型号" />
                </SelectTrigger>
                <SelectContent>
                  {renderLiftModelOptions()}
                </SelectContent>
              </Select>
              {errors.liftModel && (
                <p className="text-xs text-red-500 mt-1">{errors.liftModel}</p>
              )}
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Capacity</span>
                <span className="text-[#00B4AA] text-xs">Q(kg)</span>
              </Label>
              <Select
                value={data.capacity?.toString() || ''}
                onValueChange={(value) => handleChange('capacity', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.capacity ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择载重" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Capacity?.map((capacity: number) => (
                    <SelectItem key={capacity} value={capacity.toString()}>{capacity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.capacity && (
                <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>
              )}
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Speed</span>
                <span className="text-[#00B4AA] text-xs">V(m/s)</span>
              </Label>
              <Select
                value={data.speed?.toString() || ''}
                onValueChange={(value) => handleChange('speed', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.speed ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择速度" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Speed?.map((speed: number) => (
                    <SelectItem key={speed} value={speed.toString()}>{speed}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.speed && (
                <p className="text-xs text-red-500 mt-1">{errors.speed}</p>
              )}
            </div>

            {/* Travel Height */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Travel Height</span>
                <span className="text-[#00B4AA] text-xs">R(m)</span>
              </Label>
              <Select
                value={data.travelHeight?.toString() || ''}
                onValueChange={(value) => handleChange('travelHeight', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.travelHeight ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择行程" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Travel_Height?.map((height: number) => (
                    <SelectItem key={height} value={height.toString()}>{height}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.travelHeight && (
                <p className="text-xs text-red-500 mt-1">{errors.travelHeight}</p>
              )}
            </div>
          </div>
        </div>

        {/* 表单内容 - 轿厢参数 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">轿厢参数</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Car Width */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Car Width</span>
                <span className="text-[#00B4AA] text-xs">CW(mm)</span>
              </Label>
              <Select
                value={data.carWidth?.toString() || ''}
                onValueChange={(value) => handleChange('carWidth', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.carWidth ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择宽度" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Car_Width?.map((width: number) => (
                    <SelectItem key={width} value={width.toString()}>{width}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carWidth && (
                <p className="text-xs text-red-500 mt-1">{errors.carWidth}</p>
              )}
            </div>

            {/* Car Depth */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Car Depth</span>
                <span className="text-[#00B4AA] text-xs">CD(mm)</span>
              </Label>
              <Select
                value={data.carDepth?.toString() || ''}
                onValueChange={(value) => handleChange('carDepth', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.carDepth ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择深度" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Car_Depth?.map((depth: number) => (
                    <SelectItem key={depth} value={depth.toString()}>{depth}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carDepth && (
                <p className="text-xs text-red-500 mt-1">{errors.carDepth}</p>
              )}
            </div>

            {/* Car Height */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Car Height</span>
                <span className="text-[#00B4AA] text-xs">CH(mm)</span>
              </Label>
              <Select
                value={data.carHeight?.toString() || ''}
                onValueChange={(value) => handleChange('carHeight', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.carHeight ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择高度" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Car_Height?.map((height: number) => (
                    <SelectItem key={height} value={height.toString()}>{height}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carHeight && (
                <p className="text-xs text-red-500 mt-1">{errors.carHeight}</p>
              )}
            </div>

            {/* CWT Position */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">CWT Position</Label>
              <Select
                value={data.cwtPosition || ''}
                onValueChange={(value) => handleChange('cwtPosition', value as 'SIDE' | 'REAR')}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.cwtPosition ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择位置" />
                </SelectTrigger>
                <SelectContent>
                  {options?.CWT_Position?.map((position: string) => (
                    <SelectItem key={position} value={position}>{position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cwtPosition && (
                <p className="text-xs text-red-500 mt-1">{errors.cwtPosition}</p>
              )}
            </div>
          </div>
        </div>

        {/* 表单内容 - 门系统参数 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">门系统参数</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Door Opening */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Door Opening</Label>
              <Select
                value={data.doorOpening || ''}
                onValueChange={(value) => handleChange('doorOpening', value)}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.doorOpening ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择开门方式" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Door_Opening?.map((opening: string) => (
                    <SelectItem key={opening} value={opening}>{opening}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doorOpening && (
                <p className="text-xs text-red-500 mt-1">{errors.doorOpening}</p>
              )}
            </div>

            {/* Door Width */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Door Width</span>
                <span className="text-[#00B4AA] text-xs">DW(mm)</span>
              </Label>
              <Select
                value={data.doorWidth?.toString() || ''}
                onValueChange={(value) => handleChange('doorWidth', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.doorWidth ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择门宽" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Door_Width?.map((width: number) => (
                    <SelectItem key={width} value={width.toString()}>{width}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doorWidth && (
                <p className="text-xs text-red-500 mt-1">{errors.doorWidth}</p>
              )}
            </div>

            {/* Door Height */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Door Height</span>
                <span className="text-[#00B4AA] text-xs">DH(mm)</span>
              </Label>
              <Select
                value={data.doorHeight?.toString() || ''}
                onValueChange={(value) => handleChange('doorHeight', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.doorHeight ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择门高" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Door_Height?.map((height: number) => (
                    <SelectItem key={height} value={height.toString()}>{height}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doorHeight && (
                <p className="text-xs text-red-500 mt-1">{errors.doorHeight}</p>
              )}
            </div>

            {/* Through Door */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Through Door</Label>
              <Select
                value={data.throughDoor ? 'YES' : 'NO'}
                onValueChange={(value) => handleChange('throughDoor', value === 'YES')}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.throughDoor ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择是否" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Through_Door?.map((option: string) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.throughDoor && (
                <p className="text-xs text-red-500 mt-1">{errors.throughDoor}</p>
              )}
            </div>
          </div>
        </div>

        {/* 表单内容 - 其他参数 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">其他参数</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Glass Door */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Glass Door</span>
                <span className="text-[#00B4AA] text-xs">C2/S2</span>
              </Label>
              <Select
                value={data.glassDoor ? 'YES' : 'NO'}
                onValueChange={(value) => handleChange('glassDoor', value === 'YES')}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.glassDoor ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择是否" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Glass_Door?.map((option: string) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.glassDoor && (
                <p className="text-xs text-red-500 mt-1">{errors.glassDoor}</p>
              )}
            </div>

            {/* Standard */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Standard</Label>
              <Select
                value={data.standard || ''}
                onValueChange={(value) => handleChange('standard', value)}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.standard ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择标准" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Standard?.map((standard: string) => (
                    <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.standard && (
                <p className="text-xs text-red-500 mt-1">{errors.standard}</p>
              )}
            </div>

            {/* Door Center Position */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Door Center Position</Label>
              <Select
                value={data.doorCenterPosition || ''}
                onValueChange={(value) => handleChange('doorCenterPosition', value)}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.doorCenterPosition ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择位置" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Door_Center_from_Car_Center?.map((position: string) => (
                    <SelectItem key={position} value={position}>{position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doorCenterPosition && (
                <p className="text-xs text-red-500 mt-1">{errors.doorCenterPosition}</p>
              )}
            </div>

            {/* Shaft Tolerance */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Shaft Tolerance</Label>
              <Select
                value={data.shaftTolerance || ''}
                onValueChange={(value) => handleChange('shaftTolerance', value)}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.shaftTolerance ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择公差" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Shaft_Tolerance?.map((tolerance: string) => (
                    <SelectItem key={tolerance} value={tolerance}>{tolerance}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shaftTolerance && (
                <p className="text-xs text-red-500 mt-1">{errors.shaftTolerance}</p>
              )}
            </div>
            
            {/* Marble Floor Thickness */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Marble Floor Thickness</Label>
              <Select
                value={data.marbleFloorThickness?.toString() || ''}
                onValueChange={(value) => handleChange('marbleFloorThickness', Number(value))}
                disabled={!canEditOtherFields}
              >
                <SelectTrigger 
                  className={`w-full transition-colors duration-200
                    ${!canEditOtherFields ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} 
                    ${errors.marbleFloorThickness ? 'border-red-300 ring-red-100' : 'border-gray-200 hover:border-[#00B4AA]'}
                  `}
                >
                  <SelectValue placeholder="选择厚度" />
                </SelectTrigger>
                <SelectContent>
                  {options?.Marble_Floor?.map((thickness: number) => (
                    <SelectItem key={thickness} value={thickness.toString()}>{thickness}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.marbleFloorThickness && (
                <p className="text-xs text-red-500 mt-1">{errors.marbleFloorThickness}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 