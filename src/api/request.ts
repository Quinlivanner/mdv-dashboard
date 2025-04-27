import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // baseURL
    // baseURL: 'https://cerasol-api.mountex.online', // baseURL
    timeout: 90000, // 超时时间
  });
  
  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 排除 login 接口
      if (config.url?.includes('/login')) {
        return config;
      }
  
      // 从 localStorage 获取 token
      const token = localStorage.getItem('token');
      
      // 如果存在 token，添加到请求头
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  // 响应拦截器（可选，但建议添加）
instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // 处理 token 过期等错误
      if (error.response?.status === 401) {
        // token 过期，可以在这里处理登出逻辑
        localStorage.removeItem('token');
        // 可以在这里添加重定向到登录页的逻辑
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  export default instance;