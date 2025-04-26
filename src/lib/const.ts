import { SampleFormulaType, UpdatedDesignTaskInfo} from "@/api/rad/types";

export const initialSampleFormula: SampleFormulaType = {
    index: '',
    // 底材
    baseMaterials: [''],
    // 打砂
    sanding: '',
    // 底油
    filterBottomOil: '',
    // 面油
    filterTopOil: '',
    // 预热温度
    preheatingTemperature: '',
    // 预热时间
    preheatingTime: '',
    // 烧结温度
    sinteringTemperature: '',
    // 烧结时间
    sinteringTime: '',
    // 颜色
    color: '',
    // 光泽度
    gloss: '',
    // 底油粘度
    bottomOilViscosity: '',
    // 底油比重
    bottomOilDensity: '',
    // 面油粘度
    topOilViscosity: '',
    // 面油比重
    topOilDensity: '',
    // 不粘性
    nonStickiness: '',
    // 耐磨性
    wearResistance: '',
    // 耐煮性
    boilingResistance: '',
    // 耐刮性
    scratchResistance: '',
    //sol
    sol: '',
    // binder
    binder: '',
    // additives
    additives: '',
    // 混合比例
    mixingRatio: '',
    // ac solution
    acSolutionComposition: [],
    // b solution
    bSolutionComposition: [],
    // 特殊记录
    specialRecord: ''
}

