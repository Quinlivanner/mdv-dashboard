// 设计开发任务书的数据模型
export interface DesignTask {
  // 基本信息
  srf: string; // SRF编号
  client: string; // 客户名称
  projectName: string; // 项目工程师
  projectManager: string; // 项目销售

  // 样品需求
  application: string; // 应用方向
  requirements: string; // 项目背景

  // 特殊要求
  specialRequirements: string; // 特殊要求

  // 样品1信息
  sample1: {
    material: string; // 底材
    color: string; // 颜色
    gloss: string; // 光泽度
    system: string; // 系统
    adhesion: string; // 附着力
    tourmaline: string; // Tourmaline
    coatingAmount: string; // 涂料数量
    pieceCount: string; // 样板数量
  };

  // 其他样品信息 (预留字段)
  samples?: Array<{
    material: string;
    color: string;
    gloss: string;
    system: string;
    adhesion: string;
    tourmaline: string;
    coatingAmount: string;
    pieceCount: string;
  }>;

  // 备注
  remarks: string;

  // 资源配置
  resources: {
    designer: string; // 负责人
    department: string; // 部门
    completionDate: string; // 完成日期
  };

  // 项目开发信息
  development: Array<{
    phase: string; // 阶段
    responsible: string; // 责任人
    department: string; // 部门
    completionDate: string; // 完成日期
  }>;
} 