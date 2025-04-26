import request from "../request";
import {
    DesignTaskDetail,
    DesignTaskListDetail,
    DesignTaskInfo,
    SampleDirectionBaseInfo,
    SampleFormulaResponse,
    SampleFormulaType,
    SampleImageUpload,
    SampleParameter,
    DesignTaskDetailInfo,
    Sample,
    DashboardShowTaskProgress,
    DSTProgressPaginationPageList,
} from "./types";
import {ResponseData} from "../types";


const STAFF_API = {
  // 获取应用方向列表
  SAMPLE_DIRECTION_LIST: "/staff/sample-direction/list",
  // 创建设计任务
  CREATE_DESIGN_TASK: "/staff/design-development-task/create",
  // 更新设计任务
  UPDATE_DESIGN_TASK: "/staff/design-development-task/update/",
  // 获取设计任务列表
  DESIGN_TASK_LIST: "/staff/design-development-task/list",
  // 上传样品图片
  UPLOAD_SAMPLE_IMAGE: "/staff/sample/image/upload",
  // 获取样品参数列表
  SAMPLE_PARAMETER_LIST: "/staff/sample/parameter/list",
  // 获取 设计任务书详情
  DESIGN_TASK_DETAIL: "/staff/design-development-task/detail/",
  // 创建应用方向
  CREATE_SAMPLE_DIRECTION: "/staff/sample-direction/create",


  // 创建配方表
  CREATE_SAMPLE_FORMULA: "/staff/sample-formula/create/",
  // 更新配方表
  UPDATE_SAMPLE_FORMULA: "/staff/sample-formula/update/",
  // 删除配方表
  DELETE_SAMPLE_FORMULA: "/staff/sample-formula/delete/",

  // 获取配方列表+详情
  GET_SAMPLE_FORMULA_LIST: "/staff/sample-formula/list/",
  // 标记配方为待定
  MARK_SAMPLE_FORMULA_PENDING: "/staff/sample-formula/pending",
  // 标记配方为合格
  MARK_SAMPLE_FORMULA_QUALIFIED: "/staff/sample-formula/qualified",
  // 标记配方为不合格
  MARK_SAMPLE_FORMULA_FAILED: "/staff/sample-formula/unqualified",
  // 标记配方为生产配方
  MARK_SAMPLE_FORMULA_PRODUCTION: "/staff/sample-formula/production",

  // 创建样品
  CREATE_SAMPLE: "/staff/sample/create/",
  // 样品列表及详情
  SAMPLE_LIST: "/staff/sample/list/",
  // 更新样品
  UPDATE_SAMPLE: "/staff/sample/update/",
  // 删除样品
  DELETE_SAMPLE: "/staff/sample/delete/",


  // dashboard 获取任务进度
  DASHBOARD_TASK_PROGRESS: "/staff/show/ddt/list/",

  // 任务书里程碑进入下一阶段
  TASK_MILESTONE_NEXT_STAGE: "staff/ddt/status/update/",
}


// 获取设计任务书列表
export const getDesignTaskListRequest = async (): Promise<ResponseData<DesignTaskListDetail[]>> => {
  const response = await request.get<ResponseData<DesignTaskListDetail[]>>(STAFF_API.DESIGN_TASK_LIST);
  return response.data;
};

// 获取应用方向列表
export const getSampleDirectionListRequest = async (): Promise<ResponseData<SampleDirectionBaseInfo[]>> => {
  const response = await request.get<ResponseData<SampleDirectionBaseInfo[]>>(STAFF_API.SAMPLE_DIRECTION_LIST);
  return response.data;
};

// 创建应用方方向
export const createSampleDirectionRequest = async (data: {name: string}): Promise<ResponseData<any>> => {
  const response = await request.post<ResponseData<any>>(STAFF_API.CREATE_SAMPLE_DIRECTION, data);
  return response.data;
};

// 创建设计任务
export const createDesignTaskRequest = async (data: DesignTaskInfo): Promise<ResponseData<any>> => {
  const response = await request.post<ResponseData<any>>(STAFF_API.CREATE_DESIGN_TASK, data);
  return response.data;
};

// 更新设计任务
export const updateDesignTaskRequest = async (index: string, data: any): Promise<ResponseData<any>> => {
  const response = await request.post<ResponseData<any>>(STAFF_API.UPDATE_DESIGN_TASK + index, data);
  return response.data;
};

// 上传样品图片
export const uploadSampleImageRequest = async (image: File): Promise<ResponseData<SampleImageUpload>> => {
  const formData = new FormData();
  formData.append("sample_image", image);
  const response = await request.post<ResponseData<SampleImageUpload>>(STAFF_API.UPLOAD_SAMPLE_IMAGE, formData);
  return response.data;
};

// 获取样品参数列表
export const getSampleParameterListRequest = async (): Promise<ResponseData<SampleParameter[]>> => {
  const response = await request.get<ResponseData<SampleParameter[]>>(STAFF_API.SAMPLE_PARAMETER_LIST);
  return response.data;
};

// 获取 设计任务书详情
export const getDesignTaskDetailRequest = async (index: string): Promise<ResponseData<DesignTaskDetailInfo>> => {
  const response = await request.get<ResponseData<DesignTaskDetailInfo>>(STAFF_API.DESIGN_TASK_DETAIL + index);
  return response.data;
};

// 创建配方表
export const createSampleFormulaRequest = async (index: string, data: SampleFormulaType): Promise<ResponseData<any>> => {
  const response = await request.post<ResponseData<any>>(STAFF_API.CREATE_SAMPLE_FORMULA + index, data);
  return response.data;
};

// 更新配方表
export const updateSampleFormulaRequest = async (index: string, data: SampleFormulaType): Promise<ResponseData<any>> => {
  const response = await request.put<ResponseData<any>>(STAFF_API.UPDATE_SAMPLE_FORMULA + index, data);
  return response.data;
};

// 删除配方表
export const deleteSampleFormulaRequest = async (index: string): Promise<ResponseData<any>> => {
  const response = await request.delete<ResponseData<any>>(STAFF_API.DELETE_SAMPLE_FORMULA + index);
  return response.data;
};

// 根据设计开发任务书获取配方列表+详情
export const  getSampleFormulaListRequest = async (index: string): Promise<ResponseData<SampleFormulaResponse[]>> => {
  const response = await request.get<ResponseData<SampleFormulaResponse[]>>(STAFF_API.GET_SAMPLE_FORMULA_LIST + index);
  return response.data;
};

// 标记配方为待定   
export const markSampleFormulaPendingRequest = async (data: {index: string}): Promise<ResponseData<null>> => {
  const response = await request.post<ResponseData<null>>(STAFF_API.MARK_SAMPLE_FORMULA_PENDING, data);
  return response.data;
};

// 标记配方为合格
export const markSampleFormulaQualifiedRequest = async (data: {index: string}): Promise<ResponseData<null>> => {
  const response = await request.post<ResponseData<null>>(STAFF_API.MARK_SAMPLE_FORMULA_QUALIFIED, data);
  return response.data;
};  

// 标记配方为不合格
export const markSampleFormulaFailedRequest = async (data: {index: string, reason: string}): Promise<ResponseData<null>> => {
  const response = await request.post<ResponseData<null>>(STAFF_API.MARK_SAMPLE_FORMULA_FAILED, data);
  return response.data;
};

// 标记配方为生产配方
export const markSampleFormulaProductionRequest = async (data: {index: string}): Promise<ResponseData<null>> => {
  const response = await request.post<ResponseData<null>>(STAFF_API.MARK_SAMPLE_FORMULA_PRODUCTION, data);
  return response.data;
};

// 创建样品
export const createSampleRequest = async (index: string): Promise<ResponseData<Sample>> => {
  const response = await request.post<ResponseData<Sample>>(STAFF_API.CREATE_SAMPLE + index);
  return response.data;
};

// 获取样品列表
export const getSampleListRequest = async (index: string): Promise<ResponseData<Sample[]>> => {
  const response = await request.get<ResponseData<Sample[]>>(STAFF_API.SAMPLE_LIST + index);
  return response.data;
};

// 更新样品
export const updateSampleRequest = async (index: string, data: Sample): Promise<ResponseData<Sample>> => {
  const response = await request.put<ResponseData<Sample>>(STAFF_API.UPDATE_SAMPLE + index, data);
  return response.data;
};

// 删除样品
export const deleteSampleRequest = async (index: string): Promise<ResponseData<null>> => {
  const response = await request.delete<ResponseData<null>>(STAFF_API.DELETE_SAMPLE + index);
  return response.data;
};

// 获取任务进度
export const getTaskProgressRequest = async (page: number, page_size: number,search: string,filter: string): Promise<ResponseData<DSTProgressPaginationPageList>> => {
  const response = await request.get<ResponseData<DSTProgressPaginationPageList>>(STAFF_API.DASHBOARD_TASK_PROGRESS+filter, 
    {
      params: {
        page,
        page_size,
        search: search,
      },
    }
  );
  return response.data;
};

// 任务书里程碑进入下一阶段
export const taskMilestoneNextStageRequest = async (index: string): Promise<ResponseData<DashboardShowTaskProgress>> => {
  const response = await request.put<ResponseData<DashboardShowTaskProgress>>(STAFF_API.TASK_MILESTONE_NEXT_STAGE + index);
  return response.data;
};
