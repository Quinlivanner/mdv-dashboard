// 配方合格状态
export const FormulaQualifiedStatus = {
  0: {
    text:'待定',
    class:'bg-yellow-500' 
  },
  1: {
    text:'合格',
    class:'bg-green-500'
  },
  2: {
    text:'不合格',
    class:'bg-red-500'
  },
}

// 样品方向 Select
export interface SampleDirectionBaseInfo {
  id: number;
  name: string;
}

// 里程碑
export interface Milestone {
  milestone_type: string;
  finished_time: string;
  finished: boolean;
  remark: string;
}

// 更新设计任务信息
export interface UpdatedDesignTaskInfo {
  srf_code: string ;
  take_time: string;
  plan_end_date: string ;
  priority: number ;
  customer: number ;
  engineer: number ;
  sales: number ;
  sample_direction: number ;
  project_background: string ;
  special_requirements: string ;
  remark: string ;
  sample_image: string[] ;
}

// 设计任务信息
export interface DesignTaskInfo {
    srf_code: string;
    take_time: string;
    plan_end_date: string | null;
    priority: number;
    customer: number;
    engineer: number;
    sales: number;
    sample_direction: number;
    project_background: string;
    special_requirements: string;
    remark: string;
    sample_image: string[];
}

export interface StaffBaseInfo {
  id: number;
  name: string;
}

export interface CustomerBaseInfo {
  id: number;
  name: string;
}

// 开发管理界面 任务列表显示
export interface DesignTaskListDetail {
  id: number;
  customer: CustomerBaseInfo;
  engineer: StaffBaseInfo;
  sales: StaffBaseInfo;
  sample_direction: SampleDirectionBaseInfo;
  index: string;
  status: number;
  status_text: string;
  priority_text: string;
  srf_code: string;
  take_time: string;
  plan_end_date: string | null;
  priority: number;
  project_background: string;
  special_requirements: string;
  remark: string;
  sample_image: string[];
  sample_info:{
    color: string;
    paint_number:string
    sample_number:string
  }
}

// 开发任务书详情
export interface DesignTaskDetailInfo extends DesignTaskListDetail {
  milestones: Milestone[];
}

// 上传样品图返回 url
export interface SampleImageUpload {
  url: string;
}

// 样品参数
export interface SampleParameter {
  id: number;
  name: string;
}

// 参数值类型定义
export interface ParameterItem {
  name: string;
  value: string;
}



// 样品
export interface Sample {
  index: string;
  id: number;
  parameters_list: ParameterItem[];
  image_url: string;
  paint_number: string;
  sample_number: string;
  version: string | null;
}

export interface DesignTaskDetail extends DesignTaskListDetail {
  sample_detail: Sample[];
}

// 提交的配方数据
export interface SampleFormulaType {
  index: string,
  // 底材
  baseMaterials: string[],
  // 打砂
  sanding: string,
  // 底油
  filterBottomOil: string,
  // 面油
  filterTopOil: string,
  // 预热温度
  preheatingTemperature: string,
  // 预热时间
  preheatingTime: string,
  // 烧结温度
  sinteringTemperature: string,
  // 烧结时间
  sinteringTime: string,
  // 颜色
  color: string,
  // 光泽度
  gloss: string,
  // 底油粘度
  bottomOilViscosity: string,
  // 底油比重
  bottomOilDensity: string,
  // 面油粘度
  topOilViscosity: string,
  // 面油比重
  topOilDensity: string,
  // 不粘性
  nonStickiness: string,
  // 耐磨性
  wearResistance: string,
  // 耐煮性
  boilingResistance: string,
  // 耐刮性
  scratchResistance: string,

  //sol
  sol: string,
  // binder
  binder: string,
  // additives
  additives: string,
  // 混合比例
  mixingRatio: string,

  // ac solution
  acSolutionComposition: {
    name: string;
    ingredients:    {
      name: string;
      percentage: number;
    }[];
  }[];
  // b solution
  bSolutionComposition: {
    name: string;
    ingredients:    {
      name: string;
      percentage: number;
    }[];
  }[];
  // 特殊记录
  specialRecord: string,
  // 配方不合格原因
  formula_unqualified_reason?: string,
  // AI分析不合格原因
  ai_analysis_unqualified_reason?: string,
}

// 请求返回的配方类型
export interface SampleFormulaResponse extends SampleFormulaType {
  version:string | null,
  // 配方合格状态
  formula_qualified_status: number | null,
  // 配方不合格原因
  formula_unqualified_reason: string,
  // AI分析不合格原因
  ai_analysis_unqualified_reason: string,
}




export interface DashboardShowTaskProgress {
  index: string
  srf_code: string
  customer_name: string
  engineer_name: string
  sales_name: string
  sample_direction_name: string
  priority_text: string
  progress: number
  milestone: Milestone[]
  sample_formula: SampleFormula[]
  status_text: string
  status: number
  take_time: string
  plan_end_date: string,
  next_status: string
}

export interface Milestone {
  milestone_text: any
  finished_time: string
  is_finished: boolean
}

export interface SampleFormula {
  version: string
  status: string
  create_at: string
  unqualified_reason: string
  ai_analysis_unqualified_reason: string
}


// 分页列表
export interface DSTProgressPaginationPageList {
  design_development_tasks:DashboardShowTaskProgress[]
  page: number
  page_size: number
  total: number
  total_pages: number
}
