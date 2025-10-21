// src/types/domain.ts

/**
 * Representa a resposta da API para uma Tag.
 * Baseado no seu DTO 'TagResponse' e no uso anterior.
 */
export interface Tag {
  id: string;
  name?: string;
  title?: string;
  type?: "HARD_SKILL" | "SOFT_SKILL" | string;
  label?: string;
}

/**
 * Representa a resposta da API para Moeda.
 * Baseado no seu DTO 'CurrencyResponse'.
 * (Estou assumindo a estrutura, já que o DTO não foi fornecido)
 */
export interface Currency {
  code: string; // Ex: "BRL"
  name: string; // Ex: "Real Brasileiro"
  symbol: string; // Ex: "R$"
}

/**
 * Baseado no 'JobOpeningStatusEnum' e no seu código de página
 */
export type JobStatus = "ACTIVE" | "PAUSED" | "CLOSED";

/**
 * Baseado no 'WorkModelEnum' e no seu código de formulário
 */
export type WorkModel = "HYBRID" | "ON_SITE" | "REMOTE";

/**
 * Baseado no 'WorkPeriodEnum' e no seu código de formulário
 */
export type WorkPeriod = 
  | "FULL_TIME" 
  | "PART_TIME" 
  | "INTERNSHIP" 
  | "FLEXIBLE" 
  | "SHIFT_WORK" 
  | "NIGHT_SHIFT" 
  | "TO_BE_DEFINED";

/**
 * Baseado no 'ContractTypeEnum' e no seu código de formulário
 */
export type ContractType = 
  | "CLT" 
  | "PJ" 
  | "FIXED_TERM" 
  | "INTERNSHIP" 
  | "COOPERATIVE" 
  | "OTHER";

/**
 * Baseado no 'JobOpeningUserCandidateStatus'
 */
export type MyApplicationStatus = 
  | "APPLIED" 
  | "REVIEWED" 
  | "INTERVIEWING" 
  | "OFFERED" 
  | "REJECTED" 
  | "HIRED" 
  | string; // Deixamos 'string' como fallback

/**
 * Baseado no 'DiscEnum'
 */
export type DiscProfile = "DOMINANCE" | "INFLUENCE" | "STEADINESS" | "CONSCIENTIOUSNESS" | string;

/**
 * Baseado no 'UserTypeEnum'
 */
export type UserType = "CANDIDATE" | "ENTERPRISE" | "ADMIN" | string;