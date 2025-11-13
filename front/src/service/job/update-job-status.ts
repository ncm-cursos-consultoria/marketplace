import { api } from "../api";
import { JobFull } from "./get-job-details"; // Importe o tipo de resposta completo

// Os status que seu backend espera
export type JobOpeningStatus = "ACTIVE" | "PAUSED" | "CLOSED";

export interface UpdateJobStatusParams {
  jobId: string;
  status: JobOpeningStatus;
}

/**
 * Atualiza o status de uma vaga (ACTIVE, PAUSED, CLOSED).
 * Envia o status como um Query Param, conforme a API.
 */
export const updateJobStatus = async ({ jobId, status }: UpdateJobStatusParams): Promise<JobFull> => {
  const { data } = await api.patch(
    `/job-opening/${jobId}/status`,
    null, // O backend não espera um 'body', então enviamos null
    {
      params: {
        jobOpeningStatus: status, // O backend espera isso como um param
      },
    }
  );
  
  // Assumindo que o backend retorna a vaga atualizada
  return data;
};