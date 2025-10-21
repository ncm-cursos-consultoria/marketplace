import { api } from "../api";
// Importe o snippet da sua lista de vagas
import type { 
  Tag, 
  Currency,
  JobStatus, 
  WorkModel, 
  WorkPeriod, 
  ContractType, 
  MyApplicationStatus 
} from "@/types/domain"; // Ajuste o caminho se necessário

/**
 * Interface completa para os detalhes de uma Vaga.
 * Mapeado diretamente do seu 'JobOpeningResponse' DTO.
 */
export interface JobFull {
  id: string;
  createdAt: string;       // Java 'Instant' vira 'string' no JSON
  updatedAt: string;       // Java 'Instant' vira 'string' no JSON
  title: string;
  salary: number | null;     // Java 'Double' (salário pode ser nulo ou 0)
  currency: Currency;        // 'CurrencyResponse'
  description: string;
  status: JobStatus;         // 'JobOpeningStatusEnum'
  country: string;
  state: string;
  city: string;
  workModel: WorkModel;      // 'WorkModelEnum'
  views: number;             // Java 'Integer'
  enterpriseId: string;
  enterpriseLegalName: string;
  thirdParty: boolean;       // Java 'Boolean'
  url: string | null;
  workPeriod: WorkPeriod;    // 'WorkPeriodEnum'
  contractType: ContractType | null; // 'ContractTypeEnum' (pode ser nulo)
  workStartTime: string | null;  // Java 'LocalTime' vira 'string' (ex: "09:00")
  workEndTime: string | null;    // Java 'LocalTime' vira 'string' (ex: "18:00")
  myApplicationStatus: MyApplicationStatus | null; // 'JobOpeningUserCandidateStatus'
  tags: Tag[];               // 'List<TagResponse>'
}

export const getJobDetails = async (jobId: string): Promise<JobFull> => {
  const { data } = await api.get(`/job-opening/${jobId}`);
  return data as JobFull;
};