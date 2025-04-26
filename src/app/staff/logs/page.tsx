"use client"

import {useCallback, useEffect, useRef, useState} from "react";
import {getStaffLogRequest} from "@/api/staff/api";
import {StaffLog} from "@/api/staff/types";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useIsMobile} from "@/hooks/use-mobile";
import {Loader2, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {debounce} from "lodash";
import {Card, CardContent} from "@/components/ui/card";

interface StaffLogResponse {
  operation_logs: StaffLog[];
  total: number;
  page: number;
  total_pages: number;
  page_size: number;
}

export default function Page() {
  const [logs, setLogs] = useState<StaffLog[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastLogElementRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const shouldFetchRef = useRef(true);
  const isInitialMount = useRef(true); // 用于跟踪首次挂载

  const fetchLogs = useCallback(async () => {
    // 如果正在加载，则不执行
    if (loading) return; 
    
    // 每次请求前，确认是否应该继续
    // 如果页码大于总页数（通常不应发生，除非 totalPages 更新滞后），则停止
    if (page > totalPages && totalPages > 0) {
      setHasMore(false);
      shouldFetchRef.current = false;
      return;
    }

    console.log(`Fetching logs - Page: ${page}, PageSize: ${pageSize}, Search: '${search}', HasMore: ${hasMore}, ShouldFetch: ${shouldFetchRef.current}`);

    setLoading(true);
    try {
      // 使用当前的 page 和 search 状态
      const currentPage = page;
      const currentSearch = search;
      const response = await getStaffLogRequest(currentPage, pageSize, currentSearch);
      const data = response.data as unknown as StaffLogResponse;
      
      setTotalPages(data.total_pages);
      const moreAvailable = currentPage < data.total_pages;
      setHasMore(moreAvailable);
      shouldFetchRef.current = moreAvailable;

      if (currentPage === 1) {
        setLogs(data.operation_logs);
      } else {
        // 只有当确实有新数据时才追加
        if (data.operation_logs.length > 0) {
          setLogs(prevLogs => [...prevLogs, ...data.operation_logs]);
        } else {
          // 如果返回空数组，说明没有更多了
          setHasMore(false);
          shouldFetchRef.current = false;
        }
      }
      // 标记初始加载完成
      if (!initialLoadComplete) setInitialLoadComplete(true);

    } catch (error) {
      console.error('Error fetching logs:', error);
      setHasMore(false);
      shouldFetchRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, totalPages, initialLoadComplete]); // 包含所有只读依赖

  // 防抖处理搜索
  const handleSearch = debounce((value: string) => {
    setSearch(value);
    // 注意：状态重置移到 useEffect [search] 中处理，以确保 search state 更新后执行
  }, 500);

  // 初始加载
  useEffect(() => {
    console.log("Initial load effect");
    setPage(1);
    setLogs([]);
    setHasMore(true);
    shouldFetchRef.current = true;
    fetchLogs();
    return () => {
      console.log("Cleanup initial load");
      shouldFetchRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 故意留空，只执行一次

  // 搜索词变化时处理
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log("Skipping search effect on initial mount");
      return;
    }
    console.log(`Search changed: '${search}', resetting and fetching page 1`);
    setPage(1); // 重置到第一页
    setLogs([]); // 清空现有日志
    setHasMore(true); // 假设有更多数据
    shouldFetchRef.current = true; // 允许请求
    fetchLogs(); // 获取新搜索结果的第一页
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]); // 依赖于搜索词

  // 加载更多页（滚动到底部时触发）
  useEffect(() => {
    // 只有在 page > 1 且需要加载更多时才执行
    // 避免在搜索词变化导致 page 重置为 1 时错误触发
    if (page > 1 && hasMore && shouldFetchRef.current && !loading) {
      console.log(`Page changed to ${page}, fetching more logs`);
      fetchLogs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasMore]); // 依赖页码和是否有更多

  // 设置观察者，用于无限滚动
  useEffect(() => {
    if (loading || !hasMore || !shouldFetchRef.current) {
      if (observer.current) observer.current.disconnect();
      return;
    }

    if (observer.current) observer.current.disconnect();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !loading && hasMore && shouldFetchRef.current) {
        console.log("Intersection observer triggered, incrementing page");
        setPage(prevPage => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(observerCallback, { 
      threshold: 0.1,
      rootMargin: '0px 0px 200px 0px'
    });

    if (lastLogElementRef.current) {
      observer.current.observe(lastLogElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, logs.length]); // 依赖这些状态来重新设置观察者

  // 根据操作类型返回对应的徽章样式
  const getOperationBadgeStyle = (operationType: string) => {
    switch (operationType) {
      case '删除':
        return 'bg-red-100/50 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800/30';
      case '创建':
        return 'bg-green-100/50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30';
      case '修改':
        return 'bg-blue-100/50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/30';
      case '查询':
        return 'bg-purple-100/50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800/30';
      case '登录':
        return 'bg-gray-100/50 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400 border-gray-200 dark:border-gray-700/30';
      case '登出':
        return 'bg-gray-100/50 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400 border-gray-200 dark:border-gray-700/30';
      default:
        return 'bg-gray-100/50 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400 border-gray-200 dark:border-gray-700/30';
    }
  };

  return (
    <div className="min-h-screen">
      {/* 优化搜索框 - 移除卡片背景 */}
      <div className="mb-8">
        {/* 添加 mx-auto 使其居中 */}
        <div className="relative w-full max-w-lg mx-auto">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-primary/10">
            <Search className="h-3.5 w-3.5 text-primary" />
          </div>
          <Input
            placeholder="搜索操作日志..."
            className="pl-10 h-11 pr-4 border-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary/30 shadow-sm"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {logs.length === 0 && !loading && initialLoadComplete ? (
          <Card className="border-dashed bg-background/50">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                {search ? `未找到与 "${search}" 相关的日志` : "暂无操作日志"}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="timeline space-y-4">
              {logs.map((log, index) => (
                <Card 
                  key={index} 
                  ref={index === logs.length - 1 ? lastLogElementRef : null}
                  className="border shadow-sm hover:shadow-md transition-all duration-200 bg-card/50 overflow-hidden"
                >
                  <CardContent className="p-4 relative">
                    {/* 时间线垂直线 */}
                    {index !== logs.length - 1 && (
                      <div className="absolute left-6 top-[42px] bottom-0 w-[2px] bg-border/50"></div>
                    )}
                    
                    <div className="flex">
                      {/* 时间线节点 */}
                      <div className="mr-4 relative">
                        <div className="h-7 w-7 rounded-full border-2 border-primary bg-background flex items-center justify-center z-10 relative">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                      </div>
                      
                      {/* 内容区域 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2.5">
                          <Badge variant="outline" className={cn("font-medium text-xs px-3 py-1 rounded-full", getOperationBadgeStyle(log.operation_type))}>
                            {log.operation_type}
                          </Badge>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {log.operation_time}
                          </span>
                        </div>
                        
                        <div className="mb-2.5 text-sm">
                          <span className="font-medium">{log.staff}</span> 操作了 <span className="font-medium">{log.resource}</span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md break-words">
                          {log.operation_description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {loading && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
