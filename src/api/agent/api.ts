import request from "../request";
import {ResponseData} from "../types";
import {DesignTaskCreateAgentRequest, DesignTaskCreateAgentResponse} from "./types";

const AGENT_API = {
  DESIGN_TASK_CREATE: "/agent/design-task",

}


export const aiCreateDesignTaskRequest = async (data: DesignTaskCreateAgentRequest): Promise<ResponseData<DesignTaskCreateAgentResponse>> => {
  const response = await request.post<ResponseData<DesignTaskCreateAgentResponse>>(AGENT_API.DESIGN_TASK_CREATE, data);
  return response.data;
};


