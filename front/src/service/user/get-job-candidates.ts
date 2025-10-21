// src/service/user/get-job-candidates.ts

import { api } from "../api";
// Importe os tipos de domínio que este DTO também usa
import type { 
  Tag, 
  DiscProfile, 
  UserType, 
  MyApplicationStatus 
} from "@/types/domain"; // Ajuste o caminho se necessário

/**
 * Representa um Candidato inscrito em uma vaga.
 * Mapeado diretamente do seu 'UserCandidateResponse' DTO.
 */
export interface JobCandidate {
  id: string;
  createdAt: string;       // Java 'Instant'
  updatedAt: string;       // Java 'Instant'
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;             // Cuidado: Este pode ser um dado sensível
  birthday: string;        // Java 'LocalDate' vira 'string' (ex: "1990-12-25")
  isBlocked: boolean;
  profilePictureUrl: string | null;
  curriculumVitaeUrl: string | null;
  addressId: string | null;
  discTag: DiscProfile | null; // 'DiscEnum'
  discId: string | null;
  type: UserType;          // 'UserTypeEnum'
  linkedInUrl: string | null;
  githubUrl: string | null;
  mySiteUrl: string | null;
  subTitle: string | null; // (Seria o "cargo" do candidato, ex: "Dev Front-end Pleno")
  about: string | null;
  phoneNumber: string | null;
  myApplicationStatus: MyApplicationStatus; // 'JobOpeningUserCandidateStatus'
  tags: Tag[];               // 'List<TagResponse>'
}

// Interface para os parâmetros da função
interface GetCandidatesParams {
  jobOpeningIds: string[]; // A API espera uma lista
}

// A sua função de serviço (já estava correta!)
export const getJobCandidates = async ({ jobOpeningIds }: GetCandidatesParams): Promise<JobCandidate[]> => {
  const { data } = await api.get('/user/candidate', {
    params: {
      jobOpeningIds, // Axios vai serializar como: ?jobOpeningIds=id1&jobOpeningIds=id2
    }
  });
  // Retornamos um array do nosso novo tipo 'JobCandidate'
  return data as JobCandidate[];
};