import { api } from "../api";
import { TagResponse } from "../tag/get-all-tags";

export interface UserCandidateResponse {
  id: string,
  createdAt: string,
  updatedAt: string,
  firstName: string,
  lastName?: string,
  email: string,
  cpf: string,
  birthday?: string,
  isBlocked: boolean,
  profilePictureUrl?: string,
  curriculumVitaeUrl?: string,
  addressId?: string,
  discTag?: string,
  discId?: string,
  type: string,
  linkedInUrl?: string,
  githubUrl?: string,
  mySiteUrl?: string,
  subTitle?: string,
  about?: string,
  phoneNumber?: string,
  myApplicationStatus?: string,
  tags?: TagResponse[],
}

export interface UpdateCandidateTagParams {
  id: string,
  tagId: string,
  action: string, // true para adicionar, false para remover
}

export const updateCandidateTags = async (params: UpdateCandidateTagParams): Promise<UserCandidateResponse> => {
  const { data } = await api.patch(`/user/candidate/${params.id}/tag/${params.tagId}`,
    null, // 1. O Request Body (data) é nulo, pois seu backend não espera um.
    {
      params: { // 2. O 'action' vai aqui, nos 'params' do config.
        action: params.action,
      }
    }
  );
  return data as UserCandidateResponse;
};