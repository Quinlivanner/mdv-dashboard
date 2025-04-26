import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: string[];
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
}

export function SimpleSelectField({
  label,
  value,
  onChange,
  options,
  isLoading = false,
  className,
  placeholder,
}: SimpleSelectProps) {
  const [items, setItems] = useState<string[]>(options);
  const [open, setOpen] = useState(false);

  /* 外部数据更新时，同步内部列表 */
  useEffect(() => {
    setItems(options);
  }, [options]);

  // 获取当前显示的文本
  const displayText = value ? value : placeholder || `请选择${label}`;

  return (
    <div className={cn("w-full", className)}>
      <div className="text-sm font-medium mb-2">{label}</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={isLoading}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {displayText}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
          <Command filter={(value, search) => {
            if (value.toLowerCase().includes(search.toLowerCase())) return 1
            return 0
          }}>
            <CommandInput
              placeholder={`搜索${label}...`}
              className="h-9"
              autoFocus={true}
            />
            <CommandList>
              <CommandEmpty>无结果</CommandEmpty>
              {items.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  className="py-2"
                  onSelect={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
} 