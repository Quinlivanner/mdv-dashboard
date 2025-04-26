// 总的响应格式
export interface ResponseData<T> {
  code: number;
  msg: string;
  data: T;
}

// 员工类型
export enum StaffType {
  DEVELOPER = "developer",
  SALES = "sales",
}

