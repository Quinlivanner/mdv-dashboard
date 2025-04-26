"use client"

import {useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Check, Copy, Edit, Landmark, Trash2} from 'lucide-react'
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

// // 分页控制组件
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

interface CustomerTableProps {
    customers: any[] // 使用any类型以匹配CustomerList中的类型
    isLoading: boolean
    onEdit: (customer: any) => void
    onDelete: (customer: any) => void
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function CustomerTable({
                                  customers,
                                  isLoading,
                                  onEdit,
                                  onDelete,
                                  currentPage,
                                  totalPages,
                                  onPageChange,
                              }: CustomerTableProps) {
    const isMobile = useIsMobile();
    const router = useRouter();

    if (isLoading) {
        return (
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[15%]">序列</TableHead>
                            <TableHead className="w-[20%]">名称</TableHead>
                            {!isMobile && (
                                <>
                                    <TableHead className="w-[15%]">电话</TableHead>
                                    <TableHead className="w-[20%]">地址</TableHead>
                                    <TableHead className="w-[10%]">备注</TableHead>
                                </>
                            )}
                            <TableHead className="w-[20%]">操作</TableHead>
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
                            <TableHead className="w-[15%]">序列</TableHead>
                            <TableHead className="w-[20%]">名称</TableHead>
                            {!isMobile && (
                                <>
                                    <TableHead className="w-[15%]">电话</TableHead>
                                    <TableHead className="w-[20%]">地址</TableHead>
                                    <TableHead className="w-[10%]">备注</TableHead>
                                </>
                            )}
                            <TableHead className="w-[20%] text-center">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isMobile ? 3 : 6}
                                           className="text-center py-8 text-muted-foreground">
                                    暂无客户数据
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.index}>
                                    <TableCell className="font-mono text-xs">
                                        <div className="flex items-center gap-1">
                                            <span>{truncateString(customer.index, 10)}</span>
                                            <CopyButton text={customer.index}/>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            !isMobile ? (
                                                    <ConditionalTooltip text={customer.name} maxLength={27}/>
                                                )
                                                : (<ConditionalTooltip text={customer.name} maxLength={7}/>
                                                )
                                        }
                                    </TableCell>
                                    {!isMobile && (
                                        <>
                                            <TableCell>
                                                <ConditionalTooltip text={customer.phone} maxLength={11}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={customer.address} maxLength={15}/>
                                            </TableCell>
                                            <TableCell>
                                                <ConditionalTooltip text={customer.remark} maxLength={10}/>
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell className="text-center">
                                        <div className="flex justify-evenly gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    router.push(`/dashboard/customers/${customer.index}`)
                                                }
                                            >
                                                <Landmark className="h-4 w-4"/>
                                                <span className="sr-only">资产</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(customer)}
                                            >
                                                <Edit className="h-4 w-4"/>
                                                <span className="sr-only">编辑</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                onClick={() => onDelete(customer)}
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

                {(customers.length > 0 || totalPages > 1) && (
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