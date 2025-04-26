interface CookieOptions {
  path?: string;
  maxAge?: number;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// 设置cookie
export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const cookieOptions = {
    path: '/',
    ...options
  };

  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (cookieOptions.path) {
    cookie += `; path=${cookieOptions.path}`;
  }

  if (cookieOptions.maxAge) {
    cookie += `; max-age=${cookieOptions.maxAge}`;
  }

  if (cookieOptions.secure) {
    cookie += '; secure';
  }

  if (cookieOptions.sameSite) {
    cookie += `; samesite=${cookieOptions.sameSite}`;
  }

  document.cookie = cookie;
}

// 获取cookie
export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  
  return undefined;
}

// 删除cookie
export function deleteCookie(name: string, path = '/') {
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
} 