import { api } from "../api";

export interface TagResponse {
  id: string;
  name: string;
  type: string;
}

export interface GetTagParams {
  userIds?: string[];
  jobOpeningIds?: string[];
  types?: string[];
}

export const getAllTags = async (params: GetTagParams): Promise<TagResponse[]> => {
  const { data } = await api.get('/tag', {
    params: params
  });
  return data as TagResponse[];
};