import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";


export interface showToolTipProps {
    children: React.ReactNode;
    content: string;    
}


export default function ShowToolTip({children, content}: showToolTipProps) {

    return (
        <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    )
}