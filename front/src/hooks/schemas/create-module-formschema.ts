import z from "zod";

export const createModuleFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  enterpriseId: z.string(),
});

export type CreateModuleFormSchema = z.infer<typeof createModuleFormSchema>