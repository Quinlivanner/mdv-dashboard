import request from "../request";
import {
    Department,
    PaginationStaffListResponse,
    Position,
    StaffBaseInfo,
    StaffDetail,
    StaffLog,
    StaffOperation
} from "./types";
import {ResponseData} from "../types";


const STAFF_BASE_API = "staff"
const STAFF_API_URL = {
  staff_list: `${STAFF_BASE_API}/list`,
  staff_logs: `${STAFF_BASE_API}/logs`,
  staff_paginated_list: `${STAFF_BASE_API}/pagination-list`,
  staff_delete: `${STAFF_BASE_API}/delete`,
  staff_create: `${STAFF_BASE_API}/create`,
  staff_update: `${STAFF_BASE_API}/update/`,

  department_list: `${STAFF_BASE_API}/department/list`,
  position_list: `${STAFF_BASE_API}/position/list`,
}

// 获取员工列表
export const getStaffListRequest = async (type: string): Promise<ResponseData<StaffBaseInfo[]>> => {
  const response = await request.get<ResponseData<StaffBaseInfo[]>>(STAFF_API_URL.staff_list, {
    params: {
      type
    }
  });
  return response.data;
};

// 获取员工日志
export const getStaffLogRequest = async (page: number, page_size: number, search: string): Promise<ResponseData<StaffLog[]>> => {
  const response = await request.get<ResponseData<StaffLog[]>>(STAFF_API_URL.staff_logs, {
    params: {
      page,
      page_size,
      search: search,
    },
  });
  return response.data;
};

// 分页获取员工列表
export const getPaginatedStaffListRequest = async (page: number, page_size: number, search: string): Promise<ResponseData<PaginationStaffListResponse>> => {
  const response = await request.get<ResponseData<PaginationStaffListResponse>>(STAFF_API_URL.staff_paginated_list, {
    params: {
      page,
      page_size,
      search: search,
    },
  });
  return response.data;
};

// 删除员工
export const deleteStaffRequest = async (index: string): Promise<ResponseData<null>> => {
  const response = await request.delete<ResponseData<null>>(STAFF_API_URL.staff_delete, {
    data: {
      index:index,
    },
  });
  return response.data;
};

// 创建员工
export const createStaffRequest = async (data: StaffOperation): Promise<ResponseData<StaffDetail>> => {
  const response = await request.post<ResponseData<StaffDetail>>(STAFF_API_URL.staff_create, data);
  return response.data;
};

// 更新员工
export const updateStaffRequest = async (index: string, data: StaffOperation): Promise<ResponseData<StaffDetail>> => {
  const response = await request.put<ResponseData<StaffDetail>>(STAFF_API_URL.staff_update + index, data);
  return response.data;
};

// 获取部门列表
export const getDepartmentListRequest = async (search: string = ''): Promise<ResponseData<Department[]>> => {
  const response = await request.get<ResponseData<Department[]>>(STAFF_API_URL.department_list, {
    params: {
      search: search,
    },
  });
  return response.data;
};

// 获取职位列表
export const getPositionListRequest = async (search: string = ''): Promise<ResponseData<Position[]>> => {
  const response = await request.get<ResponseData<Position[]>>(STAFF_API_URL.position_list, {
      params: {
        search: search,
      },
    });
    return response.data;
  };