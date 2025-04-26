import { XCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

interface FailedMarkDialogProps {
    index: string;
    isOpen: boolean;
    version: string;
    reason: string;
    onOpenChange: (open: boolean) => void;
    setReason: (reason: string) => void;
    onSubmit: () => void;
}

export default function FailedMarkDialog({isOpen, onOpenChange, version, reason, setReason, index, onSubmit}: FailedMarkDialogProps) {

    return (
<Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] ring-none">
        <DialogHeader>
          <DialogDescription>
            标记配方为不合格
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              配方版本：
            </Label>
            <Label id="name" className="col-span-3" >{version}</Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              配方编码：
            </Label>
            <Label id="name" className="col-span-3" >{index}</Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              不合格原因
            </Label>
            <Textarea id="username" value={reason} onChange={(e) => setReason(e.target.value)} className="col-span-3 max-h-[150px]" />
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button type="submit" disabled={!reason} onClick={onSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}