// 电梯选型数据类型
export interface ElevatorSelectionData {
  // 输入参数
  liftModel: string;           // 电梯型号
  capacity: number;            // 载重(kg)
  speed: number;               // 速度(m/s)
  travelHeight: number;        // 行程高度(m)
  carWidth: number;            // 轿厢宽度(mm)
  carDepth: number;            // 轿厢深度(mm)
  carHeight: number;           // 轿厢高度(mm)
  cwtPosition: 'SIDE' | 'REAR'; // 平衡重位置
  cwtSafetyGear: boolean;      // 平衡重安全钳
  doorOpening: string;         // 门开启方式
  doorWidth: number;           // 门宽(mm)
  doorHeight: number;          // 门高(mm)
  throughDoor: boolean;        // 贯通门
  glassDoor: boolean;          // 玻璃门
  doorModel: string;           // 门型号
  standard: string;            // 标准
  doorCenterPosition: string;  // 门中心位置
  floorExceedCode: boolean;    // 楼层是否超过标准
  shaftTolerance: string;      // 井道公差
  marbleFloorThickness: number; // 大理石地板厚度(mm)

  // 计算结果
  shaftWidth: number;          // 井道宽度(mm)
  shaftDepth: number;          // 井道深度(mm)
  overhead: number;            // 顶层高度(mm)
  pitDepth: number;            // 底坑深度(mm)
  
  // 元数据
  opportunityId: string;       // 关联的商机ID
  lastUpdated: string;         // 最后更新时间
  isSubmitted?: boolean;       // 是否已提交选型
  submittedAt?: string;        // 提交时间
}

// 计算结果类型
export interface CalculatedResult {
  capacity: number;         // 载重(kg)
  persons: number;          // 人数
  shaftWidth: number;       // 井道宽度(mm)
  shaftDepth: number;       // 井道深度(mm)
  overheadHeight: number;   // 顶层高度(mm)
  pitDepth: number;         // 底坑深度(mm)
}

// 存储选型数据到localStorage
export function saveElevatorSelection(data: ElevatorSelectionData): void {
  try {
    localStorage.setItem(`elevatorSelectionData-${data.opportunityId}`, JSON.stringify(data));
    
    // 更新提交状态映射
    if (data.isSubmitted) {
      let submittedOpportunities: {[key: string]: boolean} = {};
      const saved = localStorage.getItem('submittedElevatorSelections');
      if (saved) {
        submittedOpportunities = JSON.parse(saved);
      }
      submittedOpportunities[data.opportunityId] = true;
      localStorage.setItem('submittedElevatorSelections', JSON.stringify(submittedOpportunities));
    }
  } catch (error) {
    console.error('保存电梯选型数据失败:', error);
  }
}

// 从localStorage获取选型数据
export function getElevatorSelection(opportunityId: string): ElevatorSelectionData | null {
  try {
    const data = localStorage.getItem(`elevatorSelectionData-${opportunityId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('获取电梯选型数据失败:', error);
    return null;
  }
}

// 检查商机是否已提交选型
export function isElevatorSelectionSubmitted(opportunityId: string): boolean {
  try {
    const submittedData = localStorage.getItem('submittedElevatorSelections');
    if (!submittedData) return false;
    
    const submittedOpportunities: {[key: string]: boolean} = JSON.parse(submittedData);
    return !!submittedOpportunities[opportunityId];
  } catch (error) {
    console.error('检查选型提交状态失败:', error);
    return false;
  }
}

// 检查商机是否已有选型数据
export function hasElevatorSelection(opportunityId: string): boolean {
  return localStorage.getItem(`elevatorSelectionData-${opportunityId}`) !== null;
}

// 默认选型数据
export function getDefaultSelectionData(opportunityId: string): ElevatorSelectionData {
  return {
    // 只设置opportunityId和lastUpdated，其他值为空
    liftModel: '',
    capacity: undefined as unknown as number,
    speed: undefined as unknown as number,
    travelHeight: undefined as unknown as number,
    carWidth: undefined as unknown as number,
    carDepth: undefined as unknown as number,
    carHeight: undefined as unknown as number,
    cwtPosition: undefined as unknown as 'SIDE' | 'REAR',
    cwtSafetyGear: false,
    doorOpening: undefined as unknown as string,
    doorWidth: undefined as unknown as number,
    doorHeight: undefined as unknown as number,
    throughDoor: false,
    glassDoor: false,
    doorModel: '',
    standard: undefined as unknown as string,
    doorCenterPosition: undefined as unknown as string,
    floorExceedCode: false,
    shaftTolerance: undefined as unknown as string,
    marbleFloorThickness: undefined as unknown as number,
    shaftWidth: undefined as unknown as number,
    shaftDepth: undefined as unknown as number,
    overhead: undefined as unknown as number,
    pitDepth: undefined as unknown as number,
    opportunityId,
    lastUpdated: new Date().toISOString(),
    isSubmitted: false
  };
} 