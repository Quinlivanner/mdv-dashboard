"use client";

import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
    CheckCircleIcon,
    ChevronDown,
    ChevronUp,
    FlaskConicalIcon,
    PencilIcon,
    PlusCircle,
    ScanBarcodeIcon,
    Trash2Icon,
    XCircleIcon,
    UserIcon,
    BrainIcon
} from "lucide-react";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import {FormulaDialog} from "./FormulaDialog";
import {SampleFormulaResponse, SampleFormulaType} from "@/api/rad/types";
import {generateSampleFormulaId} from "@/lib/gen";
import {
    createSampleFormulaRequest,
    getSampleFormulaListRequest,
    markSampleFormulaFailedRequest,
    markSampleFormulaQualifiedRequest,
    markSampleFormulaPendingRequest,
    markSampleFormulaProductionRequest,
    updateSampleFormulaRequest,
    deleteSampleFormulaRequest
} from "@/api/rad/api";
import ShowToolTip from "../share/tooltip/tooltip";
import {initialSampleFormula} from "@/lib/const";
import ToolTipButton from "../share/button";
import FailedMarkDialog from "./Failed-mark-dialog";
import { ShareConfirmDeleteDialog } from "../share/confirm-delete-dialog";

interface SampleFormulaProps {
    sampleId?: string;
    designTaskIndex: string;
}

// 删除配方
interface DeleteFormula {
    list_index: number;
    version: string;
    index: string;
}


// 定义配方合格状态
const formulaQualifiedStatusBadge = {
    0: <Badge variant="outline" className="ml-3 bg-[#EFF6FF] text-[#1E4ED8] border-[#BFDBFE] text-xs">
        待定
    </Badge>,
    1: <Badge variant="outline" className="ml-4 bg-[#F0FDF5] text-[#00A63E] border-[#DCFCE7] text-xs">
        合格
    </Badge>,
    2: <Badge variant="outline" className="ml-4 bg-[#FFF2F3] text-[#E7000B] border-[#FFE2E1] text-xs">
        不合格
    </Badge>,
    3: <Badge variant="outline" className="ml-4 bg-[#F0FDF5] text-[#00A63E] border-[#DCFCE7] text-xs">
        生产方案
    </Badge>
}


export default function SampleFormula({sampleId, designTaskIndex}: SampleFormulaProps) {
    const [SampleFormula, setSampleFormula] = useState<SampleFormulaResponse[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentSampleFormula, setCurrentSampleFormula] = useState<SampleFormulaResponse | null>(null);
    const [editIndex, setEditIndex] = useState<number>(-1);

    // 折叠状态管理
    // 打开基础数据
    const [openBasicData, setOpenBasicData] = useState<Record<string, boolean>>({});
    // 打开性能数据
    const [openPerformance, setOpenPerformance] = useState<Record<string, boolean>>({});
    // 打开详细参数
    const [openDetailParams, setOpenDetailParams] = useState<Record<string, boolean>>({});
    // 打开淘汰原因
    // const [openUnqualifiedReason, setOpenUnqualifiedReason] = useState<Record<string, boolean>>({});
    // 添加基础数据
    const [openAddBasicData, setOpenAddBasicData] = useState(false);
    // 添加性能数据
    const [openAddPerformance, setOpenAddPerformance] = useState(false);
    // 添加详细参数
    const [openAddDetailParams, setOpenAddDetailParams] = useState(false);
    // 编辑基础数据
    const [openEditBasicData, setOpenEditBasicData] = useState(false);
    // 编辑性能数据
    const [openEditPerformance, setOpenEditPerformance] = useState(false);
    // 编辑详细参数
    const [openEditDetailParams, setOpenEditDetailParams] = useState(false);
    // 打开配方详情
    const [openFormulaDetail, setOpenFormulaDetail] = useState(false);

    // 标记不合格
    // 打开标记不合格 dialog
    const [openFailedMarkDialog, setOpenFailedMarkDialog] = useState(false);
    // 标记不合格版本
    const [failedMarkVersion, setFailedMarkVersion] = useState("");
    // 标记不合格原因
    const [failedMarkReason, setFailedMarkReason] = useState("");
    // 标记不合格配方索引
    const [failedMarkIndex, setFailedMarkIndex] = useState("");

    // 用于新增或编辑的表单数据
    const [formData, setFormData] = useState<SampleFormulaType>(initialSampleFormula);
    // 是否加载中
    const [isLoading, setIsLoading] = useState(false);

    // 确认删除配方 Dialog
    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

    // 删除配方 Index
    const [DeleteFormulaData, setDeleteFormulaData] = useState<DeleteFormula>({
        list_index: -1,
        version: "",
        index: ""
    });
    

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await getSampleFormulaListRequest(designTaskIndex);
            if (res.code === 0) {
                setSampleFormula(res.data);
            } else {
                toast.error("获取配方列表失败:" + res.msg);
            }
        } catch (error) {
            toast.error("获取配方列表失败:" + error);
        } finally {
            setIsLoading(false);
        }

    }

    // 组件加载获取数据
    useEffect(() => {
        fetchData();
    }, [designTaskIndex]);


    // 控制显示卡片开关
    const handleOpenFormulaDetail = (idx: string) => {
        const anyOpen = openBasicData[idx] || openPerformance[idx] || openDetailParams[idx];
        const newState = !anyOpen;

        // 更新所有状态
        setOpenFormulaDetail(newState);
        setOpenBasicData({...openBasicData, [idx]: newState});
        setOpenPerformance({...openPerformance, [idx]: newState});
        setOpenDetailParams({...openDetailParams, [idx]: newState});

    };

    // 初始化编辑表单数据
    const handleEdit = (param: SampleFormulaResponse, index: number) => {
        setCurrentSampleFormula(param);
        setFormData({...param});
        setEditIndex(index);
        setIsEditOpen(true);
    };

    // 初始化新增表单数据
    const handleAdd = () => {
        setFormData(initialSampleFormula);
        setIsAddOpen(true);
    };

    // 处理删除
    const handleConfirmDelete = (list_index: number, version: string , index: string) => {
        setDeleteFormulaData({
            list_index: list_index,
            version: version,
            index: index
        });
        setOpenConfirmDeleteDialog(true);
    };

    // 确认删除
    const confirmDelete = async () => {

        deleteSampleFormulaRequest(DeleteFormulaData.index).then(
            (res)=>{
                if (res.code === 0) {
                    const newParams = [...SampleFormula];
                    newParams.splice(DeleteFormulaData.list_index, 1);
                    setSampleFormula(newParams);
                    toast.success("删除成功");
                    setOpenConfirmDeleteDialog(false);
                setDeleteFormulaData({
                    list_index: -1,
                    version: "",
                    index: ""
                });
            }
        }
    ).catch((err)=>{
        toast.error("删除失败:" + err);
    })
        
    }


    // 保存新增数据
    const handleSaveAdd = async () => {
        // 过滤掉空的底材
        const cleanedFormData = {
            ...formData,
            baseMaterials: formData?.baseMaterials.filter((material: string) => material.trim() !== "") || []
        };

        // 如果所有底材都是空的，确保至少有一个空字符串
        if (cleanedFormData.baseMaterials.length === 0) {
            cleanedFormData.baseMaterials = [""];
        }
        cleanedFormData.index = generateSampleFormulaId()
        try {
            const res = await createSampleFormulaRequest(designTaskIndex, cleanedFormData as SampleFormulaType);
            if (res.code === 0) {
                // 倒序
                setSampleFormula([res.data as SampleFormulaResponse, ...SampleFormula]);
                toast.success("新配方添加成功");
                setIsAddOpen(false);
            } else {
                toast.error("新配方添加失败:" + res.msg);
            }
        } catch (error) {
            toast.error("新配方添加失败:" + error);
        }

    };

    // 保存编辑数据
    const handleSaveEdit = async () => {
        // 过滤掉空的底材
        const cleanedFormData = {
            ...formData,
            baseMaterials: formData?.baseMaterials.filter((material: string) => material.trim() !== "") || []
        };

        // 如果所有底材都是空的，确保至少有一个空字符串
        if (cleanedFormData.baseMaterials.length === 0) {
            cleanedFormData.baseMaterials = [""];
        }
        
        try{
            const res = await updateSampleFormulaRequest(cleanedFormData.index, cleanedFormData as SampleFormulaType);
            if (res.code === 0) {
                const newParams = [...SampleFormula];
                newParams[editIndex] = res.data as SampleFormulaResponse;
                setSampleFormula(newParams);
                setIsEditOpen(false);
                toast.success("更新成功");
            }
        } catch (error) {
            toast.error("更新失败:" + error);
        }

    };


    // 打开标记配方为不合格 dialog
    const handleMarkFailedDialog = async (index: string, version: string) => {
        setOpenFailedMarkDialog(true);
        setFailedMarkVersion(version);
        setFailedMarkIndex(index);
        setFailedMarkReason("");
    }

    // 标记配方不合格请求
    const handleMarkFailedRequest = async () => {
        try {
            const res = await markSampleFormulaFailedRequest({index: failedMarkIndex, reason: failedMarkReason});
            if (res.code === 0) {
                setOpenFailedMarkDialog(false);
                const newParams = [...SampleFormula];
                const target = newParams.find(item => item.index === failedMarkIndex);
                if (target) {
                    target.formula_qualified_status = 2;
                }
                setSampleFormula(newParams)

                // 初始化
                setFailedMarkVersion("");
                setFailedMarkIndex("");
                setFailedMarkReason("");

                toast.success(`标记 ${failedMarkVersion} 版本为不合格成功`);
            } else {
                switch (res.code) {
                    case -9:
                        toast.error("关键参数缺失，请检查提交数据！");
                        break;
                    case -10:
                        toast.error(`${failedMarkVersion} 版本配方当前状态为不合格，无法再次标记！`);
                        break;
                    case -1:
                        toast.error("标记失败:找不到该配方，请刷新页面后重试！");
                        break;
                    default:
                        toast.error("标记配方不合格失败:" + res.msg);
                        break;
                }
            }
        } catch (error) {
            toast.error("标记配方不合格失败:" + error);
        } finally {
            // 重新载入数据
            fetchData()
        }

    }

    // 标记配方合格请求
    const handleMarkQualifiedRequest = async (index: string, version: string) => {
        try {
            const res = await markSampleFormulaQualifiedRequest({index: index});
            if (res.code === 0) {
                const newParams = [...SampleFormula];
                const target = newParams.find(item => item.index === index);
                if (target) {
                    target.formula_qualified_status = 1;
                }
                setSampleFormula(newParams)

                toast.success(`标记 ${version} 版本为合格成功`);
            } else {
                switch (res.code) {
                    case -9:
                        toast.error("关键参数缺失，请检查提交数据！");
                        break;
                    case -10:
                        toast.error(`${version} 版本配方当前状态为合格，无法再次标记！`);
                        break;
                    case -1:
                        toast.error("标记失败:找不到该配方，请刷新页面后重试！");
                        break;
                    case -11:
                        toast.error("当前已有其他合格配方，无法新增合格配方！");
                        break;
                    default:
                        toast.error("标记配方合格失败:" + res.msg);
                        break;
                }
            }
        } catch (error) {
            toast.error("标记配方合格失败:" + error);
        } finally {
            // 重新载入数据
            fetchData()
        }

    }

    // 标记配方待定请求
    const handleMarkPendingRequest = async (index: string, version: string) => {
        try {
            const res = await markSampleFormulaPendingRequest({index: index});
            if (res.code === 0) {
                const newParams = [...SampleFormula];
                const target = newParams.find(item => item.index === index);
                if (target) {
                    target.formula_qualified_status = 0;
                }
                setSampleFormula(newParams)

                toast.success(`标记 ${version} 版本为待定成功`);
            } else {
                switch (res.code) {
                    case -9:
                        toast.error("关键参数缺失，请检查提交数据！");
                        break;
                    case -10:
                        toast.error(`${version} 版本配方当前状态为待定，无法再次标记！`);
                        break;
                    case -1:
                        toast.error("标记失败:找不到该配方，请刷新页面后重试！");
                        break;
                    default:
                        toast.error("标记配方待定失败:" + res.msg);
                        break;
                }
            }
        } catch (error) {
            toast.error("标记配方待定失败:" + error);
        } finally {
            // 重新载入数据
            fetchData()
        }

    }


    // 标记配方为生产方案
    const handleMarkFormulaAsProduction = async (index: string, version: string) => {
        try {
            const res = await markSampleFormulaProductionRequest({index: index});
            if (res.code === 0) {
                const newParams = [...SampleFormula];
                const target = newParams.find(item => item.index === index);
                if (target) {
                    target.formula_qualified_status = 0;
                }
                setSampleFormula(newParams)

                toast.success(`标记 ${version} 版本为生产方案成功`);
            } else {
                switch (res.code) {
                    case -9:
                        toast.error("关键参数缺失，请检查提交数据！");
                        break;
                    case -10:
                        toast.error(`${version} 版本配方当前状态为生产方案，无法再次标记！`);
                        break;
                    case -1:
                        toast.error("标记失败:找不到该配方，请刷新页面后重试！");
                        break;
                    case -11:
                        toast.error("当前已有其他生产方案，无法新增生产方案！");
                        break;
                    default:
                        toast.error("标记配方为生产方案失败:" + res.msg);
                        break;
                }
            }
        } catch (error) {
            toast.error("标记配方为生产方案失败:" + error);
        } finally {
            // 重新载入数据
            fetchData()
        }

    }

    if (isLoading) {
        // 用转圈
        return <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative w-12 h-12">
                <div className="absolute w-full h-full border-4 border-muted rounded-full"></div>
                <div
                    className="absolute w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">配方列表</h2>
                <Button onClick={handleAdd} className="flex items-center gap-1 ">
                    <PlusCircle size={16}/>
                    <span>添加配方</span>
                </Button>
            </div>

            {SampleFormula.length === 0 ? (
                <Card className="shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-10">
                        <p className="text-muted-foreground mb-4">暂无配方信息</p>
                        <Button onClick={handleAdd}>添加第一个配方</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 grid-cols-1">
                    {SampleFormula.map((param, index) => (
                        <Card key={param.index}
                              className={`w-full ${param.formula_qualified_status === 2 ? "border-2 border-red-500" : param.formula_qualified_status === 0 ? "" : "border-2 border-[#07DA8B]"}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <CardTitle>
                                        <span className="text-xl font-bold">配方 #{param.version}</span>
                                        {formulaQualifiedStatusBadge[param.formula_qualified_status as keyof typeof formulaQualifiedStatusBadge]}
                                    </CardTitle>
                                    <div className="flex gap-2">

                                        {/* 合格状态按钮 */}
                                        {
                                            param.formula_qualified_status ===3?(
                                                null
                                            ):
                                            param.formula_qualified_status === 2 ? (
                                                <>
                                                    <ToolTipButton
                                                        content="标记为合格"
                                                        onClick={() => {
                                                            handleMarkQualifiedRequest(param.index, param.version || "");
                                                        }}
                                                        icon={<CheckCircleIcon
                                                            className="h-4 w-4 text-green-500"/>}/>

                                                    <ToolTipButton
                                                        content="标记为待定"
                                                        onClick={() => {
                                                            handleMarkPendingRequest(param.index, param.version || "");
                                                        }}
                                                        icon={<FlaskConicalIcon className="h-4 w-4 text-yellow-500"/>}
                                                    />
                                                </>

                                            ) : (
                                                param.formula_qualified_status === 0 ? (
                                                    <>
                                                        <ToolTipButton
                                                            content="标记为合格"
                                                            onClick={() => {
                                                                handleMarkQualifiedRequest(param.index, param.version || "");
                                                            }}
                                                            icon={<CheckCircleIcon className="h-4 w-4 text-green-500"/>}
                                                        />
                                                        <ToolTipButton
                                                            content="标记为不合格"
                                                            onClick={() => {
                                                                handleMarkFailedDialog(param.index, param.version || "");
                                                            }}
                                                            icon={<XCircleIcon className="h-4 w-4 text-red-500"/>}
                                                        />
                                                    </>

                                                ) : (
                                                    <>
                                                        <ToolTipButton
                                                            content="标记为不合格"
                                                            onClick={() => {
                                                                handleMarkFailedDialog(param.index, param.version || "");
                                                            }}
                                                            icon={<XCircleIcon className="h-4 w-4 text-red-500"/>}
                                                        />
                                                        <ToolTipButton
                                                            content="标记为待定"
                                                            onClick={() => {
                                                                handleMarkPendingRequest(param.index, param.version || "");
                                                            }}
                                                            icon={<FlaskConicalIcon
                                                                className="h-4 w-4 text-yellow-500"/>}
                                                        />
                                                    </>
                                                )
                                            )
                                        }

                                        {/* 展开折叠按钮 */}
                                        <ShowToolTip
                                            children={
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        handleOpenFormulaDetail(param.index);
                                                    }}
                                                >
                                                    {openBasicData[param.index] || openPerformance[param.index] || openDetailParams[param.index] ?
                                                        <ChevronUp className="h-4 w-4"/> :
                                                        <ChevronDown className="h-4 w-4"/>
                                                    }
                                                </Button>
                                            }
                                            content={openBasicData[param.index] || openPerformance[param.index] || openDetailParams[param.index] ?
                                                "收起" :
                                                "展开"
                                            }
                                        />

                                        {/* 标记为生产方案 */}
                                        {
                                            param.formula_qualified_status === 1 && (
                                                <ShowToolTip
                                                    children={
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                                handleMarkFormulaAsProduction(param.index, param.version || "");
                                                            }}
                                                        >
                                                            <ScanBarcodeIcon className="h-4 w-4 text-green-500"/>
                                                        </Button>
                                                    }
                                                    content="标记为生产方案"

                                                />
                                            )}
                                        {/* 编辑按钮 */}
                                        {
                                            param.formula_qualified_status ===3?(
                                                null
                                            ):
                                            <>
                                            <ShowToolTip
                                            children={
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleEdit(param, index)}
                                                >
                                                    <PencilIcon size={16}/>
                                                </Button>
                                            }
                                            content="编辑"
                                        />
                                                                                <ShowToolTip
                                            children={
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleConfirmDelete(index, param.version || "", param.index || "")}
                                                    className="text-destructive"
                                                >
                                                    <Trash2Icon size={16}/>
                                                </Button>
                                            }
                                            content="删除"
                                        />
                                        </>
                                        }
                                        {/* 删除按钮 */}



                                    </div>
                                </div>
                                <CardDescription>样品配方详细参数</CardDescription>
                            </CardHeader>
                            <CardContent className="max-h-[500px] overflow-y-auto pr-2">
                                {/* 基础数据部分 */}
                                <div className="w-full space-y-2">
                                    <div
                                        className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2  border-border">
                                        <Badge variant="secondary"
                                               className="px-3 py-1 text-sm font-semibold">基础数据</Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-9 p-0"
                                            onClick={() => setOpenBasicData({
                                                ...openBasicData,
                                                [param.index]: !openBasicData[param.index]
                                            })}
                                        >
                                            {openBasicData[param.index] ?
                                                <ChevronUp className="h-4 w-4"/> :
                                                <ChevronDown className="h-4 w-4"/>
                                            }
                                        </Button>
                                    </div>
                                    {openBasicData[param.index] && (
                                        <div className="space-y-4 border border-border rounded-lg p-5 bg-background shadow-sm">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
                                                <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                                                    <Label className="text-sm font-bold text-blue-700 block mb-2 pb-1 border-b border-blue-100">底材</Label>
                                                    <div className="grid grid-cols-3 gap-x-2 gap-y-1 pl-2 text-sm">
                                                        {param.baseMaterials.map((material, idx) => (
                                                            <div key={idx} className="text-sm pl-2">{material}</div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100">
                                                    <Label className="text-sm font-bold text-amber-700 block mb-2 pb-1 border-b border-amber-100">打砂</Label>
                                                    <div className="mt-1 pl-2 text-sm">
                                                        <span className="font-medium">砂径:</span> {param.sanding} 目
                                                    </div>
                                                </div>

                                                <div className="bg-sky-50/50 rounded-lg p-3 border border-sky-100 lg:col-span-1 md:col-span-2 sm:col-span-1">
                                                    <Label className="text-sm font-bold text-sky-700 block mb-2 pb-1 border-b border-sky-100">过滤</Label>
                                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-2 text-sm">
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">底油:</span> 
                                                            <span>{param.filterBottomOil} 目</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">面油:</span> 
                                                            <span>{param.filterTopOil} 目</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 lg:col-span-1 md:col-span-2 sm:col-span-1">
                                                    <Label className="text-sm font-bold text-emerald-700 block mb-2 pb-1 border-b border-emerald-100">底油</Label>
                                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-2 text-sm">
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">粘度:</span> 
                                                            <span>{param.bottomOilViscosity || "-"} 秒</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">比重:</span> 
                                                            <span>{param.bottomOilDensity || "-"} g/ml</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 lg:col-span-1 md:col-span-2 sm:col-span-1">
                                                    <Label className="text-sm font-bold text-emerald-700 block mb-2 pb-1 border-b border-emerald-100">面油</Label>
                                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-2 text-sm">
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">粘度:</span> 
                                                            <span>{param.topOilViscosity || "-"} 秒</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">比重:</span> 
                                                            <span>{param.topOilDensity || "-"} g/ml</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100">
                                                    <Label className="text-sm font-bold text-purple-700 block mb-2 pb-1 border-b border-purple-100">预热</Label>
                                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-2 text-sm">
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">温度:</span> 
                                                            <span>{param.preheatingTemperature}</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">时间:</span> 
                                                            <span>{param.preheatingTime}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100">
                                                    <Label className="text-sm font-bold text-orange-700 block mb-2 pb-1 border-b border-orange-100">烧结</Label>
                                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pl-2 text-sm">
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">温度:</span> 
                                                            <span>{param.sinteringTemperature}</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">时间:</span> 
                                                            <span>{param.sinteringTime}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-pink-50/50 rounded-lg p-3 border border-pink-100">
                                                    <Label className="text-sm font-bold text-pink-700 block mb-2 pb-1 border-b border-pink-100">颜色和光泽度</Label>
                                                    <div className="mt-1 pl-2 space-y-1 text-sm">
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">颜色:</span> 
                                                            <span>{param.color}</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <span className="font-medium">光泽度:</span> 
                                                            <span>{param.gloss}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 分割线 */}
                                <div className="border-t border-gray-200 my-3"></div>

                                {/* 干膜性能评估显示 */}
                                <div className="w-full space-y-2">
                                    <div
                                        className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2  border-border">
                                        <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">干膜性能评估
                                            (1-5级)</Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-9 p-0"
                                            onClick={() => setOpenPerformance({
                                                ...openPerformance,
                                                [param.index]: !openPerformance[param.index]
                                            })}
                                        >
                                            {openPerformance[param.index] ?
                                                <ChevronUp className="h-4 w-4"/> :
                                                <ChevronDown className="h-4 w-4"/>
                                            }
                                        </Button>
                                    </div>
                                    {openPerformance[param.index] && (
                                        <div className="space-y-2 border border-border rounded-lg p-4 bg-background shadow-sm">
                                            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100">
                                                    <span className="text-sm font-medium text-indigo-700 block mb-2 pb-1 border-b border-indigo-100">不粘性</span>
                                                    <div className="flex items-center justify-center h-12">
                                                        <span className="text-2xl font-semibold">{param.nonStickiness || "0"}</span>
                                                        <span className="text-xs text-muted-foreground ml-1">(1-5级)</span>
                                                    </div>
                                                </div>
                                                <div className="bg-cyan-50/50 rounded-lg p-3 border border-cyan-100">
                                                    <span className="text-sm font-medium text-cyan-700 block mb-2 pb-1 border-b border-cyan-100">耐磨性</span>
                                                    <div className="flex items-center justify-center h-12">
                                                        <span className="text-2xl font-semibold">{param.wearResistance || "0"}</span>
                                                        <span className="text-xs text-muted-foreground ml-1">(1-5级)</span>
                                                    </div>
                                                </div>
                                                <div className="bg-teal-50/50 rounded-lg p-3 border border-teal-100">
                                                    <span className="text-sm font-medium text-teal-700 block mb-2 pb-1 border-b border-teal-100">耐煮性</span>
                                                    <div className="flex items-center justify-center h-12">
                                                        <span className="text-2xl font-semibold">{param.boilingResistance || "0"}</span>
                                                        <span className="text-xs text-muted-foreground ml-1">(1-5级)</span>
                                                    </div>
                                                </div>
                                                <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
                                                    <span className="text-sm font-medium text-green-700 block mb-2 pb-1 border-b border-green-100">耐刮性</span>
                                                    <div className="flex items-center justify-center h-12">
                                                        <span className="text-2xl font-semibold">{param.scratchResistance || "0"}</span>
                                                        <span className="text-xs text-muted-foreground ml-1">(1-5级)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 分割线 */}
                                <div className="border-t border-gray-200 my-3"></div>

                                {/* 详细参数显示 */}
                                <div className="w-full space-y-2">
                                    <div
                                        className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2  border-border">
                                        <Badge variant="secondary"
                                               className="px-3 py-1 text-sm font-semibold">详细参数</Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-9 p-0"
                                            onClick={() => setOpenDetailParams({
                                                ...openDetailParams,
                                                [param.index]: !openDetailParams[param.index]
                                            })}
                                        >
                                            {openDetailParams[param.index] ?
                                                <ChevronUp className="h-4 w-4"/> :
                                                <ChevronDown className="h-4 w-4"/>
                                            }
                                        </Button>
                                    </div>
                                    {openDetailParams[param.index] && (
                                        <div className="space-y-4 border border-border rounded-lg p-4 bg-background shadow-sm">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                                                    <span className="text-sm font-medium text-slate-700 block mb-2 pb-1 border-b border-slate-100">Sol</span>
                                                    <div className="px-2 py-1 text-sm">{param.sol || "-"}</div>
                                                </div>
                                                <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                                                    <span className="text-sm font-medium text-slate-700 block mb-2 pb-1 border-b border-slate-100">Binder</span>
                                                    <div className="px-2 py-1 text-sm">{param.binder || "-"}</div>
                                                </div>
                                                <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                                                    <span className="text-sm font-medium text-slate-700 block mb-2 pb-1 border-b border-slate-100">Additives</span>
                                                    <div className="px-2 py-1 text-sm">{param.additives || "-"}</div>
                                                </div>
                                                <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
                                                    <span className="text-sm font-medium text-slate-700 block mb-2 pb-1 border-b border-slate-100">Mixing Ratio</span>
                                                    <div className="px-2 py-1 text-sm">{param.mixingRatio || "-"}</div>
                                                </div>
                                            </div>

                                            {/* AC解决方案组合显示 */}
                                            <div className="mt-4 bg-blue-50/30 rounded-lg p-4 border border-blue-100">
                                                <h4 className="text-sm font-bold text-blue-700 mb-3 pb-1 border-b border-blue-100">AC Solution Composition</h4>
                                                {param.acSolutionComposition && param.acSolutionComposition.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {param.acSolutionComposition.map((composition, index) => (
                                                            <div key={index} className="bg-white/80 border rounded-md p-3 shadow-sm">
                                                                <div className="font-medium text-blue-600 mb-2 pb-1 border-b border-blue-50">{composition.name || `组合 ${index + 1}`}</div>
                                                                {composition.ingredients && composition.ingredients.length > 0 ? (
                                                                    <div>
                                                                        <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground mb-1 font-medium">
                                                                            <div className="col-span-8">成分名称</div>
                                                                            <div className="col-span-4">百分比</div>
                                                                        </div>
                                                                        {composition.ingredients.map((ingredient, idx) => (
                                                                            <div key={idx} className="grid grid-cols-12 gap-1 text-sm py-1 border-t border-dashed first:border-0">
                                                                                <div className="col-span-8">{ingredient.name || "-"}</div>
                                                                                <div className="col-span-4">{ingredient.percentage || 0}%</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-xs text-muted-foreground not-italic">暂无成分</div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-white/80 border rounded-md p-3 text-sm text-muted-foreground not-italic shadow-sm">暂无AC Solution Composition</div>
                                                )}
                                            </div>

                                            {/* B解决方案组合显示 */}
                                            <div className="mt-4 bg-purple-50/30 rounded-lg p-4 border border-purple-100">
                                                <h4 className="text-sm font-bold text-purple-700 mb-3 pb-1 border-b border-purple-100">B Solution Composition</h4>
                                                {param.bSolutionComposition && param.bSolutionComposition.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {param.bSolutionComposition.map((composition, index) => (
                                                            <div key={index} className="bg-white/80 border rounded-md p-3 shadow-sm">
                                                                <div className="font-medium text-purple-600 mb-2 pb-1 border-b border-purple-50">{composition.name || `组合 ${index + 1}`}</div>
                                                                {composition.ingredients && composition.ingredients.length > 0 ? (
                                                                    <div>
                                                                        <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground mb-1 font-medium">
                                                                            <div className="col-span-8">成分名称</div>
                                                                            <div className="col-span-4">百分比</div>
                                                                        </div>
                                                                        {composition.ingredients.map((ingredient, idx) => (
                                                                            <div key={idx} className="grid grid-cols-12 gap-1 text-sm py-1 border-t border-dashed first:border-0">
                                                                                <div className="col-span-8">{ingredient.name || "-"}</div>
                                                                                <div className="col-span-4">{ingredient.percentage || 0}%</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-xs text-muted-foreground not-italic">暂无成分</div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-white/80 border rounded-md p-3 text-sm text-muted-foreground not-italic shadow-sm">暂无B Solution Composition</div>
                                                )}
                                            </div>

                                            {/* Special Record 显示 */}
                                            <div className="mt-4 bg-amber-50/30 rounded-lg p-4 border border-amber-100">
                                                <h4 className="text-sm font-bold text-amber-700 mb-3 pb-1 border-b border-amber-100">Special Record</h4>
                                                <div className="bg-white/80 p-3 border rounded-md shadow-sm text-sm">
                                                    {param.specialRecord || "暂无"}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {
                                        param.formula_qualified_status === 2 && (
                                            // 分割线
                                            <div className="w-full space-y-2">
                                                <div className="border-t border-gray-200 my-3"></div>
                                            <div
                                                className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2  border-border">
                                                <Badge variant="secondary"
                                                       className="px-3 py-1 text-sm font-semibold">淘汰原因</Badge>
                                            </div>
                                            
                                                <div className="space-y-4 mt-1">
                                                    {/* 人工标注淘汰原因 */}
                                                    <div className="border rounded-md p-3 overflow-hidden bg-muted/10">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <UserIcon className="h-4 w-4 text-orange-500" />
                                                            <h4 className="text-sm font-medium text-gray-700">人工标注淘汰原因</h4>
                                                        </div>
                                                        <div className="text-sm ml-6 break-all">
                                                            {param.formula_unqualified_reason || "暂无人工标注淘汰原因"}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* AI分析淘汰原因 */}
                                                    <div className="border rounded-md p-3 overflow-hidden bg-muted/10">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <BrainIcon className="h-4 w-4 text-blue-500" />
                                                            <h4 className="text-sm font-medium text-gray-700">AI分析淘汰原因</h4>
                                                        </div>
                                                        <div className="text-sm ml-6 break-all">
                                                            {param.ai_analysis_unqualified_reason || "暂无AI分析淘汰原因"}
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                            </div>
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* 添加配方对话框 */}
            <FormulaDialog
                isOpen={isAddOpen}
                onOpenChange={setIsAddOpen}
                title="添加配方"
                formData={formData as SampleFormulaType}
                setFormData={setFormData as React.Dispatch<React.SetStateAction<SampleFormulaType>>}
                onSave={handleSaveAdd}
                openBasicData={openAddBasicData}
                setOpenBasicData={setOpenAddBasicData}
                openPerformance={openAddPerformance}
                setOpenPerformance={setOpenAddPerformance}
                openDetailParams={openAddDetailParams}
                setOpenDetailParams={setOpenAddDetailParams}
            />

            {/* 编辑配方对话框 */}
            <FormulaDialog
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                title="编辑配方"
                formData={formData as SampleFormulaType}
                setFormData={setFormData as React.Dispatch<React.SetStateAction<SampleFormulaType>>}
                onSave={handleSaveEdit}
                openBasicData={openEditBasicData}
                setOpenBasicData={setOpenEditBasicData}
                openPerformance={openEditPerformance}
                setOpenPerformance={setOpenEditPerformance}
                openDetailParams={openEditDetailParams}
                setOpenDetailParams={setOpenEditDetailParams}
            />
            <FailedMarkDialog
                isOpen={openFailedMarkDialog}
                onOpenChange={setOpenFailedMarkDialog}
                version={failedMarkVersion}
                reason={failedMarkReason}
                setReason={setFailedMarkReason}
                index={failedMarkIndex}
                onSubmit={handleMarkFailedRequest}
            />

            <ShareConfirmDeleteDialog
                open={openConfirmDeleteDialog}
                onOpenChange={setOpenConfirmDeleteDialog}
                title="删除配方"
                description={`您确定要删除 ${DeleteFormulaData.version} 版本的配方吗？该操作无法撤销。`}
                onConfirm={confirmDelete}
                isDeleting={isLoading}
            />
        </div>
    );
}
