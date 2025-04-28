import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { SelectionForm } from './selection-form';
import { SelectionResult } from './selection-result';
import { 
  ElevatorSelectionData, 
  CalculatedResult,
  getElevatorSelection, 
  saveElevatorSelection, 
  getDefaultSelectionData 
} from '@/lib/elevator-selection';
import { OpportunityData } from '@/components/dashboard/opportunity-card';

interface SelectionContainerProps {
  opportunityData: OpportunityData;
  onSave: () => void;
}

export function SelectionContainer({ opportunityData, onSave }: SelectionContainerProps) {
  // 获取已保存的选型数据或使用默认数据
  const [selectionData, setSelectionData] = useState<ElevatorSelectionData>(
    getElevatorSelection(opportunityData.id) || 
    getDefaultSelectionData(opportunityData.id)
  );

  // 项目名称临时状态
  const [projectName, setProjectName] = useState(opportunityData?.projectName || '');

  // 计算结果
  const calculatedResult: CalculatedResult = {
    capacity: selectionData.capacity,
    persons: Math.floor(selectionData.capacity / 75),
    shaftWidth: selectionData.shaftWidth,
    shaftDepth: selectionData.shaftDepth,
    overheadHeight: selectionData.overhead,
    pitDepth: selectionData.pitDepth
  };

  // 更新选型数据
  const handleChange = (partialData: Partial<ElevatorSelectionData>) => {
    setSelectionData(prev => ({
      ...prev,
      ...partialData,
      lastUpdated: new Date().toISOString()
    }));
  };

  // 保存选型数据
  const handleSave = () => {
    // 设置提交标志和时间
    const dataToSave = {
      ...selectionData,
      isSubmitted: true,
      submittedAt: new Date().toISOString()
    };
    saveElevatorSelection(dataToSave);
    setSelectionData(dataToSave); // 更新本地状态
    onSave();
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto p-4">
      {/* 顶部标题 - 公司标志和标题 */}
      <div className="flex items-center justify-center mb-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-1">电梯土建尺寸规划</h1>
          <p className="text-md">Reassuring Planning Tool (RPT)</p>
        </div>
        <div className="w-32"></div> {/* 右侧占位 */}
      </div>

      {/* 项目信息展示 */}
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex items-center">
          <div className="w-28 font-semibold">项目名称:</div>
          <div>{opportunityData?.projectName || 'N/A'}</div>
        </div>
        <div className="flex items-center">
          <div className="w-28 font-semibold">项目编号:</div>
          <div>{opportunityData?.projectCode || 'N/A'}</div>
        </div>
        <div className="flex items-center">
          <div className="w-28 font-semibold">客户名称:</div>
          <div>{opportunityData?.customerName || 'N/A'}</div>
        </div>
      </div>

      {/* 选型表单 */}
      <SelectionForm data={selectionData} onChange={handleChange} />
      
      {/* 选型结果 */}
      <SelectionResult result={calculatedResult} />
    </div>
  );
} 