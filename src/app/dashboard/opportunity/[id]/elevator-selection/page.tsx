'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SelectionContainer } from '@/components/elevator-selection';
import { hasElevatorSelection } from '@/lib/elevator-selection';
import { OpportunityData } from '@/components/dashboard/opportunity-card';
import { ArrowLeft } from 'lucide-react';

// 从localStorage获取商机数据
const getOpportunityDataFromStorage = (id: string): OpportunityData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem('opportunities');
    if (!data) return null;
    
    const opportunities = JSON.parse(data);
    return opportunities.find((opp: OpportunityData) => opp.id === id) || null;
  } catch (error) {
    console.error('Error getting opportunity data from localStorage:', error);
    return null;
  }
};

// 加载状态组件
function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg">加载中...</div>
    </div>
  );
}

// 错误状态组件
function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-lg mb-4">无法加载商机数据</div>
      <Button onClick={onBack}>返回</Button>
    </div>
  );
}

// 电梯选型页面组件
export default function ElevatorSelectionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [opportunityData, setOpportunityData] = useState<OpportunityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取商机数据
    if (id) {
      setLoading(true);
      const data = getOpportunityDataFromStorage(id);
      setOpportunityData(data);
      setLoading(false);
    }
  }, [id]);

  const handleSave = () => {
    // 保存成功后返回商机详情页
    router.push(`/dashboard/opportunity/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!opportunityData) {
    return <ErrorState onBack={handleBack} />;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">电梯选型 - {opportunityData.projectName}</h1>
      </div>

      <SelectionContainer 
        opportunityData={opportunityData} 
        onSave={handleSave} 
      />
    </div>
  );
}