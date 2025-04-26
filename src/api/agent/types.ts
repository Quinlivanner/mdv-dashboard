export interface DesignTaskCreateAgentRequest {
  question: string;
}



export interface SampleDirection {
  is_suggestion: boolean;
  value: string;
  suggestion: string;
}

export interface DesignTaskCreateAgentResponse {
  sample_direction: SampleDirection;
  project_background: string;
  special_requirements: string;
}
