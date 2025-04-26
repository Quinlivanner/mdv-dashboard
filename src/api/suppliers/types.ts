export interface SuppliersBaseInfo {
  id: number;
  name: string;
}



export interface PaginatedSupplierListResponse {
  suppliers: {
    name: string;
    phone: string;
    email:string,
    country: string;
    remark: string;
    index: string;
  }[];
  total: number;
  page: number;
  page_size: number;
}

export interface SupplierOperation {
  name: string;
  phone: string;
  email: string;
  country: string;
  remark: string;
}


// 原材料


export interface RawMaterialLBaseInfo {
  id: number;
  name: string;
}

export interface PaginatedRawMaterialListResponse {
  raw_materials: {
    name: string;
    supplier: SuppliersBaseInfo;
    scientific_name:string,
    internal_number: string;
    unit: string;
    molecular_formula: string;
    description:string
    index: string;
  }[];
  total: number;
  page: number;
  page_size: number;
}

export interface RawMaterialOperation {
  name: string;
  supplier: string;
  scientific_name:string,
  internal_number: string;
  unit: string;
  molecular_formula: string;
  description:string
}


// 扩展的客户信息接口，用于提交数据
export interface RequestRawMaterialInfo extends RawMaterialLBaseInfo {
  index: string; // 序列
  name: string;
  supplier: string;
  scientific_name: string;
  internal_number: string;
  unit: string;
  molecular_formula: string;
  description: string;
}


// 扩展的客户信息接口，用于前端展示
export interface ExtendedRawMaterialInfo extends RawMaterialLBaseInfo {
  index: string; // 序列
  name: string;
  supplier: SuppliersBaseInfo;
  scientific_name: string;
  internal_number: string;
  unit: string;
  molecular_formula: string;
  description: string;
}