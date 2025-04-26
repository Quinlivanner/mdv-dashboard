import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";

interface Props<T extends { id: number | string; name: string }> {
  label: string;
  form: any;          // react-hook-form 实例
  name: string;       // 表单字段名
  isLoading: boolean;
  filteredItems: T[]; // 待筛选列表
  required?: boolean; // 是否必填
  disabled?: boolean; // 是否禁用
}

export function FormSearchSelectField<T extends { id: number | string; name: string }>({
  label,
  form,
  name,
  isLoading,
  filteredItems,
  required,
  disabled
}: Props<T>) {
  const [items, setItems] = useState<T[]>(filteredItems);
  const [open, setOpen] = useState(false);

  /* 外部数据更新时，同步内部列表 */
  useEffect(() => {
    setItems(filteredItems);
  }, [filteredItems]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={isLoading || disabled}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? items.find((item) => item.id.toString() === field.value)?.name || `请选择${label}`
                    : `请选择${label}`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent 
              className="p-0 w-[var(--radix-popover-trigger-width)]">              
              <Command filter={(value, search) => {
                if (value.toLowerCase().includes(search.toLowerCase())) return 1
                return 0
              }}>
                <CommandInput 
                  placeholder={`搜索${label}...`} 
                  className="h-9" 
                  autoFocus={true}
                  disabled={disabled}
                />
                <CommandList>
                  <CommandEmpty>无结果</CommandEmpty>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      className="py-2"
                      onSelect={() => {
                        const newValue = item.id.toString();
                        field.onChange(newValue);
                        setOpen(false);
                      }}
                      disabled={disabled}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === item.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 