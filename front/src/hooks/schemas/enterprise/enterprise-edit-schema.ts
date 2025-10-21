import { z } from "zod";

const cnpjRegex = /^\d{14}$/;

export const enterpriseEditSchema = z.object({
  legalName: z.string().min(1, "Razão social é obrigatória."),
  tradeName: z.string().min(1, "Nome fantasia é obrigatório."),
  cnpj: z.string()
          .regex(cnpjRegex, "CNPJ deve conter apenas 14 dígitos.")
          .length(14, "CNPJ deve ter 14 dígitos."),
  email: z.string().email("Email inválido.").min(1, "Email é obrigatório."),
  phone: z.string().optional().or(z.literal('')),
  website: z.string().url("URL do website inválida.").optional().or(z.literal('')),
  missionStatement: z.string().max(1000, "Máximo de 1000 caracteres.").optional().or(z.literal('')),
  coreValues: z.string().max(1000, "Máximo de 1000 caracteres.").optional().or(z.literal('')),
  benefits: z.string().max(1000, "Máximo de 1000 caracteres.").optional().or(z.literal('')),
});

export type EnterpriseEditSchema = z.infer<typeof enterpriseEditSchema>;