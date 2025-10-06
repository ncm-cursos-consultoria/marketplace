import z from "zod";

export const createJobFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  salary: z.number(),
  currencyCode: z.string(),
  description: z.string().min(1, "Descrição é obrigatória"),
  country: z.string().min(1, "País é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  workModel: z.string().min(1, "Modelo de trabalho é obrigatório"),
});

export type CreateJobFormSchema = z.infer<typeof createJobFormSchema>;
