import {useEffect, useState} from 'react';

/**
 * 自定义 React Hook，用于实现值的防抖。
 * @param value 需要防抖的值。
 * @param delay 防抖延迟时间（毫秒）。
 * @returns 返回经过防抖处理的值。
 */
export function useDebounce<T>(value: T, delay: number): T {
  // 存储防抖后的值
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置一个定时器，在指定的延迟后更新防抖后的值
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：在 effect 下次运行或组件卸载时清除定时器
    // 这确保了只有在 value 停止变化指定时间后，debouncedValue 才会更新
    return () => {
      clearTimeout(handler);
    };
  }, [
    value, // 仅在 value 或 delay 变化时重新运行 effect
    delay
  ]);

  return debouncedValue;
} 