import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@/components/ui/button";
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Calendar} from "@/components/ui/calendar"
import {CalendarIcon} from "@radix-ui/react-icons"
import {Textarea} from "@/components/ui/textarea";

export function FormSearchFiled(
    {
        label,
        form,
        name,
        isLoading,
        handleSearch,
        filteredItems,
        required,
        disabled
    }:
    {
        label: string,
        form: any,
        name: string,
        isLoading: boolean,
        handleSearch:
            (e: React.ChangeEvent<HTMLInputElement>) => void,
        filteredItems: any[],
        required?: boolean,
        disabled?: boolean
    }) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem className="w-full">
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <Select
                        disabled={disabled || isLoading}
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        <FormControl>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={"请选择" + label}/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <div className="px-2 py-2" onKeyDown={(e) => e.stopPropagation()}>
                                <Input
                                    placeholder={"搜索" + label + "..."}
                                    className="h-8"
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleSearch(e);
                                    }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onKeyDown={(e) => {
                                        e.stopPropagation();
                                        if (e.key === 'Tab') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <SelectSeparator/>
                            {filteredItems.map((item) => (
                                <SelectItem
                                    key={item.id}
                                    value={item.id.toString()}
                                >
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage/>
                </FormItem>
            )}
        />)
}

export function FromInputField(
    {
        title,
        placeholder,
        form,
        name,
        required,
        disabled
    }: {
        title: string,
        placeholder: string,
        form: any,
        name: string,
        required?: boolean,
        disabled?: boolean
    }
) {

    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>
                        {title}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Input 
                            placeholder={placeholder} 
                            {...field} 
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}

export function FormDatePickFiled(
    {
        label,
        form,
        name,
        required,
        disabled
    }: {
        label: string,
        form: any,
        name: string,
        required?: boolean,
        disabled?: boolean
    }
) {

    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem className="flex flex-col">
                    <FormLabel>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    disabled={disabled}
                                >
                                    {field.value ? (
                                        format(new Date(field.value), "yyyy-MM-dd")
                                    ) : (
                                        <span>请选择日期</span>
                                    )}
                                    <div className="ml-auto flex items-center gap-2">
                                        {field.value && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    field.onChange("")
                                                }}
                                                className="rounded-full p-1 opacity-50 hover:opacity-100"
                                                disabled={disabled}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                     className="h-4 w-4">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                                <span className="sr-only">清除日期</span>
                                            </button>
                                        )}
                                        <CalendarIcon className="h-4 w-4 opacity-50"/>
                                    </div>
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date: Date | undefined) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                initialFocus
                                disabled={disabled}
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}

export function FormNormalField(
  {
    form,
    label,
    name,
    isLoading,
    items,
    required,
    disabled
  }:{
    form:any,
    label:string,
    name:string,
    isLoading:boolean,
    items:any[],
    required?: boolean,
    disabled?: boolean
  }
){


  return(
    <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full">
        <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        <Select 
          disabled={disabled || isLoading}
          value={field.value} 
          onValueChange={field.onChange}
        >
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={"请选择" + label} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {items.map((item) => (
              <SelectItem 
                key={item.id} 
                value={item.id.toString()}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
  )
}

export function FormTextAreaField(
  {
    form,
    label,
    name,
    required,
    disabled
  }:{
    form:any,
    label:string,
    name:string,
    required?: boolean,
    disabled?: boolean
  }
){
  return(
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea 
              placeholder={`请输入${label}...`} 
              className="resize-none min-h-[80px]" 
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
