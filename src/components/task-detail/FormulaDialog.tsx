"use client";

import {SampleFormulaType} from "@/api/rad/types";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {ChevronDown, ChevronUp, PlusIcon, Trash2Icon, XIcon} from "lucide-react";
import {toast} from "sonner";
import { useEffect, useState } from "react";
import { getRawMaterialSelectListRequest } from "@/api/suppliers/api";
import { SimpleSelectField } from "@/components/share/select/simple-select";


interface FormulaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: SampleFormulaType;
  setFormData: React.Dispatch<React.SetStateAction<SampleFormulaType>>;
  onSave: () => void;
  openBasicData: boolean;
  setOpenBasicData: React.Dispatch<React.SetStateAction<boolean>>;
  openPerformance: boolean;
  setOpenPerformance: React.Dispatch<React.SetStateAction<boolean>>;
  openDetailParams?: boolean;
  setOpenDetailParams?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FormulaDialog({
  isOpen,
  onOpenChange,
  title,
  formData,
  setFormData,
  onSave,
  openBasicData,
  setOpenBasicData,
  openPerformance,
  setOpenPerformance,
  openDetailParams = false,
  setOpenDetailParams = () => {},
}: FormulaDialogProps) {
  
 
   // 原材料选择器列表状态
   const [rawMaterialSelectList, setRawMaterialSelectList] = useState<string[]>([]);

   // 获取原材料选择器列表数据
   useEffect(() => {
    if (isOpen) {
      getRawMaterialSelectListRequest().then((res) => {
        setRawMaterialSelectList(res.data);
      }).catch((err) => {
        toast.error("获取原材料选择器列表失败:" + err);
      });
    }
   }, [isOpen]);
  
  // 处理底材变更
  const handleBaseMaterialChange = (value: string, index: number) => {
    setFormData((prevData: SampleFormulaType) => {
      const newBaseMaterials = [...prevData.baseMaterials];
      newBaseMaterials[index] = value;
      return { ...prevData, baseMaterials: newBaseMaterials };
    });
  };

  // 添加一行底材
  const addBaseMaterial = () => {
    setFormData((prevData: SampleFormulaType) => {
      // 如果已经有3行底材，不再添加
      if (prevData.baseMaterials.length >= 3) {
        toast.info("底材最多添加三行");
        return prevData;
      }
      return { ...prevData, baseMaterials: [...prevData.baseMaterials, ""] };
    });
  };

  // 删除一行底材
  const removeBaseMaterial = (index: number) => {
    setFormData((prevData: SampleFormulaType) => {
      if (prevData.baseMaterials.length <= 1) {
        // 至少保留一行
        return prevData;
      }
      
      const newBaseMaterials = [...prevData.baseMaterials];
      newBaseMaterials.splice(index, 1);
      return { ...prevData, baseMaterials: newBaseMaterials };
    });
  };

  // 处理表单输入变化
  const handleInputChange = (
    section: keyof SampleFormulaType,
    value?: string | number
  ) => {
    console.log(section,value)
    // 获取 section 值的类型
    const sectionType = typeof section;
    console.log(sectionType)
    setFormData((prevData: SampleFormulaType) => ({
      ...prevData,
      [section]: value,
    }));
  };

  // 添加解决方案组合
  const addSolutionComposition = (solutionType: 'acSolutionComposition' | 'bSolutionComposition') => {
    setFormData((prevData: SampleFormulaType) => {
      const newCompositions = [...prevData[solutionType]];
      newCompositions.push({
        name: '',
        ingredients: []
      });
      return {
        ...prevData,
        [solutionType]: newCompositions
      };
    });
  };

  // 删除解决方案组合
  const removeSolutionComposition = (
    solutionType: 'acSolutionComposition' | 'bSolutionComposition', 
    index: number
  ) => {
    setFormData((prevData: SampleFormulaType) => {
      const newCompositions = [...prevData[solutionType]];
      newCompositions.splice(index, 1);
      return {
        ...prevData,
        [solutionType]: newCompositions
      };
    });
  };

  // 更新解决方案组合名称
  const updateSolutionName = (
    solutionType: 'acSolutionComposition' | 'bSolutionComposition',
    index: number,
    name: string
  ) => {
    setFormData((prevData: SampleFormulaType) => {
      const newCompositions = [...prevData[solutionType]];
      newCompositions[index] = {
        ...newCompositions[index],
        name
      };
      return {
        ...prevData,
        [solutionType]: newCompositions
      };
    });
  };

  // 添加成分
  const addIngredient = (
    solutionType: 'acSolutionComposition' | 'bSolutionComposition',
    compositionIndex: number
  ) => {
    setFormData((prevData: SampleFormulaType) => {
      const newCompositions = [...prevData[solutionType]];
      newCompositions[compositionIndex] = {
        ...newCompositions[compositionIndex],
        ingredients: [
          ...newCompositions[compositionIndex].ingredients,
          { name: '', percentage: 0 }
        ]
      };
      return {
        ...prevData,
        [solutionType]: newCompositions
      };
    });
  };

  // 删除成分
  const removeIngredient = (
    solutionType: 'acSolutionComposition' | 'bSolutionComposition',
    compositionIndex: number,
    ingredientIndex: number
  ) => {
    setFormData((prevData: SampleFormulaType) => {
      const newCompositions = [...prevData[solutionType]];
      const newIngredients = [...newCompositions[compositionIndex].ingredients];
      newIngredients.splice(ingredientIndex, 1);
      newCompositions[compositionIndex] = {
        ...newCompositions[compositionIndex],
        ingredients: newIngredients
      };
      return {
        ...prevData,
        [solutionType]: newCompositions
      };
    });
  };

  // 更新成分属性
  const updateIngredient = (
    solutionType: 'acSolutionComposition' | 'bSolutionComposition',
    compositionIndex: number,
    ingredientIndex: number,
    field: 'name' | 'percentage',
    value: string | number
  ) => {
    setFormData((prevData: SampleFormulaType) => {
    // 获取当前解决方案组合
      const newCompositions = [...prevData[solutionType]];
      // 获取当前解决方案组合的成分列表
      const newIngredients = [...newCompositions[compositionIndex].ingredients];
      // 更新成分属性
      newIngredients[ingredientIndex] = {
        ...newIngredients[ingredientIndex],
        [field]: field === 'name' ? value : Number(value)
      };
      // 更新解决方案组合的成分列表
      newCompositions[compositionIndex] = {
        ...newCompositions[compositionIndex],
        ingredients: newIngredients
      };
      // 更新解决方案组合
      return {
        ...prevData,
        [solutionType]: newCompositions
      };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95%] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[calc(80vh-120px)] overflow-y-auto pr-2">
          {/* 基础数据部分 */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 border-border">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">基础数据</Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-9 p-0"
                onClick={() => setOpenBasicData(!openBasicData)}
              >
                {openBasicData ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </div>
            {openBasicData && (
              <div className="space-y-4 border border-border rounded-lg p-4 bg-background">
                <div className="grid gap-2">
                  <Label>底材</Label>
                  {formData.baseMaterials.map((material: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={material}
                        onChange={(e) => handleBaseMaterialChange(e.target.value, index)}
                        placeholder="请输入底材"
                      />
                      {formData.baseMaterials.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBaseMaterial(index)}
                          className="flex-shrink-0"
                        >
                          <XIcon size={16} />
                        </Button>
                      )}
                      {index === formData.baseMaterials.length - 1 && formData.baseMaterials.length < 3 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={addBaseMaterial}
                          className="flex-shrink-0"
                        >
                          <PlusIcon size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="sanding">打砂 - 砂径（目）</Label>
                  <Input
                    id="sanding"
                    value={formData.sanding || ''}
                    onChange={(e) => handleInputChange("sanding", e.target.value)}
                    placeholder="请输入砂径，如: 80"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="baseOil">过滤 - 底油（目）</Label>
                    <Input
                      id="baseOil"
                      value={formData.filterBottomOil || ''}
                      onChange={(e) => handleInputChange("filterBottomOil", e.target.value)}
                      placeholder="请输入底油目数，如: 300"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="surfaceOil">过滤 - 面油（目）</Label>
                    <Input
                      id="surfaceOil"
                      value={formData.filterTopOil || ''}
                      onChange={(e) => handleInputChange("filterTopOil", e.target.value)}
                      placeholder="请输入面油目数"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="preheatingTemp">预热 - 温度(℃)</Label>
                    <Input
                      id="preheatingTemp"
                      value={formData.preheatingTemperature || ''}
                      onChange={(e) => handleInputChange("preheatingTemperature", e.target.value)}
                      placeholder="例如: 40-50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="preheatingTime">预热 - 时间(分钟)</Label>
                    <Input
                      id="preheatingTime"
                      value={formData.preheatingTime || ''}
                      onChange={(e) => handleInputChange("preheatingTime", e.target.value)}
                      placeholder="例如: 5-10分钟"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sinteringTemp">烧结 - 温度(℃)</Label>
                    <Input
                      id="sinteringTemp"
                      value={formData.sinteringTemperature || ''}
                      onChange={(e) => handleInputChange("sinteringTemperature", e.target.value)}
                      placeholder="例如: 400C"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sinteringTime">烧结 - 时间(分钟)</Label>
                    <Input
                      id="sinteringTime"
                      value={formData.sinteringTime || ''}
                      onChange={(e) => handleInputChange("sinteringTime", e.target.value)}
                      placeholder="例如: 10分钟"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="color">颜色</Label>
                    <Input
                      id="color"
                      value={formData.color || ''}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      placeholder="例如: XXX Pink"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gloss">光泽度</Label>
                    <Input
                      id="gloss"
                      value={formData.gloss || ''}
                      onChange={(e) => handleInputChange("gloss", e.target.value)}
                      placeholder="例如: 45%-55%"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="baseOilViscosity">底油 - 粘度（秒）</Label>
                    <Input
                      id="baseOilViscosity"
                      value={formData.bottomOilViscosity || ''}
                      onChange={(e) => handleInputChange("bottomOilViscosity", e.target.value)}
                      placeholder="例如: 12"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="baseOilDensity">底油 - 比重（g/ml）</Label>
                    <Input
                      id="baseOilDensity"
                      value={formData.bottomOilDensity || ''}
                      onChange={(e) => handleInputChange("bottomOilDensity", e.target.value)}
                      placeholder="例如: 1.1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="surfaceOilViscosity">面油 - 粘度（秒）</Label>
                    <Input
                      id="surfaceOilViscosity"
                      value={formData.topOilViscosity || ''}
                      onChange={(e) => handleInputChange("topOilViscosity", e.target.value)}
                      placeholder="例如: 12"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="surfaceOilDensity">面油 - 比重（g/ml）</Label>
                    <Input
                      id="surfaceOilDensity"
                      value={formData.topOilDensity || ''}
                      onChange={(e) => handleInputChange("topOilDensity", e.target.value)}
                      placeholder="例如: 1.1"
                    />
                  </div>
                </div>
              </div>
              
            )}
          </div>

          {/* 分割线 */}
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* 干膜性能评估 */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 border-border">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">干膜性能评估 (从差到优 1-5级)</Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-9 p-0"
                onClick={() => setOpenPerformance(!openPerformance)}
              >
                {openPerformance ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </div>
            {openPerformance && (
              <div className="space-y-4 border border-border rounded-lg p-4 bg-background">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nonStickiness">不粘性</Label>
                    <Input
                      id="nonStickiness"
                      min="0"
                      max="5"
                      value={formData.nonStickiness || ''}
                      onChange={(e) => handleInputChange("nonStickiness", e.target.value)}
                      placeholder="1-5级"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wearResistance">耐磨性</Label>
                    <Input
                      id="wearResistance"
                      min="0"
                      max="5"
                      value={formData.wearResistance || ''}
                      onChange={(e) => handleInputChange("wearResistance", e.target.value)}
                      placeholder="1-5级"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="liveResistance">耐煮性</Label>
                    <Input
                      id="liveResistance"
                      min="0"
                      max="5"
                      value={formData.boilingResistance || ''}
                      onChange={(e) => handleInputChange("boilingResistance", e.target.value)}
                      placeholder="1-5级" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="scratchResistance">耐刮性</Label>
                    <Input
                      id="scratchResistance"
                      min="0"
                      max="5"
                      value={formData.scratchResistance || ''}
                      onChange={(e) => handleInputChange("scratchResistance", e.target.value)}
                      placeholder="1-5级"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 分割线 */}
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* 详细参数区域 */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 border-border">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">详细参数</Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-9 p-0"
                onClick={() => setOpenDetailParams(!openDetailParams)}
              >
                {openDetailParams ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </div>
            {openDetailParams && (
              <div className="space-y-4 border border-border rounded-lg p-4 bg-background">
                <div className="grid gap-2">
                  <Label htmlFor="sol">Sol</Label>
                  <Input
                    id="sol"
                    value={formData.sol || ''}
                    onChange={(e) => handleInputChange("sol", e.target.value)}
                    placeholder="请输入Sol"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="binder">Binder</Label>
                  <Input
                    id="binder"
                    value={formData.binder || ''}
                    onChange={(e) => handleInputChange("binder", e.target.value)}
                    placeholder="请输入Binder"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="additives">Additives</Label>
                  <Input
                    id="additives"
                    value={formData.additives || ''}
                    onChange={(e) => handleInputChange("additives", e.target.value)}
                    placeholder="请输入添加剂"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="mixingRatio">Mixing Ratio</Label>
                  <Input
                    id="mixingRatio"
                    value={formData.mixingRatio || ''}
                    onChange={(e) => handleInputChange("mixingRatio", e.target.value)}
                    placeholder="请输入混合比例"
                  />
                </div>
                
                {/* AC解决方案组合 */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">AC Solution Composition</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addSolutionComposition('acSolutionComposition')}
                      className="h-8 px-2"
                    >
                      <PlusIcon size={16} className="mr-1" />
                      添加组合
                    </Button>
                  </div>
                  
                  {formData.acSolutionComposition.length === 0 ? (
                    <div className="text-sm text-muted-foreground  p-2">暂无组合</div>
                  ) : (
                    formData.acSolutionComposition.map((composition, compositionIndex) => (
                      <div key={compositionIndex} className="border rounded-md p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 mr-2">
                            <Label htmlFor={`ac-composition-${compositionIndex}-name`} className="mb-1 block">组合名称</Label>
                            <Input 
                              id={`ac-composition-${compositionIndex}-name`}
                              value={composition.name}
                              onChange={(e) => updateSolutionName('acSolutionComposition', compositionIndex, e.target.value)}
                              placeholder="输入组合名称"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSolutionComposition('acSolutionComposition', compositionIndex)}
                            className="h-8 w-8 mt-6"
                          >
                            <Trash2Icon size={16} />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm">成分列表</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addIngredient('acSolutionComposition', compositionIndex)}
                              className="h-7 px-2 text-xs"
                            >
                              <PlusIcon size={14} className="mr-1" />
                              添加成分
                            </Button>
                          </div>
                          
                          {composition.ingredients.length === 0 ? (
                            <div className="text-xs text-muted-foreground pl-2 not-italic">暂无成分</div>
                          ) : (
                            <div className="space-y-2">
                              {/* 成分列表映射 - 使用原材料下拉选择器 */}
                              {composition.ingredients.map((ingredient, ingredientIndex) => (
                                <div key={ingredientIndex} className="grid grid-cols-12 gap-2 items-center">
                                  <div className="col-span-8">
                                    <SimpleSelectField 
                                      label=""
                                      placeholder="选择成分名称"
                                      value={ingredient.name}
                                      onChange={(value) => updateIngredient('acSolutionComposition', compositionIndex, ingredientIndex, 'name', value)}
                                      options={rawMaterialSelectList}
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Input 
                                      type="number"
                                      placeholder="百分比"
                                      min="0"
                                      max="100"
                                      value={ingredient.percentage}
                                      onChange={(e) => updateIngredient('acSolutionComposition', compositionIndex, ingredientIndex, 'percentage', e.target.value)}
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeIngredient('acSolutionComposition', compositionIndex, ingredientIndex)}
                                      className="h-6 w-6"
                                    >
                                      <XIcon size={14} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* B解决方案组合 */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">B Solution Composition</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addSolutionComposition('bSolutionComposition')}
                      className="h-8 px-2"
                    >
                      <PlusIcon size={16} className="mr-1" />
                      添加组合
                    </Button>
                  </div>
                  
                  {formData.bSolutionComposition.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2">暂无组合</div>
                  ) : (
                    formData.bSolutionComposition.map((composition, compositionIndex) => (
                      <div key={compositionIndex} className="border rounded-md p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 mr-2">
                            <Label htmlFor={`b-composition-${compositionIndex}-name`} className="mb-1 block">组合名称</Label>
                            <Input 
                              id={`b-composition-${compositionIndex}-name`}
                              value={composition.name}
                              onChange={(e) => updateSolutionName('bSolutionComposition', compositionIndex, e.target.value)}
                              placeholder="输入组合名称"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSolutionComposition('bSolutionComposition', compositionIndex)}
                            className="h-8 w-8 mt-6"
                          >
                            <Trash2Icon size={16} />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm">成分列表</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addIngredient('bSolutionComposition', compositionIndex)}
                              className="h-7 px-2 text-xs"
                            >
                              <PlusIcon size={14} className="mr-1" />
                              添加成分
                            </Button>
                          </div>
                          
                          {composition.ingredients.length === 0 ? (
                            <div className="text-xs text-muted-foreground pl-2 not-italic">暂无成分</div>
                          ) : (
                            <div className="space-y-2">
                              {/* 成分列表映射 - 使用原材料下拉选择器 */}
                              {composition.ingredients.map((ingredient, ingredientIndex) => (
                                <div key={ingredientIndex} className="grid grid-cols-12 gap-2 items-center">
                                  <div className="col-span-8">
                                    <SimpleSelectField 
                                      label=""
                                      placeholder="选择成分名称"
                                      value={ingredient.name}
                                      onChange={(value) => updateIngredient('bSolutionComposition', compositionIndex, ingredientIndex, 'name', value)}
                                      options={rawMaterialSelectList}
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Input 
                                      type="number"
                                      placeholder="百分比"
                                      min="0"
                                      max="100"
                                      value={ingredient.percentage}
                                      onChange={(e) => updateIngredient('bSolutionComposition', compositionIndex, ingredientIndex, 'percentage', e.target.value)}
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeIngredient('bSolutionComposition', compositionIndex, ingredientIndex)}
                                      className="h-6 w-6"
                                    >
                                      <XIcon size={14} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Special Record */}
                <div className="mt-6 space-y-2">
                  <Label className="text-base font-medium">Special Record</Label>
                  <Input
                    placeholder="请输入特殊记录"
                    value={formData.specialRecord || ""}
                    onChange={(e) => handleInputChange("specialRecord", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={onSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 