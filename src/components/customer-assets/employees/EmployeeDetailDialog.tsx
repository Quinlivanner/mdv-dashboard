"use client"

import {CustomerEmployee} from '@/api/customer/types'
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {useIsMobile} from '@/hooks/use-mobile'
import {cn} from '@/lib/utils'
import {Check, Copy, Files} from 'lucide-react'
import {toast} from 'sonner'
import {useState} from 'react'

interface EmployeeDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: CustomerEmployee
}

export function EmployeeDetailDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeDetailDialogProps) {
  const isMobile = useIsMobile();
  const [copyAllStatus, setCopyAllStatus] = useState(false);

  if (!employee) {
    return null;
  }

  const InfoItem = ({ label, value }: { label: string; value: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (text: string, label: string) => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(`${label}已复制到剪贴板`);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      } catch (err) {
        toast.error('复制失败，请重试');
      }
    };

    return (
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-sm font-medium flex-1">{value || '暂无数据'}</p>
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 transition-all duration-200"
              onClick={() => handleCopy(value, label)}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500 animate-in zoom-in duration-200" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">复制{label}</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  const handleCopyAll = async () => {
    const formatValue = (value: string | undefined) => value || 'N/A';
    const content = `${formatValue(employee.name)} \n电话：${formatValue(employee.phone)} \n邮箱：${formatValue(employee.email)}`;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopyAllStatus(true);
      toast.success('已复制所有信息到剪贴板');
      setTimeout(() => {
        setCopyAllStatus(false);
      }, 1000);
    } catch (err) {
      toast.error('复制失败，请重试');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-xl">员工详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">员工姓名</p>
            <p className="text-lg font-semibold mt-1">{employee.name || '暂无数据'}</p>
          </div>
          
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
            <InfoItem label="联系电话" value={employee.phone} />
            <InfoItem label="邮箱地址" value={employee.email} />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">备注信息</p>
            <p className="text-sm font-medium mt-1.5 whitespace-pre-wrap break-words">
              {employee.remark || '暂无备注'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button 
            className="w-full"
            onClick={handleCopyAll}
          >
            {copyAllStatus ? (
              <Check className="mr-2 h-4 w-4 text-green-500 animate-in zoom-in duration-200" />
            ) : (
              <Files className="mr-2 h-4 w-4" />
            )}
            复制所有信息
          </Button>

          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="w-full"
            >
              关闭
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
} 