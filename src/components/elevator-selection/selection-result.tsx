import React from 'react';
import { CalculatedResult } from '@/lib/elevator-selection';
import { Button } from "@/components/ui/button";
import { Calculator, Download } from "lucide-react";

interface SelectionResultProps {
  result: CalculatedResult | null;
}

export function SelectionResult({ result }: SelectionResultProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Calculator className="h-12 w-12 text-gray-300" />
          <p className="text-gray-500 text-sm">等待计算结果...</p>
        </div>
      </div>
    );
  }

  // 保存到数据库
  const handleSaveToDatabase = () => {
    // 这里需要实现保存到数据库的逻辑
    console.log("保存到数据库");
  };

  return (
    <div className="space-y-6">
      {/* 计算结果卡片 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* 标题栏 */}
        <div className="bg-gradient-to-r from-[#00B4AA] to-[#0092D8] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">计算结果</h2>
              <p className="mt-1 text-white/80 text-sm">根据您的选型参数计算得出以下结果</p>
            </div>
            <Button 
              onClick={handleSaveToDatabase}
              className="bg-white text-[#00B4AA] hover:bg-gray-50 flex items-center gap-2"
              size="sm"
            >
              <Download className="h-4 w-4" />
              导出结果
            </Button>
          </div>
        </div>

        {/* 结果内容 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Capacity */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">载重</span>
                <span className="text-xs text-[#00B4AA]">Q(kg)</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{result.capacity || "N/A"}</div>
            </div>
            
            {/* Persons */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">载客数</span>
                <span className="text-xs text-[#00B4AA]">人</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{result.persons || "N/A"}</div>
            </div>
            
            {/* Shaft Width */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">井道宽度</span>
                <span className="text-xs text-[#00B4AA]">SW(mm)</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{result.shaftWidth || "N/A"}</div>
            </div>
            
            {/* Shaft Depth */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">井道深度</span>
                <span className="text-xs text-[#00B4AA]">SD(mm)</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{result.shaftDepth || "N/A"}</div>
            </div>
            
            {/* Overhead */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">顶层高度</span>
                <span className="text-xs text-[#00B4AA]">K(mm)</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{result.overheadHeight || "N/A"}</div>
            </div>
            
            {/* Pit Depth */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">底坑深度</span>
                <span className="text-xs text-[#00B4AA]">S(mm)</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{result.pitDepth || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 注释说明 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-amber-800 mb-2">注意事项</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 以上结果仅供参考，具体以项目实际情况为准</li>
          <li>• 如有疑问，请及时与美的电梯售前工程师联系</li>
        </ul>
      </div>
    </div>
  );
} 