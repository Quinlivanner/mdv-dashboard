"use client"

import {Card, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Progress} from "../ui/progress"
import { useEffect, useState } from "react"

export function SectionCards() {
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        inProgress: 0,
        reviewing: 0,
        completed: 0,
        passRate: 0,
        progressDistribution: [
            {colorClass: 'bg-[#CACACB]', label: '进行中', percent: 0, count: 0},
            {colorClass: 'bg-[#FBBF23]', label: '验收阶段', percent: 0, count: 0},
            {colorClass: 'bg-[#07DA8B]', label: '已完成', percent: 0, count: 0},
        ]
    });

    // 从localStorage加载数据并计算统计
    useEffect(() => {
        const loadData = () => {
            try {
                // 从localStorage获取商机数据
                const opps = JSON.parse(localStorage.getItem('opportunities') || '[]');
                setOpportunities(opps);
                
                if (opps.length === 0) return;

                // 计算统计数据
                const total = opps.length;
                
                // 根据进度将商机分为三类: 进行中(0-40%), 验收阶段(41-80%), 已完成(81-100%)
                const inProgress = opps.filter((opp: any) => opp.progress <= 40).length;
                const reviewing = opps.filter((opp: any) => opp.progress > 40 && opp.progress <= 80).length;
                const completed = opps.filter((opp: any) => opp.progress > 80).length;
                
                // 计算通过率 (完成的项目 / 总项目)
                const passRate = Math.round((completed / total) * 100) || 0;
                
                // 计算各状态的百分比
                const inProgressPercent = Math.round((inProgress / total) * 100) || 0;
                const reviewingPercent = Math.round((reviewing / total) * 100) || 0;
                const completedPercent = Math.round((completed / total) * 100) || 0;

                // 更新状态
                setStats({
                    total,
                    inProgress,
                    reviewing,
                    completed,
                    passRate,
                    progressDistribution: [
                        {colorClass: 'bg-[#CACACB]', label: '进行中', percent: inProgressPercent, count: inProgress},
                        {colorClass: 'bg-[#FBBF23]', label: '验收阶段', percent: reviewingPercent, count: reviewing},
                        {colorClass: 'bg-[#07DA8B]', label: '已完成', percent: completedPercent, count: completed},
                    ]
                });
            } catch (error) {
                console.error("加载统计数据失败:", error);
            }
        };

        // 初始加载
        loadData();

        // 设置事件监听，当localStorage变化时重新计算
        const handleStorageChange = () => loadData();
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-6">
            <Card className="w-full">
                <CardHeader>
                    <CardDescription>待处理商机总数</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums mt-3">
                        {stats.total}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="text-muted-foreground">
                        进行中: {stats.inProgress} / 验收中: {stats.reviewing} / 已完成: {stats.completed}
                    </div>
                </CardFooter>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardDescription>报价通过率</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums mt-4">
                        {stats.passRate || 10}%
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <Progress value={stats.passRate || 10} className="w-full"/>
                </CardFooter>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardDescription>商机状态分布</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums">
                        <div className="flex flex-col gap-2 mt-4">
                            {stats.progressDistribution.map(({colorClass, label, percent, count}) => (
                                <div key={label} className="flex flex-row gap-2">
                                    <div className={`w-4 h-4 rounded-full ${colorClass}`}/>
                                    <span className="text-xs">{label} ({count})</span>
                                    <span className="text-xs ml-auto">{percent}%</span>
                                </div>
                            ))}
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}
