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
import {UserGenderMap} from '@/api/enum'
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

// function PaginationControls({
//   currentPage,
//   totalPages,
//   onPageChange,
//   isLoading,
// }: {
//   currentPage: number
//   totalPages: number
//   onPageChange: (page: number) => void
//   isLoading: boolean
// }) {
//   return (
//     <div className="flex items-center justify-end space-x-2 py-4">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage <= 1 || isLoading}
//       >
//         上一页
//       </Button>
//       <div className="text-sm text-muted-foreground">
//         第 {currentPage} 页，共 {totalPages} 页
//       </div>
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage >= totalPages || isLoading}
//       >
//         下一页
//       </Button>
//     </div>
//   )
// }

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

interface StaffTableProps {
    staffs: any[] // 使用any类型以匹配StaffManagementList中的类型
    isLoading: boolean
    onEdit: (staff: any) => void
    onDelete: (staff: any) => void
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function StaffsTable({
                                   staffs,
                                   isLoading,
                                   onEdit,
                                   onDelete,
                                   currentPage,
                                   totalPages,
                                   onPageChange,
                               }: StaffTableProps) {
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
                                    <TableHead>电话</TableHead>
                                    <TableHead>邮箱</TableHead>
                                    <TableHead>国家</TableHead>
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
                            <TableHead className="w-[13%]">序列</TableHead>
                            <TableHead className="w-[12%]">名称</TableHead>
                            {!isMobile && (
                                <>
                                    <TableHead className="w-[10%]">性别</TableHead>
                                    <TableHead className="w-[15%]">电话</TableHead>
                                    <TableHead className="w-[10%]">部门</TableHead>
                                    <TableHead className="w-[10%]">职位</TableHead>
                                    <TableHead className="w-[15%]">入职日期</TableHead>
                                    <TableHead className="w-[15%]">备注</TableHead>
                                </>
                            )}
                            <TableHead className="w-[10%] text-center">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staffs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isMobile ? 3 : 6}
                                           className="text-center py-8 text-muted-foreground">
                                    暂无员工数据
                                </TableCell>
                            </TableRow>
                        ) : (
                            staffs.map((staff) => (
                                <TableRow key={staff.index}>
                                    <TableCell className="font-mono text-xs">
                                        <div className="flex items-center gap-1">
                                            <span>{truncateString(staff.index, 10)}</span>
                                            <CopyButton text={staff.index}/>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {staff.name}
                                    </TableCell>
                                    {!isMobile && (
                                        <>
                                            <TableCell>
                                                <ConditionalTooltip text={UserGenderMap[staff.gender as keyof typeof UserGenderMap]} maxLength={11}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={staff.phone} maxLength={11}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={staff.department?.name} maxLength={10}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={staff.position?.name} maxLength={10}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={staff.join_date} maxLength={10}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={staff.remark} maxLength={10}/>
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell className="text-right">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(staff)}
                                            >
                                                <Edit className="h-4 w-4"/>
                                                <span className="sr-only">编辑</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                onClick={() => onDelete(staff)}
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
                {/* 分割线 */}
                <div className="h-[1px] bg-border my-4"/>
                {(staffs.length > 0 || totalPages > 1) && (
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