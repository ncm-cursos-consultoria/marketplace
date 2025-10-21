// src/utils/translations.ts

// Mapeia os valores de WorkPeriodEnum
export const workPeriodTranslations: Record<string, string> = {
  FULL_TIME: "Período Integral",
  PART_TIME: "Meio Período",
  INTERNSHIP: "Estágio",
  FLEXIBLE: "Flexível",
  SHIFT_WORK: "Turno / Escala",
  NIGHT_SHIFT: "Noturno",
  TO_BE_DEFINED: "A Combinar",
};

// Mapeia os valores de ContractTypeEnum
export const contractTypeTranslations: Record<string, string> = {
  CLT: "CLT (Efetivo)",
  PJ: "Pessoa Jurídica (PJ)",
  FIXED_TERM: "Prazo Determinado (Temporário)",
  INTERNSHIP: "Estágio",
  COOPERATIVE: "Cooperado",
  OTHER: "Outro",
};

// Mapeia os valores de WorkModelEnum
export const workModelTranslations: Record<string, string> = {
  HYBRID: "Híbrido",
  ON_SITE: "Presencial",
  REMOTE: "Home Office (Remoto)",
};

/**
 * Função auxiliar para formatar valores
 * Aplica a Regra 2: "o que nao tiver definido deve mostrar não informado"
 */
export function formatValue(
  value: string | null | undefined,
  translations?: Record<string, string>,
  fallback = "Não informado"
): string {
  if (!value) {
    return fallback;
  }
  // Se tiver um mapa de tradução, usa. Senão, usa o valor direto.
  return translations ? translations[value] || value : value;
}