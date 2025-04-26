import {Button} from "@/components/ui/button"

// 分页控制组件
export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    isLoading: boolean
  }) {
    return (
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          上一页
        </Button>
        <div className="text-sm text-muted-foreground">
          第 {currentPage} 页，共 {totalPages} 页
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
        >
          下一页
        </Button>
      </div>
    )
  }
  