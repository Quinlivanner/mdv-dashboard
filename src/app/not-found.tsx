"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <div className="text-6xl">😢</div>
      <h1 className="text-3xl font-bold">页面未找到</h1>
      <p className="text-muted-foreground text-center max-w-md">
        您访问的页面不存在或已被移除，请检查路径是否正确
      </p>
      <Button asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>
      </Button>
    </div>
  );
} 