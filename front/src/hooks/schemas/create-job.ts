import z from "zod";

export const createJobFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  salary: z.number(), // se quiser permitir vazio, troque para .optional()
  currencyCode: z.string().min(1, "Moeda é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  country: z.string().min(1, "País é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  workModel: z.string().min(1, "Modelo de trabalho é obrigatório"),

  // Novas props (simples, sem validações complexas)
  enterpriseId: z.string().min(1, "Empresa é obrigatória"),
  // thirdParty: z.boolean().optional(),
  workPeriod: z.string().optional(),   // ex.: FULL_TIME / PART_TIME
  contractType: z.string().optional(), // ex.: CLT / PJ
  workStartTime: z.string().optional(), // ex.: "09:00"
  workEndTime: z.string().optional(),   // ex.: "18:00"
});

export type CreateJobFormSchema = z.infer<typeof createJobFormSchema>;
