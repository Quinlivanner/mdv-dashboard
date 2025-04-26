
// 员工选择器基本信息
export interface StaffBaseInfo {
  id: number;
  name: string;
}

// 员工日志
export interface StaffLog {
  staff: string;
  operation_type: string;
  operation_time: string;
  resource: string;
  operation_description: string;
}

// 职位
export interface Position {
  id: number
  name: string
}

// 部门
export interface Department {
  id: number
  name: string
}

// 员工详情
export interface StaffDetail {
  department: Department
  position: Position
  last_login: string
  index: string
  name: string
  gender: number
  join_date: string
  contract_expiry_date: any
  phone: string
  email: string
  remark: string
  is_default_password: boolean
}

export interface PaginationStaffListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  staffs: StaffDetail[];
}

// 员工 oper types
export interface StaffOperation {
  name: string
  gender: number
  department: number
  position: number
  join_date: string
  contract_expiry_date: string
  phone: string
  email: string
  remark: string
}
