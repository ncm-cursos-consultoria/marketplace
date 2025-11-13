import { api } from "../api";

// O tipo enum dos status
export type ApplicationStatus = "UNDER_REVIEW" | "SELECTED" | "NOT_SELECTED" | "APPROVED" | "REJECTED";

export interface UpdateCandidateStatusParams {
  jobId: string;
  userId: string;
  jobOpeningUserCandidateStatus: ApplicationStatus;
}

/**
 * Atualiza o status de um candidato DENTRO de uma vaga.
 * Assumindo que o endpoint é: PATCH /job-opening/{jobId}/submit/{userId}/status
 * (Se for diferente, ajuste a URL)
 */
export const updateCandidateStatus = async ({ jobId, userId, jobOpeningUserCandidateStatus }: UpdateCandidateStatusParams): Promise<void> => {
  
  // O seu backend espera o status como um Request Param
  await api.patch(
    `/job-opening/${jobId}/${userId}/status`,
    null, // Sem corpo (body)
    {
      params: {
        jobOpeningUserCandidateStatus: jobOpeningUserCandidateStatus, // Ex: ?status=SELECTED
      },
    }
  );
};