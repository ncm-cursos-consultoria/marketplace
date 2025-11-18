import { api } from "../api";

export interface TagResponse {
  id: string;
  name: string;
  type: TagType;
}

export interface GetTagParams {
  userIds?: string[];
  jobOpeningIds?: string[];
  types?: TagType[];
}

export type TagType = 'SOFT_SKILL' | 'HARD_SKILL';

export const getAllTags = async (params?: GetTagParams): Promise<TagResponse[]> => {
  const { data } = await api.get('/tag', {
    params: params
  });
  return data as TagResponse[];
};