import request from "../request";
import {LoginData, LoginResponseData} from "./types";


// 登录接口
export const loginRequest = async (data: LoginData): Promise<LoginResponseData> => {
  const response = await request.post<LoginResponseData>("staff/login", data);
  // 登录成功时自动存储 token
  if (response.data.code === 0 && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

// 更改密码