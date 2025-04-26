import { Button } from "../ui/button";
import ShowToolTip from "./tooltip/tooltip";

interface ToolTipButtonProps {
    content: string;
    onClick: () => void;
    icon: React.ReactNode;
}

export default function ToolTipButton(props: ToolTipButtonProps) {
    return (
        <ShowToolTip
        children={
            <Button
            variant="outline"
            size="icon"
            onClick={() => {
                props.onClick();
            }}
        >
            {props.icon}
        </Button>
        }
        content={props.content}
        />

    )
}