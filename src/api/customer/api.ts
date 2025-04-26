import request from "../request";
import {
  CustomerBaseInfo,
  CustomerEmployeeResponse,
  CustomerOperation,
  EmployeeOperation,
  PaginatedCustomerListResponse
} from "./types";
import {ResponseData} from "../types";


const STAFF_API = {
  CUSTOMER_LIST: "customer/list",
  CUSTOMER_CREATE: "customer/create",
  CUSTOMER_UPDATE: "customer/update/",
  CUSTOMER_DELETE: "customer/delete/",
  CUSTOMER_PAGINATION_LIST: "customer/list/pagination",
  CUSTOMER_EMPLOYEE_LIST: "customer/employee/list/",

  EMPLOYEE_CREATE: "customer/employee/create/",
  EMPLOYEE_UPDATE: "customer/employee/update/",
  EMPLOYEE_DELETE: "customer/employee/delete/",

}

// 获取选择器顾客列表
export const getCustomerListRequest = async (): Promise<ResponseData<CustomerBaseInfo[]>> => {
  const response = await request.get<ResponseData<CustomerBaseInfo[]>>(STAFF_API.CUSTOMER_LIST);
  return response.data;
};

// 创建客户
export const createCustomerRequest = async (data: any): Promise<ResponseData<CustomerOperation>> => {
  const response = await request.post<ResponseData<CustomerOperation>>(STAFF_API.CUSTOMER_CREATE, data);
  return response.data;
};

// 更新顾客信息
export const updateCustomerRequest = async (index: string, data: any): Promise<ResponseData<CustomerOperation>> => {
  const response = await request.post<ResponseData<CustomerOperation>>(STAFF_API.CUSTOMER_UPDATE + index, data);
  return response.data;
};

//删除顾客
export const deleteCustomerRequest = async (index: string): Promise<ResponseData<any>> => {
  const response = await request.delete<ResponseData<any>>(STAFF_API.CUSTOMER_DELETE + index);
  return response.data;
};


// 顾客页面获取顾客列表
export const getPaginatedCustomerListRequest = async (page: number, page_size: number, search: string): Promise<ResponseData<PaginatedCustomerListResponse>> => {
  const response = await request.get<ResponseData<PaginatedCustomerListResponse>>(STAFF_API.CUSTOMER_PAGINATION_LIST, {
    params: {
      page,
      page_size,
      search: search,
    },
  });
  return response.data;
};

// 获取顾客员工列表
export const getPaginatedCustomerEmployeeListRequest = async (index: string, page: number, page_size: number, search: string): Promise<ResponseData<CustomerEmployeeResponse>> => {
  const response = await request.get<ResponseData<CustomerEmployeeResponse>>(STAFF_API.CUSTOMER_EMPLOYEE_LIST + index, {
    params: {
      page,
      page_size,
      search: search,
    },
  });
  return response.data;
};


// 创建员工
export const createEmployeeRequest = async (index: string, data: any): Promise<ResponseData<EmployeeOperation>> => {
  const response = await request.post<ResponseData<EmployeeOperation>>(STAFF_API.EMPLOYEE_CREATE + index, data);
  return response.data;
};

// 更新员工
export const updateEmployeeRequest = async (index: string, data: any): Promise<ResponseData<EmployeeOperation>> => {
  const response = await request.post<ResponseData<EmployeeOperation>>(STAFF_API.EMPLOYEE_UPDATE + index, data);
  return response.data;
};

// 删除员工
export const deleteEmployeeRequest = async (index: string): Promise<ResponseData<any>> => {
  const response = await request.delete<ResponseData<any>>(STAFF_API.EMPLOYEE_DELETE + index);
  return response.data;
};

