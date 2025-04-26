"use client"

import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FormImageUploaderProps {
  form: any;
  label: string;
  name: string;
  maxImages?: number;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  required?: boolean;
  disabled?: boolean;
}

export function FormImageUploader({
  form,
  label,
  name,
  maxImages = 5,
  acceptedFileTypes = "image/*",
  maxFileSize = 5,
  required,
  disabled
}: FormImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`文件大小不能超过 ${maxFileSize}MB`);
        setIsUploading(false);
        return;
      }

      // 在真实环境中，这里应该是上传到服务器并返回URL
      // 但由于我们使用本地存储，我们将文件转为Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const currentImages = form.getValues(name) || [];
        
        // Check max image count
        if (currentImages.length >= maxImages) {
          toast.error(`最多只能上传 ${maxImages} 张图片`);
          setIsUploading(false);
          return;
        }
        
        // Add new image URL to form
        const imageUrl = reader.result as string;
        form.setValue(name, [...currentImages, imageUrl]);
        
        setIsUploading(false);
        toast.success("图片已成功添加");
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("图片上传失败，请重试");
      };
    } catch (error) {
      setIsUploading(false);
      toast.error("图片上传失败，请重试");
    }
    
    // Clear input value to allow uploading the same file again
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues(name) || [];
    const newImages = currentImages.filter((_: unknown, i: number) => i !== index);
    form.setValue(name, newImages);
  };

  return (
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
            <div className="space-y-4">
              {/* Upload button */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`${name}-upload`)?.click()}
                  disabled={disabled || isUploading || (field.value?.length >= maxImages)}
                  className={cn(
                    "cursor-pointer",
                    isUploading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4 animate-pulse" />
                      上传中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      上传图片
                    </span>
                  )}
                </Button>
                <Input
                  id={`${name}-upload`}
                  type="file"
                  accept={acceptedFileTypes}
                  onChange={handleFileUpload}
                  disabled={disabled || isUploading || (field.value?.length >= maxImages)}
                  className="hidden"
                />
                <span className="text-xs text-muted-foreground">
                  {field.value?.length || 0}/{maxImages} 张，最大 {maxFileSize}MB
                </span>
              </div>

              {/* Image preview */}
              {field.value?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {field.value.map((imageUrl: string, index: number) => (
                    <div key={index} className="relative group">
                      <div className="overflow-hidden rounded-md border border-input h-24 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                        <img
                          src={imageUrl}
                          alt={`Uploaded image ${index + 1}`}
                          className="h-full w-full object-cover transition-all group-hover:scale-105"
                        />
                      </div>
                      {!disabled && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 absolute -top-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 