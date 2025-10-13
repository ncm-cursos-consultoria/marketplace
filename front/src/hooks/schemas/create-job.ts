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

  enterpriseId: z.string().min(1, "Empresa é obrigatória"),
  workPeriod: z.string().optional(),   // FULL_TIME / PART_TIME
  contractType: z.string().optional(), // CLT / PJ
  workStartTime: z.string().optional(), // "09:00"
  workEndTime: z.string().optional(),   // "18:00"

  // << novo campo >>
  tagIds: z.array(z.string()),
});

export type CreateJobFormSchema = z.infer<typeof createJobFormSchema>;
