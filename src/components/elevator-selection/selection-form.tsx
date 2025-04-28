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
    <div className="space-y-2">
      {/* 页面右上角的固定按钮 */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <Button 
          onClick={handleSave}
          className="bg-white text-[#e26b0a] hover:bg-gray-100 flex items-center gap-1 shadow-md"
          size="sm"
        >
          <Save className="h-4 w-4" />
          保存
        </Button>
        <Button 
          onClick={handleReset}
          className="bg-gray-700 text-white hover:bg-gray-800 flex items-center gap-1 shadow-md"
          size="sm"
        >
          <RefreshCcw className="h-4 w-4" />
          重置
        </Button>
      </div>

      {/* 输入参数标题栏 */}
      <div className="flex items-center justify-between bg-[#e26b0a] text-white p-3 px-4 rounded-t-md">
        <h2 className="text-lg font-semibold">信息录入</h2>
      </div>

      {/* ENGINEERING YOUR NEED 标语 */}
      <div className="bg-white text-[#e26b0a] font-bold text-sm px-4 py-1 border-x border-gray-200">
        ENGINEERING YOUR NEED, KNOW YOU MORE TOGETHER       
      </div>

      {/* 输入参数表格 */}
      <div className="grid grid-cols-4 gap-3 p-4 border border-gray-200 rounded-b-md bg-gray-50">
        {/* 第一行 */}
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Lift Model</Label>
          <Select
            value={data.liftModel || ''}
            onValueChange={(value) => handleChange('liftModel', value)}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100' : 'bg-blue-50'} ${errors.liftModel ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.liftModel}
            >
              <SelectValue placeholder="选择电梯型号">
                {renderSelectedValue(data.liftModel, "选择电梯型号")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {renderLiftModelOptions()}
            </SelectContent>
          </Select>
          {errors.liftModel && <p className="text-xs text-red-500 mt-1">{errors.liftModel}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Capacity <span className='text-[#e26b0a]'>Q(kg)</span></Label>
          <Select
            value={data.capacity?.toString() || ''}
            onValueChange={(value) => handleChange('capacity', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.capacity ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.capacity}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.capacity, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Capacity?.map((capacity: number) => (
                <SelectItem key={capacity} value={capacity.toString()}>{capacity}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Speed <span className='text-[#e26b0a]'>V(m/s)</span></Label>
          <Select
            value={data.speed?.toString() || ''}
            onValueChange={(value) => handleChange('speed', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.speed ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.speed}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.speed, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Speed?.map((speed: number) => (
                <SelectItem key={speed} value={speed.toString()}>{speed}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.speed && <p className="text-xs text-red-500 mt-1">{errors.speed}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Travel Height <span className='text-[#e26b0a]'>R(m)</span></Label>
          <Select
            value={data.travelHeight?.toString() || ''}
            onValueChange={(value) => handleChange('travelHeight', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.travelHeight ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.travelHeight}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.travelHeight, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Travel_Height?.map((height: number) => (
                <SelectItem key={height} value={height.toString()}>{height}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.travelHeight && <p className="text-xs text-red-500 mt-1">{errors.travelHeight}</p>}
        </div>
        
        
        {/* 第二行 */}
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Car Width <span className='text-[#e26b0a]'>CW(mm)</span></Label>
          <Select
            value={data.carWidth?.toString() || ''}
            onValueChange={(value) => handleChange('carWidth', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.carWidth ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.carWidth}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.carWidth, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Car_Width?.map((width: number) => (
                <SelectItem key={width} value={width.toString()}>{width}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.carWidth && <p className="text-xs text-red-500 mt-1">{errors.carWidth}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Car Depth <span className='text-[#e26b0a]'>CD(mm)</span></Label>
          <Select
            value={data.carDepth?.toString() || ''}
            onValueChange={(value) => handleChange('carDepth', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.carDepth ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.carDepth}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.carDepth, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Car_Depth?.map((depth: number) => (
                <SelectItem key={depth} value={depth.toString()}>{depth}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.carDepth && <p className="text-xs text-red-500 mt-1">{errors.carDepth}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Car Height <span className='text-[#e26b0a]'>CH(mm)</span></Label>
          <Select
            value={data.carHeight?.toString() || ''}
            onValueChange={(value) => handleChange('carHeight', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.carHeight ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.carHeight}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.carHeight, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Car_Height?.map((height: number) => (
                <SelectItem key={height} value={height.toString()}>{height}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.carHeight && <p className="text-xs text-red-500 mt-1">{errors.carHeight}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">CWT Position</Label>
          <Select
            value={data.cwtPosition || ''}
            onValueChange={(value) => handleChange('cwtPosition', value as 'SIDE' | 'REAR')}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.cwtPosition ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.cwtPosition}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.cwtPosition, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.CWT_Position?.map((position: string) => (
                <SelectItem key={position} value={position}>{position}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cwtPosition && <p className="text-xs text-red-500 mt-1">{errors.cwtPosition}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">CWT Safety Gear</Label>
          <Select
            value={data.cwtSafetyGear ? 'YES' : 'NO'}
            onValueChange={(value) => handleChange('cwtSafetyGear', value === 'YES')}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.cwtSafetyGear ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.cwtSafetyGear}
            >
              <SelectValue placeholder="选择" />
            </SelectTrigger>
            <SelectContent>
              {options?.CWT_Safety_Gear?.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cwtSafetyGear && <p className="text-xs text-red-500 mt-1">{errors.cwtSafetyGear}</p>}
        </div>
        
        
        {/* 第三行 */}
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Opening</Label>
          <Select
            value={data.doorOpening || ''}
            onValueChange={(value) => handleChange('doorOpening', value)}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.doorOpening ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.doorOpening}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.doorOpening, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Door_Opening?.map((opening: string) => (
                <SelectItem key={opening} value={opening}>{opening}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doorOpening && <p className="text-xs text-red-500 mt-1">{errors.doorOpening}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Width <span className='text-[#e26b0a]'>DW(mm)</span></Label>
          <Select
            value={data.doorWidth?.toString() || ''}
            onValueChange={(value) => handleChange('doorWidth', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.doorWidth ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.doorWidth}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.doorWidth, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Door_Width?.map((width: number) => (
                <SelectItem key={width} value={width.toString()}>{width}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doorWidth && <p className="text-xs text-red-500 mt-1">{errors.doorWidth}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Height <span className='text-[#e26b0a]'>DH(mm)</span></Label>
          <Select
            value={data.doorHeight?.toString() || ''}
            onValueChange={(value) => handleChange('doorHeight', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.doorHeight ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.doorHeight}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.doorHeight, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Door_Height?.map((height: number) => (
                <SelectItem key={height} value={height.toString()}>{height}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doorHeight && <p className="text-xs text-red-500 mt-1">{errors.doorHeight}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Through Door</Label>
          <Select
            value={data.throughDoor ? 'YES' : 'NO'}
            onValueChange={(value) => handleChange('throughDoor', value === 'YES')}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.throughDoor ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.throughDoor}
            >
              <SelectValue placeholder="选择" />
            </SelectTrigger>
            <SelectContent>
              {options?.Through_Door?.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.throughDoor && <p className="text-xs text-red-500 mt-1">{errors.throughDoor}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Glass Door <span className='text-[#e26b0a]'>C2/S2</span></Label>
          <Select
            value={data.glassDoor ? 'YES' : 'NO'}
            onValueChange={(value) => handleChange('glassDoor', value === 'YES')}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.glassDoor ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.glassDoor}
            >
              <SelectValue placeholder="选择" />
            </SelectTrigger>
            <SelectContent>
              {options?.Glass_Door?.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.glassDoor && <p className="text-xs text-red-500 mt-1">{errors.glassDoor}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Model</Label>
          <div className="bg-gray-100 p-2 rounded flex items-center justify-center text-gray-500">
            <span className="text-center">未启用</span>
          </div>
        </div>


        {/* 第四行前添加虚线分隔 */}
        <div className="col-span-4 my-3 border-t border-dashed border-[#e26b0a]"></div>
        
        {/* 第四行 */}
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Standard</Label>
          <Select
            value={data.standard || ''}
            onValueChange={(value) => handleChange('standard', value)}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.standard ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.standard}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.standard, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Standard?.map((std: string) => (
                <SelectItem key={std} value={std}>{std}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.standard && <p className="text-xs text-red-500 mt-1">{errors.standard}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Center from Car Center</Label>
          <Select
            value={data.doorCenterPosition || ''}
            onValueChange={(value) => handleChange('doorCenterPosition', value)}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.doorCenterPosition ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.doorCenterPosition}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.doorCenterPosition, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Door_Center_from_Car_Center?.map((pos: string) => (
                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doorCenterPosition && <p className="text-xs text-red-500 mt-1">{errors.doorCenterPosition}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Car Area Exceed the Code</Label>
          <Select
            value={data.floorExceedCode ? 'Local Allow' : 'Not Allow'}
            onValueChange={(value) => handleChange('floorExceedCode', value === 'Local Allow')}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.floorExceedCode ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.floorExceedCode}
            >
              <SelectValue placeholder="选择" />
            </SelectTrigger>
            <SelectContent>
              {options?.Car_Area_Exceed_Code?.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.floorExceedCode && <p className="text-xs text-red-500 mt-1">{errors.floorExceedCode}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Shaft Tolerance</Label>
          <Select
            value={data.shaftTolerance || ''}
            onValueChange={(value) => handleChange('shaftTolerance', value)}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.shaftTolerance ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.shaftTolerance}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.shaftTolerance, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Shaft_Tolerance?.map((tolerance: string) => (
                <SelectItem key={tolerance} value={tolerance}>{tolerance}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.shaftTolerance && <p className="text-xs text-red-500 mt-1">{errors.shaftTolerance}</p>}
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Marble Floor <span className='text-[#e26b0a]'>(mm)</span></Label>
          <Select
            value={data.marbleFloorThickness?.toString() || ''}
            onValueChange={(value) => handleChange('marbleFloorThickness', Number(value))}
            disabled={!canEditOtherFields}
          >
            <SelectTrigger 
              className={`relative ${!canEditOtherFields ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-50'} ${errors.marbleFloorThickness ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.marbleFloorThickness}
            >
              <SelectValue placeholder="选择">
                {renderSelectedValue(data.marbleFloorThickness, "选择")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options?.Marble_Floor?.map((thickness: number) => (
                <SelectItem key={thickness} value={thickness.toString()}>{thickness}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.marbleFloorThickness && <p className="text-xs text-red-500 mt-1">{errors.marbleFloorThickness}</p>}
        </div>
        
      </div>
      
      {/* 注释提示 */}
      <div className={`flex items-start gap-2 p-3 ${showWarning ? 'bg-red-50 border border-red-300' : 'hidden'} rounded-md mt-1`}>
        {showWarning && (
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        )}
        <p className={`text-xs/6 ${showWarning ? 'text-red-600 font-medium' : 'hidden'}`}>
          Customer shall assure no problem on local government/3rd party inspection approval. In no event shall Winone's liability.
        </p>
      </div>
      
      
    </div>
  );
} 