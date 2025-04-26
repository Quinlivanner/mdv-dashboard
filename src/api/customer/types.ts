export interface CustomerBaseInfo {
  id: number;
  name: string;
}



export interface PaginatedCustomerListResponse {
  customers: {
    name: string;
    phone: string;
    address: string;
    remark: string;
    index: string;
  }[];
  total: number;
  page: number;
  page_size: number;
}

export interface CustomerOperation {
  name: string;
  phone: string;
  address: string;
  remark: string;
}

export interface EmployeeOperation {
  name: string;
  phone: string;
  email: string;
  remark: string;
}

export interface CustomerEmployee {
  name: string;
  phone: string;
  email: string;
  remark: string;
  index?: string;
}



export interface CustomerEmployeeResponse {
  customer: {
    id: number;
    name: string;
  },
  employees: {
    name: string;
    phone: string;
    email: string;
    remark: string;
    index: string;
  }[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

