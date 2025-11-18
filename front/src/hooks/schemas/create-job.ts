import z from "zod";

export const createJobFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  // salary: z.number().min(0, "Valores negativos não são permitidos").optional().default(0), // se quiser permitir vazio, troque para .optional()
  currencyCode: z.string().min(1, "Moeda é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  country: z.string().min(1, "País é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório").max(2, "Use a sigla do estado"),
  city: z.string().min(1, "Cidade é obrigatória"),
  workModel: z.string().min(1, "Modelo de trabalho é obrigatório"),

  enterpriseId: z.string().min(1, "Empresa é obrigatória"),
  workPeriod: z.string().nonempty("Periodo é obrigatório"),   // FULL_TIME / PART_TIME
  contractType: z.preprocess(
    (value) => (value === "" ? null : value), // Se for "", transforma em null
    z.string().nullable().optional() // Valida como (string | null | undefined)
  ),
  workStartTime: z.string().optional(), // "09:00"
  workEndTime: z.string().optional(),   // "18:00"
  tagIds: z.array(z.string()),
  salary: z.number().optional().nullable(),
  salaryRangeStart: z.number().optional().nullable(),
  salaryRangeEnd: z.number().optional().nullable(),
})
  .refine(data => {
    // Se for "RANGE", 'start' e 'end' são obrigatórios
    if (data.salary == null && (data.salaryRangeStart != null || data.salaryRangeEnd != null)) {
      return data.salaryRangeStart != null && data.salaryRangeEnd != null;
    }
    return true;
  }, {
    message: "Salário inicial e final são obrigatórios para a faixa salarial.",
    path: ["salaryRangeEnd"], // Onde mostrar o erro
  });

export type CreateJobFormSchema = z.infer<typeof createJobFormSchema>;
