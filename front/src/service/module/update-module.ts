import { api } from "../api";
import { ApiModule } from "./get-all-modules";

export interface UpdateModuleRequest {
  title?: string;
  description?: string;
  freePlan: boolean;
  hasMentorship: boolean;
  mentorshipValuePerHour: number;
}

export async function updateModule(id: string, data: UpdateModuleRequest): Promise<ApiModule> {
  try {
    const response = await api.put(`/module/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
}