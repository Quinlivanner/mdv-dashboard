"use client"

import {useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Check, Copy, Edit, Trash2} from 'lucide-react'
import {Skeleton} from '@/components/ui/skeleton'
import {useIsMobile} from '@/hooks/use-mobile'
import {toast} from 'sonner'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from '@/components/ui/tooltip'
import {useRouter} from 'next/navigation'
import {PaginationControls} from '@/components/share/pagination'
// 截断字符串的工具函数
const truncateString = (str: string, maxLength: number) => {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

// 条件性Tooltip组件
const ConditionalTooltip = ({text, maxLength}: { text: string, maxLength: number }) => {
    if (!text) return '-';

    // 只有当文本超过最大长度时才显示Tooltip
    if (text.length <= maxLength) {
        return <span>{text}</span>;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
        <span className="cursor-default">
          {truncateString(text, maxLength)}
        </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px] break-words">
                {text}
            </TooltipContent>
        </Tooltip>
    );
};

// 复制到剪贴板的功能组件
function CopyButton({text}: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("已复制到剪贴板");

            // 2秒后重置复制状态
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            toast.error("复制失败，请手动复制");
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
        >
            {copied ? (
                <Check className="h-3 w-3"/>
            ) : (
                <Copy className="h-3 w-3"/>
            )}
            <span className="sr-only">复制序列</span>
        </Button>
    );
}

interface RawMaterialTableProps {
    raw_materials: any[]
    isLoading: boolean
    onEdit: (raw_material: any) => void
    onDelete: (raw_material: any) => void
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function RawMaterialsTable({
                                   raw_materials,
                                   isLoading,
                                   onEdit,
                                   onDelete,
                                   currentPage,
                                   totalPages,
                                   onPageChange,
                               }: RawMaterialTableProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    if (isLoading) {
        return (
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>序列</TableHead>
                            <TableHead>名称</TableHead>
                            {!isMobile && (
                                <>
                                    <TableHead>供应商</TableHead>
                                    <TableHead>材料学名</TableHead>
                                    <TableHead>内部编号</TableHead>
                                    <TableHead>单位</TableHead>
                                    <TableHead>分子式</TableHead>
                                    <TableHead>备注</TableHead>
                                </>
                            )}
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array(5).fill(0).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                {!isMobile && (
                                    <>
                                        <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32"/></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                    </>
                                )}
                                <TableCell><Skeleton className="h-4 w-16 ml-auto"/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    return (
        <TooltipProvider>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[12.5%]">序列</TableHead>
                            <TableHead className="w-[12.5%]">名称</TableHead>
                            {!isMobile && (
                                <>
                                    <TableHead className="w-[12.5%]">供应商</TableHead>
                                    <TableHead className="w-[12.5%]">材料学名</TableHead>
                                    <TableHead className="w-[12.5%]">内部编号</TableHead>
                                    <TableHead className="w-[12.5%]">单位</TableHead>
                                    <TableHead className="w-[12.5%]">分子式</TableHead>
                                    <TableHead className="w-[12.5%]">描述</TableHead>
                                </>
                            )}
                            <TableHead className="w-[10%] text-center">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {raw_materials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isMobile ? 3 : 6}
                                           className="text-center py-8 text-muted-foreground">
                                    暂无原材料数据
                                </TableCell>
                            </TableRow>
                        ) : (
                            raw_materials.map((raw_material) => (
                                <TableRow key={raw_material.index}>
                                    <TableCell className="font-mono text-xs">
                                        <div className="flex items-center gap-1">
                                            <span>{truncateString(raw_material.index, 10)}</span>
                                            <CopyButton text={raw_material.index}/>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {raw_material.name}
                                    </TableCell>
                                    {!isMobile && (
                                        <>
                                            <TableCell>
                                                <ConditionalTooltip text={raw_material.supplier?.name || '-'} maxLength={11}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={raw_material.scientific_name || '-'} maxLength={15}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={raw_material.internal_number || '-'} maxLength={10}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={raw_material.unit || '-'} maxLength={10}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={raw_material.molecular_formula || '-'} maxLength={10}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={raw_material.description || '-'} maxLength={10}/>
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell className="text-right">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(raw_material)}
                                            >
                                                <Edit className="h-4 w-4"/>
                                                <span className="sr-only">编辑</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                onClick={() => onDelete(raw_material)}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                                <span className="sr-only">删除</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {(raw_materials.length > 0 || totalPages > 1) && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </TooltipProvider>
    )
} 