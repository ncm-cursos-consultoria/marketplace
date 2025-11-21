import { api } from "../api";

export interface ModuleParams {
  freePlan?: boolean;
}

export interface ApiModule {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  courseCount: number;
  freePlan: boolean;
  view: number;
}

export const getAllModules = async (params?: ModuleParams): Promise<ApiModule[]> => {
  try {
    const res = await api.get("/module",
      {
        params: params
      }
    )
    return res.data
  } catch (err) {
    console.log(err);
    throw new Error()
  }
}