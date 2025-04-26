export interface resData {
    token: string
    user: User
  }
  
  export interface User {
    last_login: string
    name: string
    gender: number
    phone: string
    email: string
    remark: string
    department: any
    position: any
  }

  // 响应请求结构体
export interface LoginResponseData {
    code: number;
    message: string;
    data: resData;
}

// 登录请求结构体
export interface LoginData {
    account: string;
    password: string;
  }