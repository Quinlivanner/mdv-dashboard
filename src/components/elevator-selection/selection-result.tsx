import React from 'react';
import { CalculatedResult } from '@/lib/elevator-selection';
import { Button } from "@/components/ui/button";

interface SelectionResultProps {
  result: CalculatedResult | null;
}

export function SelectionResult({ result }: SelectionResultProps) {
  if (!result) {
    return (
      <div className="border border-gray-200 rounded-md p-4 text-center text-gray-500">
        等待计算结果...
      </div>
    );
  }

  // 保存到数据库
  const handleSaveToDatabase = () => {
    // 这里需要实现保存到数据库的逻辑
    console.log("保存到数据库");
  };

  return (
    <div className="space-y-4">
      {/* 计算结果标题栏 */}
      <div className="flex items-center justify-between bg-green-500 text-white p-2 px-4 rounded-t-md">
        <h2 className="text-lg font-semibold">结果计算</h2>
      </div>

      {/* 计算结果内容 */}
      <div className="grid grid-cols-6 gap-4 p-4 bg-green-50 rounded-b-md">
        <div className="col-span-1 text-center">
          <div className="font-semibold mb-1">Capacity Q(kg)</div>
          <div className="text-lg font-bold">{result.capacity || "N/A"}</div>
        </div>
        
        <div className="col-span-1 text-center">
          <div className="font-semibold mb-1">Persons</div>
          <div className="text-lg font-bold">{result.persons || "N/A"}</div>
        </div>
        
        <div className="col-span-1 text-center">
          <div className="font-semibold mb-1">Shaft Width SW(mm)</div>
          <div className="text-lg font-bold">{result.shaftWidth || "N/A"}</div>
        </div>
        
        <div className="col-span-1 text-center">
          <div className="font-semibold mb-1">Shaft Depth SD(mm)</div>
          <div className="text-lg font-bold">{result.shaftDepth || "N/A"}</div>
        </div>
        
        <div className="col-span-1 text-center">
          <div className="font-semibold mb-1">Overhead K(mm)</div>
          <div className="text-lg font-bold">{result.overheadHeight || "N/A"}</div>
        </div>
        
        <div className="col-span-1 text-center">
          <div className="font-semibold mb-1">Pit Depth S(mm)</div>
          <div className="text-lg font-bold">{result.pitDepth || "N/A"}</div>
        </div>
      </div>
      
      {/* 注释 */}
      <div className="text-xs text-gray-500">
        <p>备注：</p>
        <p>以上结果仅供参考，具体以项目实际为准;如有问题咨询菱王售前</p>
      </div>
    </div>
  );
} 