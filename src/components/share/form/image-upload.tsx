import {useCallback, useState} from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Loader2, Plus, Trash2, Upload, X, ZoomIn} from "lucide-react";
import {uploadSampleImageRequest} from "@/api/rad/api";
import {cn} from "@/lib/utils";
import { toast } from "sonner";


// 组件属性接口定义
interface FormImageUploaderProps {
  name: string;                            // 表单字段名
  label: string;                           // 显示标签
  acceptedFileTypes?: string;              // 接受的文件类型（可选）
  imageList: string[];                     // 图片列表
  maxImages?: number;                       // 最大图片数量
  onImagesChange?: (images: string[]) => void; // 当图片列表变化时的回调函数
  isEditing?: boolean;                      // 是否处于编辑状态
}

/**
 * 图片上传组件
 * 支持单张图片上传，可显示多张图片，提供预览和删除功能
 */
export function NormalImageUploader({

  name,
  label,
  acceptedFileTypes = "image/*",            // 默认接受所有图片类型
  imageList,    
  maxImages=10,
  onImagesChange,
  isEditing=false,
}: FormImageUploaderProps) {
  // 上传状态管理
  const [isUploading, setIsUploading] = useState(false);
  // 错误信息状态
  const [uploadError, setUploadError] = useState<string | null>(null);
  // 当前预览大图的URL
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // 拖放状态
  const [isDragging, setIsDragging] = useState(false);

  // 处理文件选择
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      setUploadError("请上传图片文件");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      
      // 调用上传API
      const response = await uploadSampleImageRequest(file);
      
      // 获取上传后的图片URL
      const url = response.data.url;

      // 更新表单中的图片列表
      if (onImagesChange) {
        onImagesChange([...imageList, url]);
      }else {
        toast.error("图片上传失败");
      }
      
    } catch (error) {
      console.error("上传图片失败:", error);
      setUploadError("上传图片失败，请重试");
    } finally {
      setIsUploading(false);
    }
  }, [imageList, onImagesChange, setIsUploading, setUploadError]);

  // 处理文件输入变化
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // 清空文件输入
    event.target.value = "";
  };

  // 处理拖放
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // 删除图片
  const handleDeleteImage = useCallback((imageUrl: string) => {
    // 直接从列表中移除图片URL
    if (onImagesChange) {
      onImagesChange(imageList.filter((url) => url !== imageUrl));
      toast.success("图片已移除");
    }
  }, [imageList, onImagesChange]);

  // 预览大图
  const handlePreviewImage = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  return (

            <div className="space-y-4">
              {/* 已上传图片预览区域 */}
              {imageList?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {imageList.map((image: string) => (
                    <div 
                      key={image} 
                      className="relative group rounded-md border overflow-hidden"
                    >
                      {/* 缩略图 */}
                      <div className="aspect-square relative">
                        <img
                          src={image}
                          alt={image}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* 操作按钮悬浮层 */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {/* 预览按钮 */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-8 w-8 bg-black/40 text-white hover:bg-red-500"
                                onClick={() => handlePreviewImage(image)}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-0">
                              <div className="relative">
                                <img
                                  src={image}
                                  alt={image}
                                  className="w-full h-auto object-contain max-h-[80vh]"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {/* 删除按钮 */}
                          {isEditing && (
                            <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8 bg-black/40 text-white hover:bg-red-500"
                            onClick={() => handleDeleteImage(image)}
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 添加更多图片按钮 - 仅在未达到最大数量时显示 */}
                  {imageList.length < maxImages && isEditing && (
                    <div 
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded-md border-2 border-dashed",
                        "hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer",
                        isUploading && "pointer-events-none opacity-50"
                      )}
                      onClick={() => document.getElementById(`file-upload-${name}`)?.click()}
                    >
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">添加图片</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* 拖放上传区域 - 始终显示，但状态会根据图片数量变化 */}
              {isEditing && (
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-md transition-all",
                  "flex flex-col items-center justify-center text-center p-6 sm:p-10",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
                  isUploading && "pointer-events-none opacity-50",
                  imageList?.length >= maxImages && "border-orange-300 bg-orange-50",
                  imageList?.length > 0 ? "py-4" : "py-8",
                  imageList?.length >= maxImages ? "" : "hover:bg-muted/50 hover:border-primary/30 cursor-pointer"
                )}
                onDragOver={imageList?.length >= maxImages ? undefined : handleDragOver}
                onDragLeave={imageList?.length >= maxImages ? undefined : handleDragLeave}
                onDrop={imageList?.length >= maxImages ? undefined : handleDrop}
                onClick={imageList?.length >= maxImages ? undefined : () => document.getElementById(`file-upload-${name}`)?.click()}
              >
                <input
                  id={`file-upload-${name}`}
                  type="file"
                  accept={acceptedFileTypes}
                  onChange={handleInputChange}
                  disabled={imageList?.length >= maxImages}
                  className="hidden"
                />
                
                {isUploading ? (
                  <>
                    <Loader2 className="h-10 w-10 mb-4 animate-spin text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">正在上传...</p>
                  </>
                ) : imageList?.length >= maxImages ? (
                  <>
                    <div className="mb-4 rounded-full bg-orange-100 p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-orange-500">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-orange-700">
                      已达到最大上传数量 ({maxImages} 张图片)
                    </p>
                    <p className="text-xs mt-2 text-orange-600">
                      请删除部分图片后继续上传
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 rounded-full bg-muted p-3">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">
                      {isDragging ? (
                        "释放鼠标上传图片"
                      ) : (
                        <>
                          <span className="text-primary font-semibold">点击上传</span> 或拖放图片至此区域
                        </>
                      )}
                    </p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      支持图片格式
                      {maxImages > 1 && `, 已上传 ${imageList?.length || 0}/${maxImages} 张`}
                    </p>
                  </>
                )}
                
                {uploadError && (
                  <div className="absolute -bottom-6 left-0 right-0 text-sm text-red-500 mt-2">
                    {uploadError}
                  </div>
                )}
              </div>
              )}
            </div>

  );
} 