import React from 'react';
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

interface SelectionFormProps {
  data: ElevatorSelectionData;
  onChange: (data: Partial<ElevatorSelectionData>) => void;
}

export function SelectionForm({ data, onChange }: SelectionFormProps) {
  const handleChange = (field: keyof ElevatorSelectionData, value: any) => {
    onChange({ [field]: value });
  };

  // 获取默认值
  const handleGetDefaultValue = () => {
    // 这里需要实现获取默认值的逻辑
    console.log("获取默认值");
  };

  // 获取参考数据
  const handleGetReferenceData = () => {
    // 这里需要实现获取参考数据的逻辑
    console.log("获取参考数据");
  };

  return (
    <div className="space-y-4">
      {/* 输入参数标题栏 */}
      <div className="flex items-center justify-between bg-orange-500 text-white p-2 px-4 rounded-t-md">
        <h2 className="text-lg font-semibold">信息录入</h2>
        <Button 
          onClick={handleGetReferenceData}
          variant="outline" 
          className="bg-white text-black hover:bg-gray-100"
        >
          Get Reference Data
        </Button>
      </div>

      {/* 输入参数表格 */}
      <div className="grid grid-cols-6 gap-2 p-2 border border-gray-200 rounded-b-md">
        {/* 第一行 */}
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Lift Model</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>LTHW Car</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Capacity Q(kg)</Label>
          <Select
            value={data.capacity?.toString() || ''}
            onValueChange={(value) => handleChange('capacity', Number(value))}
          >
            <SelectTrigger className="relative">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="630">630</SelectItem>
              <SelectItem value="800">800</SelectItem>
              <SelectItem value="1000">1000</SelectItem>
              <SelectItem value="1250">1250</SelectItem>
              <SelectItem value="1600">1600</SelectItem>
              <SelectItem value="2000">2000</SelectItem>
              <SelectItem value="3000">3000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Speed V(m/s)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>2</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Travel Height R(m)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>20</span>
          </div>
        </div>
        
        <div className="col-span-2 text-center">
          <Button 
            onClick={handleGetDefaultValue}
            variant="outline" 
            className="mt-6 w-full"
          >
            Get Default Value
          </Button>
        </div>
        
        {/* 第二行 */}
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Car Width CW(mm)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>2500</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Car Depth CD(mm)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>2500</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Car Height CH(mm)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>2200</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">CWT Position</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>SIDE</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">CWT Safety Gear</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>No</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1"></Label>
          <div className="p-2 rounded flex items-center text-gray-500 justify-center">
            <span>不适用于观光梯</span>
          </div>
        </div>
        
        {/* 第三行 */}
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Opening</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>C4</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Width DW(mm)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>1700</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Height DH(mm)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>2100</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Through Door</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>No</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Glass Door(C2/S2)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>No</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Model</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>未启用</span>
          </div>
        </div>
        
        {/* 第四行 */}
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Standard</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>EN81-1</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Door Center from Car...</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>Offset</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Car Area Exceed the Code</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>Local allow</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Shaft Tolerance</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>Normal</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1">Marble Floor(mm)</Label>
          <div className="bg-blue-100 p-2 rounded flex items-center justify-center">
            <span>30</span>
          </div>
        </div>
        
        <div className="col-span-1 text-center">
          <Label className="block text-sm font-medium mb-1"></Label>
          <div className="p-2 rounded flex items-center text-gray-500 justify-center">
            <span>490kg</span>
          </div>
        </div>
      </div>
      
      {/* 注释提示 */}
      <div className="text-xs text-gray-500 text-center">
        Customer shall assure no problem on local government/3rd party inspection approval. In no event...
      </div>
    </div>
  );
} 