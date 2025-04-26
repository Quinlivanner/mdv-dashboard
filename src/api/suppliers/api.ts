import request from "../request";
import {
    PaginatedRawMaterialListResponse,
    PaginatedSupplierListResponse,
    RawMaterialOperation,
    SupplierOperation,
    SuppliersBaseInfo
} from "./types";
import {ResponseData} from "../types";


const SUPPLIERS_API = {
  SUPPLIER_LIST: "suppliers/list",
  SUPPLIER_CREATE: "suppliers/create",
  SUPPLIER_UPDATE: "suppliers/update/",
  SUPPLIER_DELETE: "suppliers/delete/",

  SUPPLIER_SELECT_LIST: "/suppliers/list/select",

  // 原材料
  RAW_MATERIAL_LIST: "/suppliers/raw-material/list",
  RAW_MATERIAL_CREATE: "/suppliers/raw-material/create",
  RAW_MATERIAL_UPDATE: "/suppliers/raw-material/update/",
  RAW_MATERIAL_DELETE: "/suppliers/raw-material/delete/",

  // 原材料选择器
  RAW_MATERIAL_SELECT_LIST: "/suppliers/raw-material/select",

}

// 获取选择器供应商列表
export const getSupplierSelectListRequest = async (): Promise<ResponseData<SuppliersBaseInfo[]>> => {
  const response = await request.get<ResponseData<SuppliersBaseInfo[]>>(SUPPLIERS_API.SUPPLIER_SELECT_LIST);
  return response.data;
};

// 获取选择器供应商列表
export const getSupplierListRequest = async (): Promise<ResponseData<SuppliersBaseInfo[]>> => {
  const response = await request.get<ResponseData<SuppliersBaseInfo[]>>(SUPPLIERS_API.SUPPLIER_LIST);
  return response.data;
};

// 供应商页面获取供应商分页列表
export const getPaginatedSupplierListRequest = async (page: number, page_size: number, search: string): Promise<ResponseData<PaginatedSupplierListResponse>> => {
  const response = await request.get<ResponseData<PaginatedSupplierListResponse>>(SUPPLIERS_API.SUPPLIER_LIST, {
    params: {
      page,
      page_size,
      search: search,
    },
  });
  return response.data;
};


// 创建供应商
export const createSupplierRequest = async (data: any): Promise<ResponseData<SupplierOperation>> => {
  const response = await request.post<ResponseData<SupplierOperation>>(SUPPLIERS_API.SUPPLIER_CREATE, data);
  return response.data;
};

// 更新供应商信息
export const updateSupplierRequest = async (index: string, data: any): Promise<ResponseData<SupplierOperation>> => {
  const response = await request.put<ResponseData<SupplierOperation>>(SUPPLIERS_API.SUPPLIER_UPDATE + index, data);
  return response.data;
};

//删除供应商
export const deleteSupplierRequest = async (index: string): Promise<ResponseData<any>> => {
  const response = await request.delete<ResponseData<any>>(SUPPLIERS_API.SUPPLIER_DELETE + index);
  return response.data;
};


// 原材料分页列表
export const getPaginatedRawMaterialListRequest = async (page: number, page_size: number, search: string): Promise<ResponseData<PaginatedRawMaterialListResponse>> => {
  const response = await request.get<ResponseData<PaginatedRawMaterialListResponse>>(SUPPLIERS_API.RAW_MATERIAL_LIST, {
    params: {
      page,
      page_size,
      search: search,
    },
  });
  return response.data;
};


// 创建原材料
export const createRawMaterialRequest = async (data: any): Promise<ResponseData<RawMaterialOperation>> => {
  const response = await request.post<ResponseData<RawMaterialOperation>>(SUPPLIERS_API.RAW_MATERIAL_CREATE, data);
  return response.data;
};

// 更新原材料信息
export const updateRawMaterialRequest = async (index: string, data: any): Promise<ResponseData<RawMaterialOperation>> => {
  const response = await request.put<ResponseData<RawMaterialOperation>>(SUPPLIERS_API.RAW_MATERIAL_UPDATE + index, data);
  return response.data;
};

//删除原材料
export const deleteRawMaterialRequest = async (index: string): Promise<ResponseData<any>> => {
  const response = await request.delete<ResponseData<any>>(SUPPLIERS_API.RAW_MATERIAL_DELETE + index);
  return response.data;
};


// 原材料选择器
export const getRawMaterialSelectListRequest = async (): Promise<ResponseData<string[]>> => {
  const response = await request.get<ResponseData<string[]>>(SUPPLIERS_API.RAW_MATERIAL_SELECT_LIST);
  return response.data;
};