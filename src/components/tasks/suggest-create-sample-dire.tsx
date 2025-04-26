import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {Loader2} from "lucide-react"

interface SuggestCreateSampleDireProps {
    open: boolean
    sampleDirectionName: string
    onConfirm: () => void
    isCreating: boolean
    onOpenChange: (open: boolean) => void
  }


  export function SuggestCreateSampleDire(
    {
        open,
        onOpenChange,
        sampleDirectionName,
        onConfirm,
        isCreating,
    }: SuggestCreateSampleDireProps
  ) {
    
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>没有合适的应用方向</AlertDialogTitle>
            <AlertDialogDescription>
              我的建议是创建新的应用方向：<span className="font-bold">{sampleDirectionName}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="">取消</AlertDialogCancel>
            <AlertDialogAction className="" onClick={onConfirm} disabled={isCreating}>
                {
                    isCreating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "创建"
                    )
                }
                </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  